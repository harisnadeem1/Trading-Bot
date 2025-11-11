import pool from "../config/db.js";

export const getDashboardData = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1️⃣ Fetch basic user wallet + earnings summary
    const userRes = await pool.query(
      `SELECT 
        balance, 
        roi_earnings, 
        affiliate_earnings, 
        total_deposits, 
        total_withdrawals
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userRes.rowCount === 0)
      return res.status(404).json({ error: "User not found" });

    const user = userRes.rows[0];

    // 2️⃣ Fetch latest balance snapshots (for mini balance chart)
    const snapshotRes = await pool.query(
      `SELECT date, balance 
       FROM user_balance_snapshots 
       WHERE user_id = $1 
       ORDER BY date DESC 
       LIMIT 12`,
      [userId]
    );

    const balanceChart = snapshotRes.rows
      .map((row) => ({
        value: Number(row.balance),
        date: row.date,
      }))
      .reverse();

    // 3️⃣ Fetch full balance history for chart overview (auto adapt to available data)
    const historyRes = await pool.query(
      `SELECT date, balance
       FROM user_balance_snapshots
       WHERE user_id = $1
       ORDER BY date ASC`,
      [userId]
    );

    const balanceData = historyRes.rows.map((row) => ({
      name: new Date(row.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: Number(row.balance),
      fullDate: new Date(row.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

    // Calculate total, average profit per day, and growth percentage
    let totalBalance = 0,
      avgProfit = 0,
      growthPercent = 0;

    if (balanceData.length > 0) {
      const latest = balanceData[balanceData.length - 1].value;
      const earliest = balanceData[0].value;
      totalBalance = latest;
      avgProfit = (latest - earliest) / balanceData.length;
      growthPercent = earliest > 0 ? ((latest - earliest) / earliest) * 100 : 0;
    }

    // 4️⃣ Recent activity log
    const txRes = await pool.query(
      `SELECT tx_type, amount, created_at 
       FROM transactions 
       WHERE user_id = $1 AND status = 'approved'
       ORDER BY created_at DESC LIMIT 6`,
      [userId]
    );

    const typeMap = {
      deposit: {
        title: "Deposit Confirmed",
        desc: (amt) => `$${amt.toFixed(2)} added`,
        color: "blue",
        icon: "DollarSign",
      },
      withdraw: {
        title: "Withdrawal Processed",
        desc: (amt) => `-$${amt.toFixed(2)} withdrawn`,
        color: "red",
        icon: "ArrowDownRight",
      },
      daily_roi: {
        title: "Investment Profit",
        desc: (amt) => `+$${amt.toFixed(2)} ROI earned`,
        color: "green",
        icon: "TrendingUp",
      },
      referral_commission: {
        title: "Affiliate Bonus",
        desc: (amt) => `+$${amt.toFixed(2)} commission`,
        color: "purple",
        icon: "Users",
      },
      bonus: {
        title: "Bonus Credited",
        desc: (amt) => `+$${amt.toFixed(2)} bonus`,
        color: "yellow",
        icon: "Gift",
      },
    };

    const activity = txRes.rows.map((tx) => {
      const meta = typeMap[tx.tx_type] || {};
      return {
        title: meta.title || tx.tx_type,
        desc: meta.desc ? meta.desc(Number(tx.amount)) : "",
        color: meta.color || "gray",
        icon: meta.icon || "Activity",
        time: new Date(tx.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });

    // 5️⃣ Active investments count
    const investmentsRes = await pool.query(
      `SELECT COUNT(*) AS active_investments
       FROM investments
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    const activeInvestments = Number(investmentsRes.rows[0]?.active_investments || 0);

    // 6️⃣ Today's PnL vs yesterday
    let todayPnL = 0;
    let pnlPercent = 0;
    if (snapshotRes.rows.length >= 2) {
      const latest = Number(snapshotRes.rows[0].balance);
      const prev = Number(snapshotRes.rows[1].balance);
      todayPnL = latest - prev;
      pnlPercent = prev > 0 ? ((todayPnL / prev) * 100).toFixed(2) : 0;
    }

    // 7️⃣ Construct response payload
    res.json({
      balance: Number(user.balance),
      roiEarnings: Number(user.roi_earnings),
      affiliateEarnings: Number(user.affiliate_earnings),
      totalDeposits: Number(user.total_deposits),
      totalWithdrawals: Number(user.total_withdrawals),
      activeInvestments,
      balanceChart,
      balanceData,       // ✅ main chart data
      totalBalance,      // ✅ total from chart
      avgProfit,         // ✅ average gain
      growthPercent,     // ✅ growth %
      todayPnL,          // ✅ today’s up/down
      pnlPercent,
      activity,
    });
  } catch (error) {
    console.error("Dashboard load error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
