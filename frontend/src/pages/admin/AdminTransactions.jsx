import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpFromLine, ChevronLeft, ChevronRight, Check, X, Clock, CheckCircle2, XCircle, User, Calendar, Coins } from 'lucide-react';


const API_BASE = import.meta.env.VITE_API_BASE_URL;



const mockDeposits = [
  { id: 1, user: 'another@example.com', userId: 'USR-001', coin: 'BTC', amount: 5000.00, date: '2025-11-01', time: '14:30 PM', status: 'Completed', txHash: '0x1a2b3c4d...' },
  { id: 2, user: 'user@novatrade.ai', userId: 'USR-002', coin: 'ETH', amount: 1000.00, date: '2025-10-28', time: '09:15 AM', status: 'Pending', txHash: '0x5e6f7g8h...' },
  { id: 3, user: 'test@example.com', userId: 'USR-003', coin: 'USDT', amount: 2500.00, date: '2025-11-03', time: '16:45 PM', status: 'Completed', txHash: '0x9i0j1k2l...' },
  { id: 4, user: 'investor@crypto.com', userId: 'USR-004', coin: 'USDC', amount: 7500.00, date: '2025-11-05', time: '11:20 AM', status: 'Pending', txHash: '0x3m4n5o6p...' },
];

const mockWithdrawals = [
  { id: 1, user: 'user@novatrade.ai', userId: 'USR-002', coin: 'ETH', amount: 1200.00, date: '2025-11-02', time: '10:30 AM', status: 'Pending', wallet: '0x742d35Cc6634C0532925...' },
  { id: 2, user: 'test@example.com', userId: 'USR-003', coin: 'BTC', amount: 350.50, date: '2025-10-29', time: '15:45 PM', status: 'Pending', wallet: 'bc1qxy2kgdygjrsqtzq2n...' },
  { id: 3, user: 'pro@investor.com', userId: 'USR-005', coin: 'USDC', amount: 15000.00, date: '2025-10-25', time: '08:15 AM', status: 'Rejected', wallet: '0x9876FeDcBa0987654321...' },
  { id: 4, user: 'whale@trade.io', userId: 'USR-006', coin: 'USDT', amount: 8500.00, date: '2025-11-06', time: '13:00 PM', status: 'Pending', wallet: 'TABCDEFGHIJKLMNOPQRS...' },
];

const TransactionTable = ({
  title,
  transactions,
  onStatusChange,
  type,
  icon: Icon,
  pagination,
  onPageChange
}) => {
  const normalizeStatus = (status) => {
    if (!status) return 'Unknown';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'approved' || lowerStatus === 'completed') return 'Completed';
    if (lowerStatus === 'pending') return 'Pending';
    if (lowerStatus === 'rejected') return 'Rejected';
    return status;
  };

  const getStatusConfig = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'Completed':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: 'Completed',
          bg: 'bg-[#80ee64]/10',
          textColor: 'text-[#80ee64]',
          border: 'border-[#80ee64]/30',
        };
      case 'Pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Pending',
          bg: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          border: 'border-yellow-500/30',
        };
      case 'Rejected':
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: 'Rejected',
          bg: 'bg-red-500/10',
          textColor: 'text-red-400',
          border: 'border-red-500/30',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Unknown',
          bg: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          border: 'border-gray-500/30',
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#0F1014] border border-white/5 rounded-2xl overflow-hidden"
    >
      {/* Table Header */}
      <div className="flex items-center gap-3 p-6 border-b border-white/5">
        <div className="w-10 h-10 bg-[#80ee64]/10 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#80ee64]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{transactions.length} transactions</p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-medium text-gray-400 p-4">User</th>
              <th className="text-left text-xs font-medium text-gray-400 p-4">Coin</th>
              <th className="text-left text-xs font-medium text-gray-400 p-4">Amount</th>
              <th className="text-left text-xs font-medium text-gray-400 p-4">Date & Time</th>
              {type === 'Withdrawal' && (
                <th className="text-left text-xs font-medium text-gray-400 p-4">Wallet Address</th>
              )}
              {type === 'Deposit' && (
                <th className="text-left text-xs font-medium text-gray-400 p-4">TX Hash</th>
              )}
              <th className="text-left text-xs font-medium text-gray-400 p-4">Status</th>
              <th className="text-right text-xs font-medium text-gray-400 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const normalizedStatus = normalizeStatus(tx.status);
              const statusConfig = getStatusConfig(tx.status);
              return (
                <tr
                  key={tx.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-white font-medium">{tx.user}</p>
                      <p className="text-xs text-gray-500">{tx.userId}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-white">{tx.coin}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-white">
                      ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-400">
                      <div>{tx.date}</div>
                      <div className="text-xs text-gray-500">{tx.time}</div>
                    </div>
                  </td>
                  {type === 'Withdrawal' && (
                    <td className="p-4">
                      <span className="text-xs text-gray-500 font-mono">{tx.wallet}</span>
                    </td>
                  )}
                  {type === 'Deposit' && (
                    <td className="p-4">
                      <span className="text-xs text-gray-500 font-mono">{tx.txHash}</span>
                    </td>
                  )}
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.textColor} border ${statusConfig.border}`}>
                      {statusConfig.icon}
                      <span className="text-xs font-medium">{statusConfig.text}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {normalizedStatus === 'Pending' && (
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onStatusChange(tx.id, 'Completed')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#80ee64]/10 hover:bg-[#80ee64]/20 text-[#80ee64] border border-[#80ee64]/30 text-xs font-medium transition-all"
                        >
                          <Check className="w-3 h-3" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onStatusChange(tx.id, 'Rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-all"
                        >
                          <X className="w-3 h-3" />
                          Reject
                        </motion.button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Icon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No transactions found</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const normalizedStatus = normalizeStatus(tx.status);
            const statusConfig = getStatusConfig(tx.status);
            return (
              <div
                key={tx.id}
                className="bg-[#181A20] border border-white/5 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-semibold text-white truncate">{tx.user}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{tx.userId}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.textColor} border ${statusConfig.border} flex-shrink-0`}>
                    {statusConfig.icon}
                    <span className="text-xs font-medium whitespace-nowrap">{statusConfig.text}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Coin</span>
                    <span className="text-xs text-white font-semibold">{tx.coin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Amount</span>
                    <span className="text-xs text-white font-medium">
                      ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Date</span>
                    <span className="text-xs text-gray-300">{tx.date} {tx.time}</span>
                  </div>
                  {type === 'Withdrawal' && tx.wallet && (
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 mb-1">Wallet Address</p>
                      <p className="text-[10px] text-gray-400 font-mono break-all">{tx.wallet}</p>
                    </div>
                  )}
                  {type === 'Deposit' && tx.txHash && (
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 mb-1">Transaction Hash</p>
                      <p className="text-[10px] text-gray-400 font-mono break-all">{tx.txHash}</p>
                    </div>
                  )}
                </div>

                {normalizedStatus === 'Pending' && (
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => onStatusChange(tx.id, 'Completed')}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#80ee64]/10 active:bg-[#80ee64]/20 text-[#80ee64] border border-[#80ee64]/30 text-xs font-medium transition-all"
                    >
                      <Check className="w-3 h-3" />
                      Approve
                    </button>
                    <button
                      onClick={() => onStatusChange(tx.id, 'Rejected')}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 active:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-all"
                    >
                      <X className="w-3 h-3" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="p-4 border-t border-white/5 flex justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="text-xs sm:text-sm text-gray-400 px-2 sm:px-3">
              {pagination.page}/{pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const AdminTransactions = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);

  const [withdrawPage, setWithdrawPage] = useState(1);
  const [depositPage, setDepositPage] = useState(1);

  const [withdrawPagination, setWithdrawPagination] = useState({ page: 1, totalPages: 1 });
  const [depositPagination, setDepositPagination] = useState({ page: 1, totalPages: 1 });

  const { token } = useAuthStore();

  useEffect(() => {
    fetchTransactions('deposit', depositPage, setDeposits, setDepositPagination);
  }, [depositPage]);

  useEffect(() => {
    fetchTransactions('withdraw', withdrawPage, setWithdrawals, setWithdrawPagination);
  }, [withdrawPage]);

  const fetchTransactions = async (type, page, setData, setPagination) => {
    try {
      const res = await axios.get(`${API_BASE}/admin/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { type, page, limit: 10 },
      });
      if (res.data.success) {
        setData(res.data.data);
        setPagination({ ...res.data.pagination, page });
      }
    } catch (err) {
      console.error(`❌ Failed to fetch ${type} transactions:`, err);
    }
  };

  const handleWithdrawalStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/admin/transactions/${id}/status`,
        { status: newStatus === 'Completed' ? 'approved' : 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Re-fetch after update
        fetchTransactions('withdraw', withdrawPage, setWithdrawals, setWithdrawPagination);
      }
    } catch (err) {
      console.error("❌ Failed to update withdrawal:", err);
    }
  };

  const handleDepositStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/admin/transactions/${id}/status`,
        { status: newStatus === 'Completed' ? 'approved' : 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        fetchTransactions('deposit', depositPage, setDeposits, setDepositPagination);
      }
    } catch (err) {
      console.error("❌ Failed to update deposit:", err);
    }
  };

  // Calculate stats
  const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  
  // Normalize status for counting
  const normalizeForCount = (status) => {
    if (!status) return '';
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'pending';
    return '';
  };
  
  const pendingWithdrawals = withdrawals.filter(w => normalizeForCount(w.status) === 'pending').length;
  const pendingDeposits = deposits.filter(d => normalizeForCount(d.status) === 'pending').length;

  return (
    <>
      <Helmet>
        <title>Manage Transactions - Admin</title>
        <meta name="description" content="View and manage all user deposits and withdrawals." />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Manage Transactions</h1>
          <p className="text-sm text-gray-400">View and manage all user transactions</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0F1014] border border-white/5 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#80ee64]/10 rounded-xl flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5 text-[#80ee64]" />
              </div>
              <h3 className="text-sm text-gray-400 font-medium">Total Deposits</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              ${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{deposits.length} transactions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0F1014] border border-white/5 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#80ee64]/10 rounded-xl flex items-center justify-center">
                <ArrowUpFromLine className="w-5 h-5 text-[#80ee64]" />
              </div>
              <h3 className="text-sm text-gray-400 font-medium">Total Withdrawals</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              ${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{withdrawals.length} transactions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#0F1014] border border-white/5 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-sm text-gray-400 font-medium">Pending Approval</h3>
            </div>
            <p className="text-2xl font-bold text-white">{pendingDeposits + pendingWithdrawals}</p>
            <p className="text-xs text-gray-500 mt-1">{pendingDeposits} deposits, {pendingWithdrawals} withdrawals</p>
          </motion.div>
        </div>

        {/* Tables */}
        <TransactionTable
          title="Deposits"
          transactions={deposits}
          onStatusChange={handleDepositStatusChange}
          type="Deposit"
          icon={ArrowDownToLine}
          pagination={depositPagination}
          onPageChange={setDepositPage}
        />

        <TransactionTable
          title="Withdrawals"
          transactions={withdrawals}
          onStatusChange={handleWithdrawalStatusChange}
          type="Withdrawal"
          icon={ArrowUpFromLine}
          pagination={withdrawPagination}
          onPageChange={setWithdrawPage}
        />
      </div>
    </>
  );
};

export default AdminTransactions;