import pool from "../config/db.js";

export const getAllTransactions = async (req, res) => {
  try {
    const { type = "deposit", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!["deposit", "withdraw"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid transaction type" });
    }

    const query = `
      SELECT 
        t.id,
        u.email AS user_email,
        CONCAT('USR-', LPAD(u.id::text, 3, '0')) AS user_id,
        c.symbol AS currency_symbol,
        c.name AS currency_name,
        cn.network_name,
        t.amount,
        t.wallet_address,
        t.tx_hash,
        t.status,
        t.tx_type,
        t.created_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN currency_networks cn ON t.currency_network_id = cn.id
      LEFT JOIN currencies c ON cn.currency_id = c.id
      WHERE t.tx_type = $1
      ORDER BY t.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `SELECT COUNT(*) FROM transactions WHERE tx_type = $1`;

    const [transactionsResult, countResult] = await Promise.all([
      pool.query(query, [type, limit, offset]),
      pool.query(countQuery, [type]),
    ]);

    const formatted = transactionsResult.rows.map((t) => ({
      id: t.id,
      user: t.user_email,
      userId: t.user_id,
      coin: t.currency_symbol || "N/A",
      amount: Number(t.amount),
      wallet: t.wallet_address,
      txHash: t.tx_hash,
      status: t.status,
      type: t.tx_type,
      date: new Date(t.created_at).toLocaleDateString(),
      time: new Date(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));

    res.json({
      success: true,
      data: formatted,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(countResult.rows[0].count / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching admin transactions:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateTransactionStatus = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    // Fetch the transaction
    const { rows } = await client.query(`SELECT * FROM transactions WHERE id = $1`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const transaction = rows[0];

    // Begin SQL transaction for atomicity
    await client.query("BEGIN");

    // Update transaction status
    await client.query(`UPDATE transactions SET status = $1 WHERE id = $2`, [status, id]);

    // ✅ Deposit approval logic
    if (transaction.tx_type === "deposit" && status === "approved") {
      // 1️⃣ Credit the depositor
      await client.query(
        `UPDATE users SET 
            balance = balance + $1,
            total_deposits = total_deposits + $1
         WHERE id = $2`,
        [transaction.amount, transaction.user_id]
      );

      // 2️⃣ Build referrer chain (up to 5 levels)
      const ancestors = [];
      let currentUserId = transaction.user_id;

      for (let level = 1; level <= 5; level++) {
        const refQuery = `
          SELECT u2.id AS referrer_id
          FROM users u1
          JOIN users u2 ON u1.referred_by = u2.referral_code
          WHERE u1.id = $1
        `;
        const refResult = await client.query(refQuery, [currentUserId]);
        if (refResult.rows.length === 0) break;

        const referrerId = refResult.rows[0].referrer_id;
        ancestors.push({ level, referrerId });
        currentUserId = referrerId; // move up the chain
      }

      // 3️⃣ For each ancestor, give commission
      for (const ancestor of ancestors) {
        const { level, referrerId } = ancestor;

        // Fetch level percentage
        const levelRes = await client.query(
          `SELECT commission_percent FROM referral_levels 
           WHERE level = $1 AND commission_type = 'direct'`,
          [level]
        );
        if (levelRes.rows.length === 0) continue;

        const percent = parseFloat(levelRes.rows[0].commission_percent);
        const commission = (transaction.amount * percent) / 100;

        // Credit referrer
        await client.query(
          `UPDATE users 
             SET balance = balance + $1,
                 affiliate_earnings = affiliate_earnings + $1
           WHERE id = $2`,
          [commission, referrerId]
        );

        // 🔥 NEW: Store related_user_id = the depositor
        await client.query(
          `INSERT INTO transactions (user_id, related_user_id, tx_type, amount, status)
           VALUES ($1, $2, 'referral_direct', $3, 'approved')`,
          [referrerId, transaction.user_id, commission]
        );

        // Update or insert referral record
        await client.query(
          `INSERT INTO referrals (referrer_id, referred_user_id, commission_earned)
           VALUES ($1, $2, $3)
           ON CONFLICT (referrer_id, referred_user_id)
           DO UPDATE SET commission_earned = referrals.commission_earned + EXCLUDED.commission_earned`,
          [referrerId, transaction.user_id, commission]
        );
      }
    }

    // ✅ Withdrawal rejection → refund user
    if (transaction.tx_type === "withdraw" && status === "rejected") {
      await client.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [transaction.amount, transaction.user_id]
      );
    }

    await client.query("COMMIT");
    res.json({ success: true, message: `Transaction ${status} successfully` });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error updating transaction status:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    client.release();
  }
};

