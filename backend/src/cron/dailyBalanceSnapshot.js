import pool from "../config/db.js";
import cron from "node-cron";

export const startDailyBalanceSnapshot = () => {
  // Run at 2:15 AM (after ROI updates)
  cron.schedule("15 2 * * *", async () => {
    console.log("📊 Running Daily Balance Snapshot Job...");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const today = new Date().toISOString().split("T")[0];

      const { rows: users } = await client.query(`SELECT id, balance FROM users`);
      if (users.length === 0) {
        console.log("⚠️ No users found to snapshot.");
        await client.query("COMMIT");
        return;
      }

      for (const user of users) {
        await client.query(
          `
          INSERT INTO user_balance_snapshots (user_id, date, balance)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, date)
          DO UPDATE SET balance = EXCLUDED.balance
          `,
          [user.id, today, user.balance]
        );
      }

      await client.query("COMMIT");
      console.log(`✅ Snapshots saved for ${users.length} users.\n`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("❌ [BALANCE SNAPSHOT ERROR]:", err);
    } finally {
      client.release();
    }
  });
};
