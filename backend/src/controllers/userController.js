// backend/src/controllers/userController.js
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import generateToken from "../utils/generateToken.js";
import { checkUserLockStatus } from "../utils/checkUserLockStatus.js";

// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  const { full_name, email, password, referred_by } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const normalizedPassword = password.toLowerCase();
const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
    const referralCode = `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const newUser = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, referral_code, referred_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, referral_code, referred_by`,
      [full_name, email, hashedPassword, referralCode, referred_by || null]
    );

    const token = generateToken(newUser.rows[0].id);

    res.status(201).json({ ...newUser.rows[0], token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = userRes.rows[0];

    const normalizedPassword = password.toLowerCase();
    const validPass = await bcrypt.compare(normalizedPassword, user.password_hash);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 Apply 60-day lock logic here
    const lockStatus = await checkUserLockStatus(user.id);
    if (lockStatus.locked) {
      return res.status(403).json({
        error: "ACCOUNT_LOCKED",
        message: "Your 60-day access has expired. Contact support."
      });
    }

    const token = generateToken(user.id);

    res.json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔥 Apply lock logic
    const lockStatus = await checkUserLockStatus(userId);
    if (lockStatus.locked) {
      return res.status(403).json({
        error: "ACCOUNT_LOCKED",
        message: "Your 60-day access has expired. Contact support."
      });
    }

    // Get full user data
    const result = await pool.query(`
      SELECT id, full_name, email, role, balance, total_deposits, total_withdrawals
      FROM users
      WHERE id = $1
    `, [userId]);

    res.json(result.rows[0]);
    
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

