import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Package,
  Banknote,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const API = import.meta.env.VITE_API_BASE_URL; // example: http://localhost:5000

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [quickStats, setQuickStats] = useState(null);

  const [depositPeriod, setDepositPeriod] = useState("1w");
  const [withdrawalPeriod, setWithdrawalPeriod] = useState("1w");
  const [revenuePeriod, setRevenuePeriod] = useState("1m");

  const [depositData, setDepositData] = useState([]);
  const [withdrawalData, setWithdrawalData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch Summary
  useEffect(() => {
  async function loadSummary() {
    try {
      const res = await axios.get(`${API}/admin/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  loadSummary();
}, []);


  // Fetch Quick Stats
 useEffect(() => {
  async function loadQuickStats() {
    try {
      const res = await axios.get(`${API}/admin/dashboard/quick-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuickStats(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  loadQuickStats();
}, []);

  // Fetch Charts
  const fetchChart = async (metric, period, setter) => {
    try {
      const res = await axios.get(
        `${API}/admin/dashboard/chart?metric=${metric}&period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formatted = res.data.map((item) => ({
        name: item.label,
        value: Number(item.value),
      }));

      setter(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  async function load() {
    await fetchChart("deposits", depositPeriod, setDepositData);
  }
  load();
}, [depositPeriod]);

useEffect(() => {
  async function load() {
    await fetchChart("withdrawals", withdrawalPeriod, setWithdrawalData);
  }
  load();
}, [withdrawalPeriod]);

useEffect(() => {
  async function load() {
    await fetchChart("revenue", revenuePeriod, setRevenueData);
  }
  load();
}, [revenuePeriod]);

  // UI Toggle Component
  const TimeToggle = ({ selected, onChange }) => {
    const periods = [
      { value: "1w", label: "1W" },
      { value: "1m", label: "1M" },
      { value: "3m", label: "3M" },
    ];

    return (
      <div className="inline-flex bg-[#1A1B1F] rounded-lg p-1 border border-white/5">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onChange(period.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              selected === period.value ? "bg-[#80ee64] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    );
  };

  if (!summary || !quickStats) {
    return <div className="text-center text-gray-400 p-10">Loading dashboard...</div>;
  }

  const stats = [
    {
      title: "Total Users",
      value: summary.totalUsers.toLocaleString(),
      change: "+12.5%",
      isPositive: true,
      icon: Users,
    },
    {
      title: "Total Deposits",
      value: `$${summary.totalDeposits.toLocaleString()}`,
      change: "+8.3%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Total Withdrawals",
      value: `$${summary.totalWithdrawals.toLocaleString()}`,
      change: "+5.2%",
      isPositive: true,
      icon: Banknote,
    },
    {
      title: "Active Investments",
      value: summary.activeInvestments.toLocaleString(),
      change: "-2.4%",
      isPositive: false,
      icon: Package,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Impulse Edge</title>
      </Helmet>

      <div className="p-4 space-y-6">
        <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
        <p className="text-gray-400">Monitor your platform’s performance</p>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0F1014] border border-white/5 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-400">{stat.title}</h3>
                <div className="w-10 h-10 bg-[#80ee64]/10 flex items-center justify-center rounded-xl">
                  <stat.icon className="w-5 h-5 text-[#80ee64]" />
                </div>
              </div>

              <p className="text-2xl font-bold text-white">{stat.value}</p>

              {/* <div className="flex items-center gap-1">
                {stat.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-[#80ee64]" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm ${stat.isPositive ? "text-[#80ee64]" : "text-red-400"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500">vs last week</span>
              </div> */}
            </motion.div>
          ))}
        </div>

        {/* Deposits Chart */}
        <motion.div className="bg-[#0F1014] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Deposits</h2>
            </div>

            <TimeToggle selected={depositPeriod} onChange={setDepositPeriod} />
          </div>

          <div style={{ width: "100%", height: 280, minHeight: "280px" }}>
            <ResponsiveContainer>
              <BarChart data={depositData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip />
                <Bar dataKey="value" fill="#80ee64" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Withdrawals Chart */}
        <motion.div className="bg-[#0F1014] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Withdrawals</h2>
            <TimeToggle selected={withdrawalPeriod} onChange={setWithdrawalPeriod} />
          </div>

          <div style={{ width: "100%", height: 280, minHeight: "280px" }}>
            <ResponsiveContainer>
              <LineChart data={withdrawalData}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip />
                <Line dataKey="value" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div className="bg-[#0F1014] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
            <TimeToggle selected={revenuePeriod} onChange={setRevenuePeriod} />
          </div>

          <div style={{ width: "100%", height: 300, minHeight: "300px" }}>
            <ResponsiveContainer>
              <AreaChart data={revenueData}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#80ee64"
                  fill="#80ee6455"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#0F1014] p-5 rounded-xl border border-white/5">
            <h3 className="text-gray-400">Pending Deposits</h3>
            <p className="text-2xl text-white font-bold">{quickStats.pendingDeposits}</p>
          </div>

          <div className="bg-[#0F1014] p-5 rounded-xl border border-white/5">
            <h3 className="text-gray-400">Pending Withdrawals</h3>
            <p className="text-2xl text-white font-bold">{quickStats.pendingWithdrawals}</p>
          </div>

          <div className="bg-[#0F1014] p-5 rounded-xl border border-white/5">
            <h3 className="text-gray-400">New Users Today</h3>
            <p className="text-2xl text-white font-bold">{quickStats.newUsersToday}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
