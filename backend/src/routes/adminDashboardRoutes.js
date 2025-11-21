import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ----------------------------------------
   1) ADMIN SUMMARY — Top Cards
----------------------------------------- */
router.get("/summary", protect, adminOnly, async (req, res) => {
  try {
    const summaryQuery = `
      SELECT
        COUNT(*) FILTER (WHERE role = 'user'
          AND id NOT IN (SELECT user_id FROM excluded_users)
        ) AS total_users,

        COALESCE(SUM(total_deposits), 0) AS total_deposits,
        COALESCE(SUM(total_withdrawals), 0) AS total_withdrawals,
        COALESCE(SUM(balance), 0) AS total_balance,
        COALESCE(SUM(roi_earnings + affiliate_earnings), 0) AS total_earnings
      FROM users
      WHERE id NOT IN (SELECT user_id FROM excluded_users);
    `;

    const activeInvestmentsQuery = `
      SELECT COUNT(*) AS active_investments
      FROM investments
      WHERE status='active'
      AND user_id NOT IN (SELECT user_id FROM excluded_users);
    `;

    const [summaryRes, investmentsRes] = await Promise.all([
      pool.query(summaryQuery),
      pool.query(activeInvestmentsQuery)
    ]);

    const s = summaryRes.rows[0];
    const inv = investmentsRes.rows[0];

    res.json({
      totalUsers: Number(s.total_users),
      totalDeposits: Number(s.total_deposits),
      totalWithdrawals: Number(s.total_withdrawals),
      totalBalance: Number(s.total_balance),
      totalEarnings: Number(s.total_earnings),
      activeInvestments: Number(inv.active_investments)
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

/* ----------------------------------------
   2) QUICK STATS — Pending Deposits, Withdrawals, New Users
----------------------------------------- */
router.get("/quick-stats", protect, adminOnly, async (req, res) => {
  try {
    const pendingDepositsQuery = `
      SELECT COUNT(*) AS count
      FROM transactions t
      JOIN users u ON u.id = t.user_id
      WHERE t.tx_type='deposit'
      AND t.status='pending'
      AND u.id NOT IN (SELECT user_id FROM excluded_users);
    `;

    const pendingWithdrawalsQuery = `
      SELECT COUNT(*) AS count
      FROM transactions t
      JOIN users u ON u.id = t.user_id
      WHERE t.tx_type='withdraw'
      AND t.status='pending'
      AND u.id NOT IN (SELECT user_id FROM excluded_users);
    `;

    const newUsersTodayQuery = `
      SELECT COUNT(*) AS count
      FROM users
      WHERE created_at::date = CURRENT_DATE
      AND id NOT IN (SELECT user_id FROM excluded_users);
    `;

    const [depRes, wdRes, usersRes] = await Promise.all([
      pool.query(pendingDepositsQuery),
      pool.query(pendingWithdrawalsQuery),
      pool.query(newUsersTodayQuery)
    ]);

    res.json({
      pendingDeposits: Number(depRes.rows[0].count),
      pendingWithdrawals: Number(wdRes.rows[0].count),
      newUsersToday: Number(usersRes.rows[0].count)
    });
  } catch (error) {
    console.error("Quick stats error:", error);
    res.status(500).json({ message: "Failed to fetch quick stats" });
  }
});

/* ----------------------------------------
   3) CHART DATA — Deposits / Withdrawals / Revenue
----------------------------------------- */
router.get("/chart", protect, adminOnly, async (req, res) => {
  try {
    let { metric, period } = req.query;

    if (!metric) metric = "deposits";
    if (!period) period = "1w";

    const ranges = {
      "1w": "NOW() - INTERVAL '7 days'",
      "1m": "NOW() - INTERVAL '30 days'",
      "3m": "NOW() - INTERVAL '90 days'"
    };

    const labels = {
      "1w": "TO_CHAR(created_at, 'Dy')",
      "1m": "TO_CHAR(created_at, 'Mon DD')",
      "3m": "TO_CHAR(created_at, 'Mon YYYY')"
    };

    const txTypeMap = {
      deposits: "deposit",
      withdrawals: "withdraw",
      revenue: "daily_roi"
    };

    const sql = `
      SELECT 
        ${labels[period]} AS label,
        COALESCE(SUM(t.amount), 0) AS value
      FROM transactions t
      JOIN users u ON u.id = t.user_id
      WHERE 
        t.created_at >= ${ranges[period]}
        AND t.tx_type = '${txTypeMap[metric]}'
        AND t.status = 'approved'
        AND u.id NOT IN (SELECT user_id FROM excluded_users)
      GROUP BY label
      ORDER BY MIN(t.created_at);
    `;

    const chartData = await pool.query(sql);

    res.json(chartData.rows);
  } catch (error) {
    console.error("Chart error:", error);
    res.status(500).json({ message: "Failed to fetch chart data" });
  }
});

export default router;
