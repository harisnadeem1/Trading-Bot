import pool from "../config/db.js";

export const getAffiliateDashboard = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.id;

    // 1️⃣ Total Referrals (users referred by this user)
    const totalReferralsRes = await client.query(`
      SELECT COUNT(*) AS total_referrals
      FROM users
      WHERE referred_by = (SELECT referral_code FROM users WHERE id = $1)
    `, [userId]);

    // 2️⃣ Active Referrals (those who made approved deposits)
    const activeReferralsRes = await client.query(`
      SELECT COUNT(DISTINCT u.id) AS active_referrals
      FROM users u
      JOIN transactions t ON t.user_id = u.id
      WHERE u.referred_by = (SELECT referral_code FROM users WHERE id = $1)
      AND t.tx_type = 'deposit'
      AND t.status = 'approved'
    `, [userId]);

    // 3️⃣ Total earnings
    const totalEarningsRes = await client.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_earned
      FROM transactions
      WHERE user_id = $1
      AND tx_type IN ('referral_direct','referral_passive')
      AND status = 'approved'
    `, [userId]);

    

    // 4️⃣ Referral details — commissions rolled up under level-1 users
    const referralListRes = await client.query(`
      WITH RECURSIVE referral_tree AS (
        SELECT 
          u.id AS user_id,
          u.email,
          u.created_at,
          1 AS level,
          u.id AS top_level_id
        FROM users u
        WHERE u.referred_by = (SELECT referral_code FROM users WHERE id = $1)

        UNION ALL

        SELECT 
          c.id AS user_id,
          c.email,
          c.created_at,
          rt.level + 1 AS level,
          rt.top_level_id
        FROM users c
        INNER JOIN referral_tree rt ON c.referred_by = (SELECT referral_code FROM users WHERE id = rt.user_id)
        WHERE rt.level < 5
      )
      SELECT 
        tl.user_id,
        tl.email,
        TO_CHAR(tl.created_at, 'YYYY-MM-DD') AS join_date,
        TO_CHAR(tl.created_at, 'HH24:MI') AS join_time,
        COALESCE((
          SELECT SUM(t.usd_value)
FROM transactions t
WHERE t.user_id = tl.user_id
  AND t.tx_type = 'deposit'
  AND t.status = 'approved'
        ), 0) AS total_deposited,
        COALESCE((
          SELECT SUM(tx.amount)
          FROM transactions tx
          WHERE tx.user_id = $1
            AND tx.related_user_id IN (
              SELECT user_id FROM referral_tree WHERE top_level_id = tl.user_id
            )
            AND tx.tx_type IN ('referral_direct','referral_passive')
            AND tx.status = 'approved'
        ), 0) AS commission_earned,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM transactions t2
            WHERE t2.user_id = tl.user_id
              AND t2.tx_type = 'deposit'
              AND t2.status = 'approved'
          ) THEN 'active'
          ELSE 'pending'
        END AS status
      FROM referral_tree tl
      WHERE tl.level = 1
      ORDER BY tl.created_at DESC
    `, [userId]);


    // 5️⃣ Team Revenue (Up to 5 Levels)
const teamRevenueRes = await client.query(`
  WITH RECURSIVE referral_tree AS (
      SELECT 
        u.id AS user_id,
        1 AS level
      FROM users u
      WHERE u.referred_by = (SELECT referral_code FROM users WHERE id = $1)

      UNION ALL

      SELECT 
        c.id AS user_id,
        rt.level + 1 AS level
      FROM users c
      INNER JOIN referral_tree rt 
          ON c.referred_by = (SELECT referral_code FROM users WHERE id = rt.user_id)
      WHERE rt.level < 5
  )
  SELECT COALESCE(SUM(t.usd_value), 0) AS team_revenue
FROM transactions t
WHERE t.user_id IN (SELECT user_id FROM referral_tree)
  AND t.tx_type = 'deposit'
  AND t.status = 'approved'
`, [userId]);


    // ✅ Removed extra client.release() here

    res.json({
      success: true,
      data: {
        totalReferrals: Number(totalReferralsRes.rows[0]?.total_referrals || 0),
        activeReferrals: Number(activeReferralsRes.rows[0]?.active_referrals || 0),
        totalEarnings: parseFloat(totalEarningsRes.rows[0]?.total_earned || 0).toFixed(2),
        teamRevenue: Number(teamRevenueRes.rows[0]?.team_revenue || 0),
        referrals: referralListRes.rows.map((r) => ({
          ...r,
          total_deposited: Number(r.total_deposited || 0).toFixed(2),
          commission_earned: Number(r.commission_earned || 0).toFixed(2),
        })),
      },
    });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("❌ Error fetching affiliate dashboard:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    client.release(); // ✅ only once
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