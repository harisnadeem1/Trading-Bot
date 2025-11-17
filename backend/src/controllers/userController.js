// backend/src/controllers/userController.js
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import generateToken from "../utils/generateToken.js";

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
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const normalizedPassword = password.toLowerCase();
const validPass = await bcrypt.compare(normalizedPassword, user.rows[0].password_hash);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.rows[0].id);
    console.log(user.rows[0].role);

    res.json({
      id: user.rows[0].id,
      full_name: user.rows[0].full_name,
      email: user.rows[0].email,
      role: user.rows[0].role, // ✅ include role
      token,
    });
    
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
