import pool from "../config/db.js"; // your pg connection pool

// 1️⃣ Get all active wallet addresses
export const getDepositWallets = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        c.symbol,
        c.name,
        cn.network_name AS network,
        aw.wallet_address
      FROM admin_wallets aw
      JOIN currency_networks cn ON aw.currency_network_id = cn.id
      JOIN currencies c ON cn.currency_id = c.id
      WHERE aw.is_active = TRUE
      ORDER BY c.symbol;
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching wallets:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2️⃣ User declares a deposit
export const createDeposit = async (req, res) => {
  const userId = req.user.id;
  const { currency_symbol, network, amount, tx_hash } = req.body;

  if (!currency_symbol || !network || !amount || !tx_hash) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT cn.id 
      FROM currency_networks cn
      JOIN currencies c ON cn.currency_id = c.id
      WHERE c.symbol = $1 AND cn.network_name = $2
    `,
      [currency_symbol, network]
    );

    if (!rows.length)
      return res
        .status(400)
        .json({ success: false, message: "Invalid currency or network" });

    const currencyNetworkId = rows[0].id;

    await pool.query(
      `
      INSERT INTO transactions (user_id, currency_network_id, amount, tx_type, status, tx_hash)
      VALUES ($1, $2, $3, 'deposit', 'pending', $4)
    `,
      [userId, currencyNetworkId, amount, tx_hash]
    );

    res.json({ success: true, message: "Deposit submitted successfully" });
  } catch (err) {
    console.error("Error creating deposit:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3️⃣ Fetch user's deposit history
export const getDepositHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `
      SELECT 
        t.id,
        c.symbol,
        cn.network_name AS network,
        t.amount,
        t.status,
        t.tx_hash,
        TO_CHAR(t.created_at, 'YYYY-MM-DD') AS date,
        TO_CHAR(t.created_at, 'HH12:MI AM') AS time
      FROM transactions t
      JOIN currency_networks cn ON t.currency_network_id = cn.id
      JOIN currencies c ON cn.currency_id = c.id
      WHERE t.user_id = $1 AND t.tx_type = 'deposit'
      ORDER BY t.created_at DESC
    `,
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching deposit history:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
