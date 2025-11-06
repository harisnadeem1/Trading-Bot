// createAdmin.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import pool from "./src/config/db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const { JWT_SECRET } = process.env;

    // ✅ Verify secret key exists
    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env");
      process.exit(1);
    }

    const full_name = "Admin User";
    const email = "admin@novatrade.ai";
    const password = "Admin123!";
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = "ADMIN001";

    // Check if admin exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      console.log("⚠️ Admin already exists.");
      process.exit(0);
    }

    // Create new admin
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, referral_code, role)
       VALUES ($1, $2, $3, $4, 'admin')`,
      [full_name, email, hashedPassword, referralCode]
    );

    console.log("✅ Admin created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

createAdmin();
