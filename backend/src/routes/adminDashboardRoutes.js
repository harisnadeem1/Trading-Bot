// routes/adminDashboard.routes.js
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
        COUNT(*) FILTER (WHERE role = 'user') AS total_users,
        COALESCE(SUM(total_deposits), 0) AS total_deposits,
        COALESCE(SUM(total_withdrawals), 0) AS total_withdrawals,
        COALESCE(SUM(balance), 0) AS total_balance,
        COALESCE(SUM(roi_earnings + affiliate_earnings), 0) AS total_earnings
      FROM users;
    `;

    const activeInvestmentsQuery = `
      SELECT COUNT(*) AS active_investments
      FROM investments
      WHERE status = 'active';
    `;

    const [summaryRes, investmentsRes] = await Promise.all([
      pool.query(summaryQuery),
      pool.query(activeInvestmentsQuery),
    ]);

    const s = summaryRes.rows[0];
    const inv = investmentsRes.rows[0];

    res.json({
      totalUsers: Number(s.total_users),
      totalDeposits: Number(s.total_deposits),
      totalWithdrawals: Number(s.total_withdrawals),
      totalBalance: Number(s.total_balance),
      totalEarnings: Number(s.total_earnings),
      activeInvestments: Number(inv.active_investments),
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

/* ----------------------------------------
   2) QUICK STATS — Bottom Small Cards
----------------------------------------- */
router.get("/quick-stats", protect, adminOnly, async (req, res) => {
  try {
    const pendingDepositsQuery = `
      SELECT COUNT(*) AS count
      FROM transactions
      WHERE tx_type='deposit' AND status='pending';
    `;

    const pendingWithdrawalsQuery = `
      SELECT COUNT(*) AS count
      FROM transactions
      WHERE tx_type='withdraw' AND status='pending';
    `;

    const newUsersTodayQuery = `
      SELECT COUNT(*) AS count
      FROM users
      WHERE created_at::date = CURRENT_DATE;
    `;

    const [depRes, wdRes, usersRes] = await Promise.all([
      pool.query(pendingDepositsQuery),
      pool.query(pendingWithdrawalsQuery),
      pool.query(newUsersTodayQuery),
    ]);

    res.json({
      pendingDeposits: Number(depRes.rows[0].count),
      pendingWithdrawals: Number(wdRes.rows[0].count),
      newUsersToday: Number(usersRes.rows[0].count),
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
      "3m": "NOW() - INTERVAL '90 days'",
    };

    const labels = {
      "1w": "TO_CHAR(created_at, 'Dy')",         // Mon, Tue
      "1m": "TO_CHAR(created_at, 'Mon DD')",     // Jan 15
      "3m": "TO_CHAR(created_at, 'Mon YYYY')",   // Jan 2025
    };

    const txTypeMap = {
      deposits: "deposit",
      withdrawals: "withdraw",
      revenue: "daily_roi",
    };

    const sql = `
      SELECT 
        ${labels[period]} AS label,
        COALESCE(SUM(amount), 0) AS value
      FROM transactions
      WHERE 
        created_at >= ${ranges[period]}
        AND tx_type = '${txTypeMap[metric]}'
        AND status = 'approved'
      GROUP BY label
      ORDER BY MIN(created_at);
    `;

    const chartData = await pool.query(sql);

    res.json(chartData.rows);
  } catch (error) {
    console.error("Chart error:", error);
    res.status(500).json({ message: "Failed to fetch chart data" });
  }
});

export default router;
