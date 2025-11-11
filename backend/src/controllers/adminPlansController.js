import pool from "../config/db.js";

// ✅ Get all plans
export const getPlans = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, min_amount, max_amount, monthly_target_roi AS roi, 
             duration_days AS duration, auto_roi_generation AS auto_roi, is_active
      FROM plans
      ORDER BY min_amount ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching plans:", err);
    res.status(500).json({ success: false, message: "Failed to fetch plans" });
  }
};

// ✅ Create a new plan
export const createPlan = async (req, res) => {
  const { name, description, minAmount, maxAmount, roi, autoRoi, duration } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Create plan
    const planResult = await client.query(
      `INSERT INTO plans 
         (name, description, min_amount, max_amount, monthly_target_roi, auto_roi_generation, duration_days)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name, description, minAmount, maxAmount, roi, autoRoi, duration]
    );

    const planId = planResult.rows[0].id;

    // 2️⃣ Generate daily ROI distribution with random loss days
    const total = parseFloat(roi);
    const days = parseInt(duration);

    // Randomly choose 2–4 loss days (3 typical)
    const numLossDays = Math.min(3, Math.floor(days / 10));
    const lossDayIndices = new Set();
    while (lossDayIndices.size < numLossDays) {
      lossDayIndices.add(Math.floor(Math.random() * days));
    }

    // Generate random base positive ROI distribution
    let randoms = Array.from({ length: days }, () => Math.random());
    const baseSum = randoms.reduce((a, b) => a + b, 0);
    randoms = randoms.map(r => (r / baseSum) * total);

    // Introduce losses — small negative values on selected days
    const avgDaily = total / days;
    const lossMagnitude = avgDaily * 0.8; // small daily loss (~-0.1% to -0.3%)
    for (const idx of lossDayIndices) {
      randoms[idx] = -parseFloat((Math.random() * lossMagnitude).toFixed(3));
    }

    // Adjust profits to ensure total sum == target ROI
    let net = randoms.reduce((a, b) => a + b, 0);
    const adjustmentFactor = total / net;
    randoms = randoms.map(v => parseFloat((v * adjustmentFactor).toFixed(3)));

    // Fix rounding drift
    const diff = total - randoms.reduce((a, b) => a + b, 0);
    randoms[0] = parseFloat((randoms[0] + diff).toFixed(3));

    // 3️⃣ Insert daily ROI data into plan_daily_returns
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + i);

      await client.query(
        `INSERT INTO plan_daily_returns (plan_id, date, roi_percent)
         VALUES ($1, $2, $3)`,
        [planId, dayDate.toISOString().split("T")[0], randoms[i]]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Plan and daily returns created successfully",
      data: { planId, totalRoi: total, days, lossDays: [...lossDayIndices] }
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating plan:", err);
    res.status(500).json({ success: false, message: "Failed to create plan" });
  } finally {
    client.release();
  }
};



// ✅ Update existing plan
export const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, minAmount, maxAmount, roi, autoRoi, duration } = req.body;

  try {
    const result = await pool.query(
      `UPDATE plans
       SET name = $1, description = $2, min_amount = $3, max_amount = $4,
           monthly_target_roi = $5, auto_roi_generation = $6, duration_days = $7
       WHERE id = $8
       RETURNING *`,
      [name, description, minAmount, maxAmount, roi, autoRoi, duration, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Plan not found" });

    res.json({ success: true, message: "Plan updated successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Error updating plan:", err);
    res.status(500).json({ success: false, message: "Failed to update plan" });
  }
};

// ✅ Delete a plan
export const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    // delete plan_daily_returns first to avoid FK errors
    await pool.query(`DELETE FROM plan_daily_returns WHERE plan_id = $1`, [id]);
    const result = await pool.query(`DELETE FROM plans WHERE id = $1 RETURNING id`, [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Plan not found" });

    res.json({ success: true, message: "Plan deleted successfully" });
  } catch (err) {
    console.error("Error deleting plan:", err);
    res.status(500).json({ success: false, message: "Failed to delete plan" });
  }
};
