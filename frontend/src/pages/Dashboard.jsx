import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Week 1', profit: 400 },
  { name: 'Week 2', profit: 300 },
  { name: 'Week 3', profit: 500 },
  { name: 'Week 4', profit: 450 },
  { name: 'Week 5', profit: 600 },
  { name: 'Week 6', profit: 800 },
];

const Dashboard = () => {
  const stats = [
    { title: 'Total Balance', value: '$12,450.75', icon: DollarSign },
    { title: 'Total ROI Earned', value: '$2,345.10', icon: TrendingUp },
    { title: 'Active Investments', value: '3', icon: Package },
    { title: 'Affiliate Earnings', value: '$560.25', icon: Users },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - NovaTrade AI</title>
        <meta name="description" content="Your NovaTrade AI dashboard with total balance, ROI, investments, and affiliate earnings." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-green-400 glow-green"
        >
          Dashboard Overview
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 card-glow"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">{stat.title}</p>
                <stat.icon className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 card-glow"
        >
          <h2 className="text-xl font-bold mb-4">Weekly Profit Graph</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    borderColor: 'rgba(34, 197, 94, 0.5)',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;