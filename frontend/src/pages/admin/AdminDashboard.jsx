
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, DollarSign, Package, Banknote } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

const depositData = [
  { name: 'Mon', Deposits: 4000 }, { name: 'Tue', Deposits: 3000 }, { name: 'Wed', Deposits: 2000 },
  { name: 'Thu', Deposits: 2780 }, { name: 'Fri', Deposits: 1890 }, { name: 'Sat', Deposits: 2390 }, { name: 'Sun', Deposits: 3490 },
];
const withdrawalData = [
  { name: 'Mon', Withdrawals: 2400 }, { name: 'Tue', Withdrawals: 1398 }, { name: 'Wed', Withdrawals: 9800 },
  { name: 'Thu', Withdrawals: 3908 }, { name: 'Fri', Withdrawals: 4800 }, { name: 'Sat', Withdrawals: 3800 }, { name: 'Sun', Withdrawals: 4300 },
];

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,254', icon: Users, color: 'text-purple-400' },
    { title: 'Total Deposits', value: '$1.2M', icon: DollarSign, color: 'text-green-400' },
    { title: 'Total Withdrawals', value: '$450K', icon: Banknote, color: 'text-orange-400' },
    { title: 'Active Investments', value: '876', icon: Package, color: 'text-yellow-400' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Impulse Edge</title>
        <meta name="description" content="Admin overview for Impulse Edge." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-blue-400 glow-blue"
        >
          Admin Overview
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300 card-glow-blue"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">{stat.title}</p>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6 card-glow-blue"
          >
            <h2 className="text-xl font-bold mb-4">Weekly Deposits</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={depositData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', borderColor: 'rgba(59, 130, 246, 0.5)' }} />
                  <Bar dataKey="Deposits" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
           <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6 card-glow-blue"
          >
            <h2 className="text-xl font-bold mb-4">Weekly Withdrawals</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={withdrawalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(239, 68, 68, 0.1)" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', borderColor: 'rgba(239, 68, 68, 0.5)' }} />
                  <Line type="monotone" dataKey="Withdrawals" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
