import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Package, ArrowUpRight, ArrowDownRight, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

const balanceChartData = [
  { value: 300 },
  { value: 250 },
  { value: 400 },
  { value: 350 },
  { value: 280 },
  { value: 320 },
  { value: 250 },
  { value: 200 },
  { value: 150 },
  { value: 220 },
  { value: 180 },
  { value: 202.62 },
];

const activityData = [
  {
    id: 1,
    icon: <TrendingUp className="w-4 h-4 text-green-400" />,
    bg: "bg-green-500/10",
    title: "Investment Profit",
    desc: "+$245.50 ROI earned",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: <DollarSign className="w-4 h-4 text-blue-400" />,
    bg: "bg-blue-500/10",
    title: "Deposit Confirmed",
    desc: "$1,000.00 added",
    time: "5 hours ago",
  },
  {
    id: 3,
    icon: <Users className="w-4 h-4 text-purple-400" />,
    bg: "bg-purple-500/10",
    title: "Affiliate Bonus",
    desc: "+$45.00 commission",
    time: "1 day ago",
  },
  {
    id: 4,
    icon: <TrendingUp className="w-4 h-4 text-green-400" />,
    bg: "bg-green-500/10",
    title: "Portfolio Growth",
    desc: "+$190.20 ROI earned",
    time: "2 days ago",
  },
  {
    id: 5,
    icon: <Users className="w-4 h-4 text-purple-400" />,
    bg: "bg-purple-500/10",
    title: "Affiliate Referral",
    desc: "+$35.00 commission",
    time: "3 days ago",
  },
  {
    id: 6,
    icon: <TrendingUp className="w-4 h-4 text-green-400" />,
    bg: "bg-green-500/10",
    title: "Weekly Return",
    desc: "+$350.00 ROI",
    time: "5 days ago",
  },
];

const Dashboard = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('1M');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate profit data based on time filter
  const profitData = useMemo(() => {
    const now = new Date();

    if (timeFilter === '1W') {
      // Last 7 days
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          profit: Math.floor(Math.random() * 400) + 300,
          fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
      });
    } else if (timeFilter === '1M') {
      // Last 4 weeks
      return Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (3 - i) * 7);
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          profit: Math.floor(Math.random() * 500) + 300,
          fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
      });
    } else {
      // Last 12 weeks (3 months)
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (11 - i) * 7);
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          profit: Math.floor(Math.random() * 600) + 300,
          fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
      });
    }
  }, [timeFilter]);

  // Calculate stats from profit data
  const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
  const avgProfit = Math.round(totalProfit / profitData.length);
  const growthPercent = profitData.length > 1
    ? (((profitData[profitData.length - 1].profit - profitData[0].profit) / profitData[0].profit) * 100).toFixed(1)
    : 0;

  // Base balance in USD
  const baseBalanceUSD = 7202.62;

  // Currency conversion rates
  const currencyRates = {
    USDT: { rate: 1, symbol: 'USDT', decimals: 2 },
    BTC: { rate: 0.000108, symbol: 'BTC', decimals: 5 },
    ETH: { rate: 0.00285, symbol: 'ETH', decimals: 5 },
  };

  // Calculate balance in selected currency
  const getConvertedBalance = () => {
    const rate = currencyRates[selectedCurrency].rate;
    const decimals = currencyRates[selectedCurrency].decimals;
    return (baseBalanceUSD * rate).toFixed(decimals);
  };

  const stats = [
    {
      title: 'Total ROI Earned',
      value: '$2,345.10',
      icon: TrendingUp,
      change: '+8.3%',
      isPositive: true,
      subtitle: 'This Month'
    },
    {
      title: 'Active Investments',
      value: '3',
      icon: Package,
      change: '+2',
      isPositive: true,
      subtitle: 'Running Strategies'
    },
    {
      title: 'Affiliate Earnings',
      value: '$560.25',
      icon: Users,
      change: '+5.7%',
      isPositive: true,
      subtitle: 'Total Commissions'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - NovaTrade AI</title>
        <meta name="description" content="Your NovaTrade AI dashboard with total balance, ROI, investments, and affiliate earnings." />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">

        {/* Estimated Balance Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0F1014] border border-white/5 rounded-2xl p-6 sm:p-6"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Balance Info */}
            <div className="flex flex-col justify-center flex-1">
              <div className="flex items-center gap-1 mb-4">
                <h2 className="text-base text-gray-400 font-medium">Estimated Balance</h2>
                <button
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {isBalanceVisible ? (
                    <Eye className="w-4 h-4 text-gray-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Mobile: Balance and Buttons in Row */}
              <div className="flex items-start justify-between gap-4 lg:block">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-4xl lg:text-3xl font-bold text-white tracking-tight">
                      {isBalanceVisible ? getConvertedBalance() : '••••••••'}
                    </h1>

                    {/* Currency Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                        className="flex items-center gap-0 transition-colors group"
                      >
                        <span className="text-xs font-medium text-gray-300 group-hover:text-white">
                          {selectedCurrency}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isCurrencyDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full mt-2 right-0 w-24 bg-[#181A20] rounded-xl shadow-lg overflow-hidden z-20"
                        >
                          {Object.keys(currencyRates).map((currency) => (
                            <button
                              key={currency}
                              onClick={() => {
                                setSelectedCurrency(currency);
                                setIsCurrencyDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-xs font-medium transition-all duration-150 ${selectedCurrency === currency
                                ? 'text-white bg-[#1F2128]'
                                : 'text-gray-400 hover:text-white hover:bg-[#22252e]'
                                }`}
                            >
                              {currency}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-500">≈</span>
                    <span className="text-sm text-gray-400">
                      {isBalanceVisible ? `$${baseBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Today's PnL</span>
                    <div className="flex items-center gap-1 text-red-400">
                      <span className="text-sm font-medium">-$5.48</span>
                      <span className="text-xs">(0.08%)</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Stacked on Mobile */}
                <div className="flex flex-col gap-2 lg:hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/5 hover:border-white/10 whitespace-nowrap"
                  >
                    Deposit
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/5 hover:border-white/10 whitespace-nowrap"
                  >
                    Withdraw
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Right Side - Actions and Chart (Desktop Only) */}
            <div className="hidden lg:flex lg:w-[320px] xl:w-[380px] flex-col items-end justify-start">
              <div className="flex flex-col items-end justify-start w-full gap-4">
                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/5 hover:border-white/10"
                  >
                    Deposit
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/5 hover:border-white/10"
                  >
                    Withdraw
                  </motion.button>
                </div>

                {/* Mini Chart */}
                <div className="w-[210px] mt-3">
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={balanceChartData}>
                        <defs>
                          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#80ee64" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#80ee64" stopOpacity={0} />
                          </linearGradient>
                        </defs>

                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-[#1a1d24] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
                                  <p className="text-sm font-bold text-white">
                                    ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                          cursor={{ stroke: '#80ee64', strokeWidth: 1 }}
                        />

                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#80ee64"
                          strokeWidth={2}
                          fill="url(#balanceGradient)"
                          dot={false}
                          activeDot={{
                            r: 4,
                            fill: '#80ee64',
                            stroke: '#0F1014',
                            strokeWidth: 2
                          }}
                          isAnimationActive={true}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 !mt-[0.5rem] sm:!mt-[1.5rem]">

          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-[#0F1014] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-300 group ${index === 0 ? 'col-span-2 lg:col-span-1' : 'col-span-1'
                }`}
            >
              {/* Title + Icon (Hidden on mobile for cards 2 & 3) */}
              <div className={`flex items-center justify-between mb-3 ${index !== 0 ? 'lg:flex hidden' : ''}`}>
                <h3 className="text-sm text-gray-400 font-medium">{stat.title}</h3>
                <stat.icon className="w-6 h-6 text-[#80ee64]" />
              </div>

              {/* Title only (Mobile - cards 2 & 3) */}
              {index !== 0 && (
                <div className="mb-3 lg:hidden">
                  <h3 className="text-sm text-gray-400 font-medium">{stat.title}</h3>
                </div>
              )}

              {/* Value + Icon (Mobile layout for cards 2 & 3) */}
              <div className={`mb-3 ${index !== 0 ? 'flex items-center justify-between lg:block' : ''}`}>
                <h2 className="text-2xl sm:text-2xl font-bold text-white">
                  {stat.value}
                </h2>
                {index !== 0 && (
                  <stat.icon className="w-6 h-6 text-[#80ee64] lg:hidden" />
                )}
              </div>

              {/* Subtitle + Change Badge */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">
                  {stat.subtitle}
                </p>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${stat.isPositive
                    ? ' text-[#80ee64]'
                    : ' text-red-400'
                    }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6 !mt-[0.5rem] sm:!mt-[1.5rem]">
          {/* Main Chart - Clean Profit Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 bg-[#0F1014] border border-white/5 rounded-2xl p-4 sm:p-6 transition-all duration-500"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
              <div>
                <h2 className="text-sm sm:text-sm font-[500] text-gray-400 mb-1">Profit Overview</h2>
              </div>

              {/* Time Filter Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {['1W', '1M', '3M'].map((label) => (
                  <button
                    key={label}
                    onClick={() => setTimeFilter(label)}
                    className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 ${timeFilter === label
                      ? 'bg-[#80ee64] text-[#0F1014] border-[#80ee64] shadow-[0_0_10px_rgba(128,238,100,0.4)]'
                      : 'text-gray-400 border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Total</span>
                <span className="text-base sm:text-lg font-bold text-white">
                  ${totalProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Average</span>
                <span className="text-base sm:text-lg font-semibold text-[#80ee64]">
                  ${avgProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <svg
                  className={`w-4 h-4 ${growthPercent >= 0 ? 'text-[#80ee64]' : 'text-red-500 rotate-180'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className={`text-sm font-semibold ${growthPercent >= 0 ? 'text-[#80ee64]' : 'text-red-500'}`}>
                  {growthPercent >= 0 ? '+' : ''}{growthPercent}%
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="relative chart-container">
              <style jsx>{`
      .chart-container :global(.recharts-yAxis .recharts-cartesian-axis-tick text) {
        position: relative;
        z-index: 100 !important;
      }
      .chart-container :global(.recharts-yAxis) {
        z-index: 100 !important;
      }
    `}</style>
              <div style={{ width: '100%', height: 280 }} className="sm:h-[340px]">
                <ResponsiveContainer>
                  <AreaChart data={profitData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#80ee64" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#80ee64" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280', fontSize: 10 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#15181D] border border-[#80ee64]/20 rounded-lg px-3 py-2 shadow-xl">
                              <p className="text-xs text-gray-400 mb-1">{payload[0].payload.fullDate}</p>
                              <p className="text-sm font-semibold text-[#80ee64]">
                                ${payload[0].value.toLocaleString()}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ stroke: 'rgba(128,238,100,0.3)', strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#80ee64"
                      strokeWidth={2}
                      fill="url(#colorProfit)"
                      dot={{ fill: '#80ee64', r: 3, strokeWidth: 2, stroke: '#0F1014' }}
                      activeDot={{
                        r: 5,
                        fill: '#80ee64',
                        strokeWidth: 2,
                        stroke: '#0F1014',
                      }}
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-full"
          >
            <div className="bg-[#0F1014] border border-white/5 rounded-xl p-5 h-full flex flex-col">
              <h3 className="text-sm sm:text-sm font-[500] text-gray-400 mb-4">
                Recent Activity
              </h3>

              <div className="space-y-4 flex-1">
                {activityData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                  >
                    {/* Left Content */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-sm font-medium text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-xs sm:text-xs text-gray-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right Time */}
                    <p className="self-center text-[10px] sm:text-xs text-gray-500 whitespace-nowrap ml-2">
                      {item.time}
                    </p>

                  </div>
                ))}
              </div>
            </div>
          </motion.div>


        </div>
      </div>
    </>
  );
};

export default Dashboard;