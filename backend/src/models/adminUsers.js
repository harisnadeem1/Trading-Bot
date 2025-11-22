import pool from "../config/db.js";

/* ------------------------------------------
   GET ALL USERS
------------------------------------------- */
export const dbGetAllUsers = async ({ search, role, limit, offset }) => {
  // Search by name or email  
  let whereClause = `
    WHERE 
      (LOWER(full_name) LIKE LOWER('%${search}%')
      OR LOWER(email) LIKE LOWER('%${search}%'))
  `;

  // Role filter
  if (role !== "All") {
    whereClause += ` AND role = '${role.toLowerCase()}'`;
  }

  const query = `
    SELECT 
      id,
      full_name AS name,
      email,
      created_at AS joinDate,
      total_deposits AS "totalDeposited",
      total_withdrawals AS "totalWithdrawn",
      role,
      is_locked,
      was_ever_locked
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM users
    ${whereClause}
  `;

  const [rows, countRes] = await Promise.all([
    pool.query(query, [limit, offset]),
    pool.query(countQuery),
  ]);

  return {
    users: rows.rows,
    total: Number(countRes.rows[0].total),
  };
};


/* ------------------------------------------
   GET SINGLE USER
------------------------------------------- */
export const dbGetUserById = async (id) => {
  const query = `
    SELECT 
      id,
      full_name AS name,
      email,
      balance,
      total_deposits AS totalDeposited,
      total_withdrawals AS totalWithdrawn,
      roi_earnings,
      affiliate_earnings,
      role,
      created_at
    FROM users
    WHERE id = $1
  `;
  const res = await pool.query(query, [id]);
  return res.rows[0];
};


/* ------------------------------------------
   UPDATE ROLE
------------------------------------------- */
export const dbUpdateUserRole = async (id, role) => {
  const query = `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING id
  `;
  const res = await pool.query(query, [role, id]);
  return res.rows.length > 0;
};
