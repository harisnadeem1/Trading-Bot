import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ----------------------------------------
   1) GET — All Excluded User IDs
---------------------------------------- */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(`SELECT user_id FROM excluded_users`);
    const ids = result.rows.map((r) => r.user_id);

    res.json({
      success: true,
      userIds: ids
    });
  } catch (err) {
    console.error("Error fetching excluded users:", err);
    res.status(500).json({ success: false, message: "Failed to load excluded users" });
  }
});

/* ----------------------------------------
   2) POST — Add User to Excluded List
---------------------------------------- */
router.post("/add", protect, adminOnly, async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id)
      return res.status(400).json({ success: false, message: "User ID is required" });

    // Ensure user exists
    const checkUser = await pool.query(`SELECT id FROM users WHERE id = $1`, [user_id]);
    if (checkUser.rowCount === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    // Add to excluded list
    await pool.query(
      `INSERT INTO excluded_users (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [user_id]
    );

    res.json({ success: true, message: "User added to excluded list" });
  } catch (err) {
    console.error("Error adding excluded user:", err);
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
});

/* ----------------------------------------
   3) DELETE — Remove User from Excluded List
---------------------------------------- */
router.delete("/remove/:user_id", protect, adminOnly, async (req, res) => {
  try {
    const { user_id } = req.params;

    await pool.query(`DELETE FROM excluded_users WHERE user_id = $1`, [user_id]);

    res.json({ success: true, message: "User removed from excluded list" });
  } catch (err) {
    console.error("Error removing excluded user:", err);
    res.status(500).json({ success: false, message: "Failed to remove user" });
  }
});

export default router;
