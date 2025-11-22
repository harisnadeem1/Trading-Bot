import pool from "../config/db.js";

// 🔒 LOCK USER
export const lockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query(
      `UPDATE users 
       SET is_locked = TRUE, was_ever_locked = TRUE 
       WHERE id = $1`,
      [userId]
    );

    res.json({ success: true, message: "User account locked" });
  } catch (err) {
    console.error("LOCK USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔓 UNLOCK USER
export const unlockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query(
      `UPDATE users 
       SET is_locked = FALSE 
       WHERE id = $1`,
      [userId]
    );

    res.json({ success: true, message: "User account unlocked" });
  } catch (err) {
    console.error("UNLOCK USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
