// src/server.js
import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
});
