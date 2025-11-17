import pool from "../config/db.js";

/* ============================================================
   📌 FETCH ALL TRANSACTIONS (ADMIN TABLE)
============================================================ */
export const getAllTransactions = async (req, res) => {
  try {
    const { type = "deposit", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!["deposit", "withdraw"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid transaction type" });
    }

    const query = `
      SELECT 
        t.id,
        u.email AS user_email,
        CONCAT('USR-', LPAD(u.id::text, 3, '0')) AS user_id,
        c.symbol AS currency_symbol,
        cn.network_name,
        t.amount,
        t.usd_value,
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
      amount: Number(t.usd_value), // ALWAYS show stored USD
      wallet: t.wallet_address,
      txHash: t.tx_hash,
      status: t.status,
      type: t.tx_type,
      date: new Date(t.created_at).toLocaleDateString(),
      time: new Date(t.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
    res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* ============================================================
   📌 UPDATE TRANSACTION STATUS (APPROVE / REJECT)
============================================================ */
export const updateTransactionStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    // Fetch the transaction
    const { rows } = await client.query(
      `SELECT * FROM transactions WHERE id = $1`,
      [id]
    );
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    const transaction = rows[0];

    await client.query("BEGIN");

    // Update status
    await client.query(
      `UPDATE transactions SET status = $1 WHERE id = $2`,
      [status, id]
    );

    /* ============================================================
       ✅ DEPOSIT APPROVAL → CREDIT USER + REFERRALS
    ============================================================= */
    if (transaction.tx_type === "deposit" && status === "approved") {
      console.log("🟢 Deposit Approval Triggered.");

      // ⭐ Use STORED usd_value
      const usdValue = Number(transaction.usd_value);

      // 1️⃣ Credit user wallet
      await client.query(
        `UPDATE users SET 
            balance = balance + $1,
            total_deposits = total_deposits + $1
         WHERE id = $2`,
        [usdValue, transaction.user_id]
      );

      /* ============================================================
         🔥 REFERRAL COMMISSIONS
      ============================================================= */
      const ancestors = [];
      let currentUserId = transaction.user_id;

      for (let level = 1; level <= 5; level++) {
        const refResult = await client.query(
          `SELECT u2.id AS referrer_id
           FROM users u1
           JOIN users u2 ON u1.referred_by = u2.referral_code
           WHERE u1.id = $1`,
          [currentUserId]
        );

        if (!refResult.rows.length) break;

        const referrerId = refResult.rows[0].referrer_id;
        ancestors.push({ level, referrerId });

        currentUserId = referrerId;
      }

      // Pay commissions
      for (const ancestor of ancestors) {
        const { level, referrerId } = ancestor;

        const levelRes = await client.query(
          `SELECT commission_percent FROM referral_levels 
           WHERE level = $1 AND commission_type = 'direct'`,
          [level]
        );

        if (!levelRes.rows.length) continue;

        const percent = parseFloat(levelRes.rows[0].commission_percent);
        const commission = (usdValue * percent) / 100;

        // Update referral wallet
        await client.query(
          `UPDATE users 
             SET balance = balance + $1,
                 affiliate_earnings = affiliate_earnings + $1
           WHERE id = $2`,
          [commission, referrerId]
        );

        // Log transaction
        await client.query(
          `INSERT INTO transactions 
           (user_id, related_user_id, tx_type, amount, status)
           VALUES ($1, $2, 'referral_direct', $3, 'approved')`,
          [referrerId, transaction.user_id, commission]
        );

        // Update referral table
        await client.query(
          `INSERT INTO referrals (referrer_id, referred_user_id, commission_earned)
           VALUES ($1, $2, $3)
           ON CONFLICT (referrer_id, referred_user_id)
           DO UPDATE SET commission_earned = referrals.commission_earned + EXCLUDED.commission_earned`,
          [referrerId, transaction.user_id, commission]
        );
      }
    }

    /* ============================================================
       🔴 WITHDRAWAL REJECTION → REFUND
    ============================================================= */
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
    console.error("❌ ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    client.release();
  }
};
