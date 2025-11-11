import pool from "../config/db.js";

// ✅ Get all active investment plans (for users)
export const getAllPlans = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          id,
          name,
          description,
          min_amount,
          max_amount,
          monthly_target_roi AS roi,
          duration_days,
          auto_roi_generation AS auto_roi,
          is_active,
          created_at
       FROM plans
       WHERE is_active = TRUE
       ORDER BY min_amount ASC`
    );

    res.json({
      success: true,
      data: result.rows.map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        roi: Number(plan.roi),
        min_amount: Number(plan.min_amount),
        max_amount: plan.max_amount ? Number(plan.max_amount) : null,
        duration_days: plan.duration_days,
        auto_roi: plan.auto_roi,
        is_active: plan.is_active,
      })),
    });
  } catch (err) {
    console.error("Error fetching plans:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch investment plans",
    });
  }
};
