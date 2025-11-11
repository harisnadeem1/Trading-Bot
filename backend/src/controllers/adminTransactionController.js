import pool from "../config/db.js";

export const getAllTransactions = async (req, res) => {
  try {
    const { type = "deposit", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // ✅ Validate type
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
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Only allow "approved" or "rejected"
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    // Fetch transaction to ensure it exists
    const { rows } = await pool.query(`SELECT * FROM transactions WHERE id = $1`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const transaction = rows[0];

    // ✅ Update the transaction status
    await pool.query(`UPDATE transactions SET status = $1 WHERE id = $2`, [status, id]);

    // ✅ Deposit approval → add funds
    if (transaction.tx_type === "deposit" && status === "approved") {
      await pool.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [transaction.amount, transaction.user_id]
      );
    }

    // ✅ Withdrawal rejection → refund the user
    if (transaction.tx_type === "withdraw" && status === "rejected") {
      await pool.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [transaction.amount, transaction.user_id]
      );
    }

    // ⚠️ Withdrawal approval → do nothing (balance already deducted on request)

    res.json({ success: true, message: `Transaction ${status} successfully` });
  } catch (err) {
    console.error("❌ Error updating transaction status:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
