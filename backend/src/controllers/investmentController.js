import pool from "../config/db.js";

export const startInvestment = async (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Check if user already has an active investment
    const existing = await client.query(
      `SELECT id FROM investments WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.json({
        success: false,
        message: "You already have an active investment in progress.",
      });
    }

    // 2️⃣ Get user balance
    const userRes = await client.query(
      `SELECT balance FROM users WHERE id = $1 FOR UPDATE`,
      [userId]
    );
    const balance = Number(userRes.rows[0]?.balance || 0);

    if (balance <= 0)
      return res.json({ success: false, message: "Insufficient balance." });

    // 3️⃣ Find best plan
    const planRes = await client.query(
      `SELECT * FROM plans
       WHERE is_active = TRUE
       AND min_amount <= $1
       AND (max_amount IS NULL OR max_amount >= $1)
       ORDER BY min_amount DESC
       LIMIT 1`,
      [balance]
    );

    if (planRes.rows.length === 0)
      return res.json({
        success: false,
        message: "No suitable investment plan found for your balance.",
      });

    const plan = planRes.rows[0];

    // 4️⃣ Calculate end date & expected return
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(plan.duration_days));

    const expectedReturn =
      balance + (balance * Number(plan.monthly_target_roi)) / 100;

    // 5️⃣ Insert new investment
    const investRes = await client.query(
      `INSERT INTO investments (user_id, plan_id, amount, expected_return, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [userId, plan.id, balance, expectedReturn, endDate]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: `Investment started successfully under "${plan.name}".`,
      data: {
        planName: plan.name,
        investedAmount: balance,
        expectedReturn,
        duration: plan.duration_days,
        investmentId: investRes.rows[0].id,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error starting investment:", err);
    res.status(500).json({ success: false, message: "Failed to start investment." });
  } finally {
    client.release();
  }
};


export const getActiveInvestment = async (req, res) => {
  try {
    const { id: userId } = req.user;

    // Fetch the active investment and its plan details
    const { rows } = await pool.query(
      `
      SELECT 
        i.id,
        i.amount,
        i.plan_id,
        i.start_date,
        i.end_date,
        i.status,
        p.name AS plan_name,
        p.monthly_target_roi,
        p.duration_days
      FROM investments i
      JOIN plans p ON p.id = i.plan_id
      WHERE i.user_id = $1
        AND i.status = 'active'
      ORDER BY i.start_date DESC
      LIMIT 1
      `,
      [userId]
    );

    // No active investment
    if (rows.length === 0) {
      return res.json({ success: true, active: false });
    }

    const inv = rows[0];

    // Calculate elapsed days and progress %
    const startDate = new Date(inv.start_date);
    const endDate = new Date(inv.end_date);
    const now = new Date();

    const elapsedDays = Math.max(
      0,
      Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
    );
    const totalDays = inv.duration_days || 30;
    const progress = Math.min(((elapsedDays / totalDays) * 100).toFixed(2), 100);

    const daysLeft = Math.max(0, totalDays - elapsedDays);

    // Return formatted response
    res.json({
      success: true,
      active: true,
      investment: {
        id: inv.id,
        plan_name: inv.plan_name,
        amount: Number(inv.amount),
        monthly_target_roi: Number(inv.monthly_target_roi),
        duration_days: totalDays,
        start_date: inv.start_date,
        end_date: inv.end_date,
        elapsed_days: elapsedDays,
        progress,
        days_left: daysLeft,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching active investment:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching active investment",
    });
  }
};