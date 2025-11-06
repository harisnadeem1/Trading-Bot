import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query("SELECT id, email, role FROM users WHERE id = $1", [decoded.id]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", expired: true });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
