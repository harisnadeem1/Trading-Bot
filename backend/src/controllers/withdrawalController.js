import pool from "../config/db.js";

/** 
 * GET /api/withdraw/options
 * Fetch user balance and all active currencies with networks
 */
export const getWithdrawOptions = async (req, res) => {
  const userId = req.user.id; // assuming auth middleware adds req.user
  try {
    // 1️⃣ Fetch user balance
    const { rows: userRes } = await pool.query(
      `SELECT balance FROM users WHERE id = $1`,
      [userId]
    );
    const balance = Number(userRes[0]?.balance || 0);

    // 2️⃣ Fetch currencies + their active networks
    const { rows: currencies } = await pool.query(`
      SELECT c.id AS currency_id, c.symbol, c.name,
             json_agg(
               json_build_object(
                 'network_id', n.id,
                 'network_name', n.network_name
               )
             ) AS networks
      FROM currencies c
      JOIN currency_networks n ON n.currency_id = c.id
      WHERE c.is_active = TRUE AND n.is_active = TRUE
      GROUP BY c.id, c.symbol, c.name
      ORDER BY c.id ASC
    `);

    res.json({
      success: true,
      balance,
      currencies,
    });
  } catch (err) {
    console.error("❌ [GET WITHDRAW OPTIONS ERROR]:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


/**
 * POST /api/withdraw/request
 * Create a withdrawal request
 */
export const createWithdrawal = async (req, res) => {
  const userId = req.user.id;
  const { currencyNetworkId, amount, walletAddress } = req.body;

  if (!currencyNetworkId || !amount || !walletAddress)
    return res.status(400).json({ success: false, message: "Missing fields" });

  const withdrawAmount = parseFloat(amount);

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    // 1️⃣ Validate user balance
    const { rows: userRes } = await client.query(
      `SELECT balance FROM users WHERE id = $1`,
      [userId]
    );
    const balance = Number(userRes[0]?.balance || 0);

    if (withdrawAmount < 50)
      throw new Error("Minimum withdrawal is $50");
    if (withdrawAmount > balance)
      throw new Error("Insufficient balance");

    // 2️⃣ Create withdrawal record
    await client.query(
      `INSERT INTO transactions (user_id, currency_network_id, tx_type, amount, wallet_address, status)
       VALUES ($1, $2, 'withdraw', $3, $4, 'pending')`,
      [userId, currencyNetworkId, withdrawAmount, walletAddress]
    );

    // 3️⃣ Deduct balance immediately (optional, safer)
    await client.query(
      `UPDATE users SET balance = balance - $1, total_withdrawals = total_withdrawals + $1 WHERE id = $2`,
      [withdrawAmount, userId]
    );

    await client.query("COMMIT");
    res.json({ success: true, message: "Withdrawal request submitted successfully" });
  } catch (err) {
    console.error("❌ [WITHDRAW REQUEST ERROR]:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};




export const getWithdrawHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        t.id,
        t.amount,
        t.status,
        t.wallet_address,
        t.created_at,
        cn.network_name,
        c.symbol AS currency_symbol,
        c.name AS currency_name
      FROM transactions t
      LEFT JOIN currency_networks cn ON t.currency_network_id = cn.id
      LEFT JOIN currencies c ON cn.currency_id = c.id
      WHERE t.user_id = $1 AND t.tx_type = 'withdraw'
      ORDER BY t.created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Error fetching withdraw history:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};