import pool from "../config/db.js";
import cron from "node-cron";

export const startDailyRoiJob = () => {
  // Runs every day at 2 AM (production schedule)
  cron.schedule("0 2 * * *", async () => {
    console.log("🕒 Running Daily ROI Job...");
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const today = new Date().toISOString().split("T")[0];

      // 1️⃣ Get all active investments
      const { rows: investments } = await client.query(`
        SELECT i.*, p.id AS plan_id, p.name AS plan_name,
               p.min_amount, p.max_amount, p.monthly_target_roi, p.duration_days
        FROM investments i
        JOIN plans p ON p.id = i.plan_id
        WHERE i.status = 'active'
      `);

      if (investments.length === 0) {
        console.log("✅ No active investments found.");
        await client.query("COMMIT");
        return;
      }

      for (const inv of investments) {
        // --- 🔍 Step 1: check user balance
        const { rows: userRes } = await client.query(
          `SELECT balance FROM users WHERE id = $1`,
          [inv.user_id]
        );
        const userBalance = Number(userRes[0]?.balance || 0);

        // --- 🔎 Step 2: verify if user still qualifies for the plan
        if (userBalance < inv.amount) {
          const stillEligible =
            userBalance >= inv.min_amount &&
            (inv.max_amount === null || userBalance <= inv.max_amount);

          if (stillEligible) {
            // Update his enrolled amount to new balance
            await client.query(
              `UPDATE investments SET amount = $1 WHERE id = $2`,
              [userBalance, inv.id]
            );
            console.log(
              `⚖️ Updated investment ${inv.id} amount → $${userBalance} (same plan).`
            );
          } else {
            // Try finding a lower eligible plan
            const { rows: plans } = await client.query(`
              SELECT id, name, min_amount, max_amount, duration_days, monthly_target_roi
              FROM plans
              WHERE is_active = TRUE
              ORDER BY min_amount DESC
            `);

            const lowerPlan = plans.find(
              (p) =>
                userBalance >= p.min_amount &&
                (p.max_amount === null || userBalance <= p.max_amount)
            );

            if (lowerPlan) {
              // Move user to lower plan
              const expectedReturn =
                userBalance +
                (userBalance * Number(lowerPlan.monthly_target_roi)) / 100;
              const newEnd = new Date();
              newEnd.setDate(newEnd.getDate() + Number(lowerPlan.duration_days));

              await client.query(
                `UPDATE investments
                 SET plan_id = $1, amount = $2, expected_return = $3, end_date = $4
                 WHERE id = $5`,
                [lowerPlan.id, userBalance, expectedReturn, newEnd, inv.id]
              );
              console.log(
                `🔁 User ${inv.user_id} downgraded → ${lowerPlan.name} plan ($${userBalance}).`
              );
            } else {
              // No plan available — complete investment
              await client.query(
                `UPDATE investments SET status = 'completed' WHERE id = $1`,
                [inv.id]
              );
              console.log(
                `🚫 User ${inv.user_id} balance too low → investment ${inv.id} completed.`
              );
              continue; // Skip ROI for this investment
            }
          }
        }

        // --- 💰 Step 3: Get ROI % for today
        const { rows: roiRes } = await client.query(
          `SELECT roi_percent FROM plan_daily_returns
           WHERE plan_id = $1 AND date = $2`,
          [inv.plan_id, today]
        );

        const roiPercent =
          roiRes.length > 0
            ? Number(roiRes[0].roi_percent)
            : Number(inv.monthly_target_roi) / Number(inv.duration_days);

        const roiAmount = (Number(inv.amount) * roiPercent) / 100;

        if (roiAmount === 0) continue; // Skip neutral days

        // --- 📈 Step 4: Apply ROI (profit or loss)
        await client.query(
          `UPDATE users
           SET balance = balance + $1,
               roi_earnings = roi_earnings + $1
           WHERE id = $2`,
          [roiAmount, inv.user_id]
        );

        // --- 🧾 Step 5: Log transaction
        await client.query(
          `INSERT INTO transactions (user_id, tx_type, amount, status)
           VALUES ($1, 'daily_roi', $2, 'approved')`,
          [inv.user_id, roiAmount]
        );

        console.log(
          `📊 ROI ${roiPercent.toFixed(3)}% (${roiAmount.toFixed(
            2
          )}) → user ${inv.user_id} (plan ${inv.plan_id})`
        );

        // --- ⏱️ Step 6: Check for plan completion
        const now = new Date();
        if (now >= new Date(inv.end_date)) {
          await client.query(
            `UPDATE investments SET status = 'completed' WHERE id = $1`,
            [inv.id]
          );
          console.log(`🏁 Investment ${inv.id} completed.`);

          // Auto reinvest based on updated balance
          const { rows: uBal } = await client.query(
            `SELECT balance FROM users WHERE id = $1`,
            [inv.user_id]
          );
          const newBalance = Number(uBal[0]?.balance || 0);

          if (newBalance > 0) {
            const { rows: plans } = await client.query(`
              SELECT id, name, min_amount, max_amount, duration_days, monthly_target_roi
              FROM plans
              WHERE is_active = TRUE
              ORDER BY min_amount ASC
            `);

            const bestPlan = plans.find(
              (p) =>
                newBalance >= p.min_amount &&
                (p.max_amount === null || newBalance <= p.max_amount)
            );

            if (bestPlan) {
              const endDate = new Date();
              endDate.setDate(
                endDate.getDate() + Number(bestPlan.duration_days)
              );
              const expectedReturn =
                newBalance +
                (newBalance * Number(bestPlan.monthly_target_roi)) / 100;

              await client.query(
                `INSERT INTO investments (user_id, plan_id, amount, expected_return, end_date)
                 VALUES ($1, $2, $3, $4, $5)`,
                [inv.user_id, bestPlan.id, newBalance, expectedReturn, endDate]
              );

              console.log(
                `♻️ Auto-reinvested user ${inv.user_id} into plan "${bestPlan.name}" ($${newBalance})`
              );
            }
          }
        }
      }

      await client.query("COMMIT");
      console.log("🎯 Daily ROI Job completed.\n");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("❌ [DAILY ROI JOB ERROR]:", err);
    } finally {
      client.release();
    }
  });
};
