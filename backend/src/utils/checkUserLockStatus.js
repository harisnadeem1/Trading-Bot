import pool from "../config/db.js";

export const checkUserLockStatus = async (userId) => {
  const depositRes = await pool.query(
    `
    SELECT 
      COUNT(*) AS deposit_count,
      MIN(created_at) AS first_deposit
    FROM transactions
    WHERE user_id = $1
      AND tx_type = 'deposit'
      AND status = 'approved'
    `,
    [userId]
  );

  const depositCount = Number(depositRes.rows[0].deposit_count);
  const firstDeposit = depositRes.rows[0].first_deposit;

  if (depositCount === 0) {
    return { locked: false };
  }

  const userRes = await pool.query(
    `
    SELECT is_locked, was_ever_locked
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  const { is_locked, was_ever_locked } = userRes.rows[0];

  if (is_locked) {
    return { locked: true, reason: "ADMIN" };
  }

  if (was_ever_locked && !is_locked) {
    return { locked: false };
  }

  const daysDiff = firstDeposit
    ? (Date.now() - new Date(firstDeposit)) / (1000 * 60 * 60 * 24)
    : 0;

  if (daysDiff >= 60 && !was_ever_locked) {
    await pool.query(
      `
      UPDATE users
      SET is_locked = TRUE,
          was_ever_locked = TRUE
      WHERE id = $1
      `,
      [userId]
    );

    return { locked: true, reason: "AUTO" };
  }

  return { locked: false };
};
