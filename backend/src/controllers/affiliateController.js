import pool from "../config/db.js";

// 🧮 Get affiliate stats & referral list
export const getAffiliateDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total referrals (anyone signed up with their code)
    const totalReferralsQuery = `
      SELECT COUNT(*) AS total_referrals
      FROM users
      WHERE referred_by = (
        SELECT referral_code FROM users WHERE id = $1
      );
    `;

    // Active referrals (those who invested)
    const activeReferralsQuery = `
      SELECT COUNT(DISTINCT i.user_id) AS active_referrals
      FROM users u
      JOIN investments i ON u.id = i.user_id
      WHERE u.referred_by = (
        SELECT referral_code FROM users WHERE id = $1
      )
      AND i.status = 'active';
    `;

    // Total affiliate earnings
    const totalEarningsQuery = `
      SELECT COALESCE(SUM(amount), 0) AS total_earned
      FROM transactions
      WHERE user_id = $1 AND tx_type = 'referral_commission';
    `;

    // Detailed referral list
    const referralListQuery = `
      SELECT 
        u.id AS user_id,
        u.email,
        TO_CHAR(u.created_at, 'YYYY-MM-DD') AS join_date,
        TO_CHAR(u.created_at, 'HH24:MI') AS join_time,
        COALESCE(SUM(i.amount), 0) AS total_deposited,
        COALESCE(SUM(t.amount), 0) AS commission_earned,
        CASE WHEN SUM(i.amount) > 0 THEN 'active' ELSE 'pending' END AS status
      FROM users u
      LEFT JOIN investments i ON u.id = i.user_id
      LEFT JOIN transactions t ON t.user_id = $1 AND t.tx_type = 'referral_commission'
      WHERE u.referred_by = (
        SELECT referral_code FROM users WHERE id = $1
      )
      GROUP BY u.id, u.email, u.created_at
      ORDER BY u.created_at DESC;
    `;

    const client = await pool.connect();

    const [
      totalReferralsRes,
      activeReferralsRes,
      totalEarningsRes,
      referralListRes,
    ] = await Promise.all([
      client.query(totalReferralsQuery, [userId]),
      client.query(activeReferralsQuery, [userId]),
      client.query(totalEarningsQuery, [userId]),
      client.query(referralListQuery, [userId]),
    ]);

    client.release();

    res.json({
      success: true,
      data: {
        totalReferrals: parseInt(totalReferralsRes.rows[0].total_referrals, 10),
        activeReferrals: parseInt(activeReferralsRes.rows[0].active_referrals, 10),
        totalEarnings: parseFloat(totalEarningsRes.rows[0].total_earned).toFixed(2),
        referrals: referralListRes.rows,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching affiliate dashboard:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export const getReferralTiers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        tier_name,
        min_referrals,
        max_referrals,
        commission_percent
      FROM referral_tiers
      ORDER BY min_referrals ASC;
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching referral tiers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch referral tiers",
    });
  }
};