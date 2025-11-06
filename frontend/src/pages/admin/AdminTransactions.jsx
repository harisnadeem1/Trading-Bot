
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';

const mockDeposits = [
  { id: 2, user: 'another@example.com', type: 'Deposit', coin: 'BTC', amount: 5000.00, date: '2025-11-01', status: 'Completed' },
  { id: 4, user: 'user@novatrade.ai', type: 'Deposit', coin: 'ETH', amount: 1000.00, date: '2025-10-28', status: 'Completed' },
  { id: 6, user: 'test@example.com', type: 'Deposit', coin: 'USDT', amount: 2500.00, date: '2025-11-03', status: 'Completed' },
];

const mockWithdrawals = [
  { id: 1, user: 'user@novatrade.ai', type: 'Withdrawal', coin: 'ETH', amount: 1200.00, date: '2025-11-02', status: 'Pending' },
  { id: 3, user: 'test@example.com', type: 'Withdrawal', coin: 'BTC', amount: 350.50, date: '2025-10-29', status: 'Pending' },
  { id: 5, user: 'pro@investor.com', type: 'Withdrawal', coin: 'USDC', amount: 15000.00, date: '2025-10-25', status: 'Rejected' },
];

const TransactionTable = ({ title, transactions, onStatusChange, type }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-400';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400';
      case 'Rejected': return 'bg-red-500/10 text-red-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 border border-blue-500/20 rounded-xl overflow-hidden card-glow-blue"
    >
        <h2 className="text-xl font-bold p-6 flex items-center gap-2">
            {type === 'Deposit' ? <ArrowDown className="text-green-400" /> : <ArrowUp className="text-orange-400" />}
            {title}
        </h2>
        <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
            <tr className="bg-gray-800/60">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Coin</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                {type === 'Withdrawal' && <th className="p-4 font-semibold text-right">Actions</th>}
            </tr>
            </thead>
            <tbody>
            {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-800 hover:bg-blue-500/5 transition-colors">
                <td className="p-4 text-gray-400">{tx.user}</td>
                <td className="p-4 font-semibold">{tx.coin}</td>
                <td className="p-4 font-mono">${tx.amount.toFixed(2)}</td>
                <td className="p-4 text-gray-500">{tx.date}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tx.status)}`}>
                    {tx.status}
                    </span>
                </td>
                {type === 'Withdrawal' && (
                    <td className="p-4 text-right">
                    {tx.status === 'Pending' && (
                        <div className="flex gap-2 justify-end">
                        <Button onClick={() => onStatusChange(tx.id, 'Completed')} size="sm" className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Approve</Button>
                        <Button onClick={() => onStatusChange(tx.id, 'Rejected')} size="sm" className="bg-red-500/20 text-red-300 hover:bg-red-500/30">Reject</Button>
                        </div>
                    )}
                    </td>
                )}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="p-4 flex justify-end items-center gap-2 text-sm text-gray-500">
            <Button size="sm" variant="outline" className="text-gray-400"><ChevronLeft size={16}/></Button>
            <span>Page 1 of 1</span>
            <Button size="sm" variant="outline" className="text-gray-400"><ChevronRight size={16}/></Button>
        </div>
    </motion.div>
  );
};


const AdminTransactions = () => {
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
  const { toast } = useToast();

  const handleStatusChange = (id, newStatus) => {
    setWithdrawals(withdrawals.map(t => t.id === id ? { ...t, status: newStatus } : t));
    toast({ title: `Withdrawal #${id} has been ${newStatus.toLowerCase()}.` });
  };
  
  return (
    <>
      <Helmet>
        <title>Manage Transactions - Admin</title>
        <meta name="description" content="View and manage all user deposits and withdrawals." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-blue-400 glow-blue"
        >
          Manage Transactions
        </motion.h1>

        <TransactionTable title="Deposits" transactions={mockDeposits} type="Deposit" />
        <TransactionTable title="Withdrawals" transactions={withdrawals} onStatusChange={handleStatusChange} type="Withdrawal" />

      </div>
    </>
  );
};

export default AdminTransactions;
