import pool from "../config/db.js";
import cron from "node-cron";

const generateDailyRoiArray = (total, days) => {
  const numLossDays = Math.min(3, Math.floor(days / 10));
  const lossDays = new Set();
  while (lossDays.size < numLossDays) {
    lossDays.add(Math.floor(Math.random() * days));
  }

  let randoms = Array.from({ length: days }, () => Math.random());
  const baseSum = randoms.reduce((a, b) => a + b, 0);
  randoms = randoms.map((r) => (r / baseSum) * total);

  const avg = total / days;
  const lossMagnitude = avg * 0.8;
  for (const idx of lossDays) {
    randoms[idx] = -parseFloat((Math.random() * lossMagnitude).toFixed(3));
  }

  let net = randoms.reduce((a, b) => a + b, 0);
  const adj = total / net;
  randoms = randoms.map((v) => parseFloat((v * adj).toFixed(3)));
  const diff = total - randoms.reduce((a, b) => a + b, 0);
  randoms[0] = parseFloat((randoms[0] + diff).toFixed(3));

  return randoms;
};

export const startPlanRoiRegenerator = () => {
  // Run every day at 1 AM
  cron.schedule("0 1 * * *", async () => {
    console.log("🔁 Running Plan ROI Regeneration Job...");
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows: plans } = await client.query(`
        SELECT id, monthly_target_roi AS roi, duration_days
        FROM plans
        WHERE is_active = TRUE
      `);

      const today = new Date();

      for (const plan of plans) {
        const { rows: lastRow } = await client.query(
          `SELECT MAX(date) AS last_date FROM plan_daily_returns WHERE plan_id = $1`,
          [plan.id]
        );

        const lastDate = lastRow[0].last_date ? new Date(lastRow[0].last_date) : null;

        if (!lastDate || lastDate <= today) {
          console.log(`🧮 Regenerating ROI for plan ${plan.id}...`);

          await client.query(`DELETE FROM plan_daily_returns WHERE plan_id = $1`, [
            plan.id,
          ]);

          const randomRois = generateDailyRoiArray(plan.roi, plan.duration_days);

          for (let i = 0; i < plan.duration_days; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);

            await client.query(
              `INSERT INTO plan_daily_returns (plan_id, date, roi_percent)
               VALUES ($1, $2, $3)`,
              [plan.id, d.toISOString().split("T")[0], randomRois[i]]
            );
          }
          console.log(`✅ Plan ${plan.id} regenerated successfully.`);
        }
      }

      await client.query("COMMIT");
      console.log("🎯 Plan ROI regeneration complete.\n");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("❌ [PLAN REGEN ERROR]:", err);
    } finally {
      client.release();
    }
  });
};
