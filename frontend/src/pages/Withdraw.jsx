import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, Clock, CheckCircle2, XCircle, ArrowUpRight, AlertCircle, TrendingDown, Shield } from 'lucide-react';
import { Ethereum, Tether, Usdc, Bitcoin } from '@/components/CoinIcons';

const withdrawals = [
  { 
    id: 1,
    amount: '0.0095',
    usdValue: '$500.00',
    coin: 'BTC',
    status: 'completed',
    date: '2025-10-28',
    time: '14:30 PM',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf...',
    fee: '$2.50'
  },
  { 
    id: 2,
    amount: '0.472',
    usdValue: '$1,200.00',
    coin: 'ETH',
    status: 'pending',
    date: '2025-11-02',
    time: '09:15 AM',
    address: '0x1234AbCdEfGhIjKlMnOpQrSt...',
    fee: '$5.00'
  },
  { 
    id: 3,
    amount: '350.50',
    usdValue: '$350.50',
    coin: 'USDT',
    status: 'completed',
    date: '2025-10-15',
    time: '16:45 PM',
    address: 'TABCDEFGHIJKLMNOPQRSTUVW...',
    fee: '$1.00'
  },
  { 
    id: 4,
    amount: '250.00',
    usdValue: '$250.00',
    coin: 'USDC',
    status: 'completed',
    date: '2025-10-10',
    time: '11:20 AM',
    address: '0x9876FeDcBa0987654321fedc...',
    fee: '$1.50'
  },
  { 
    id: 5,
    amount: '0.0050',
    usdValue: '$265.00',
    coin: 'BTC',
    status: 'failed',
    date: '2025-10-05',
    time: '08:30 AM',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf...',
    fee: '$2.50'
  },
];

const coinData = {
  BTC: { name: 'Bitcoin', network: 'BTC Mainnet', icon: <Bitcoin className="w-6 h-6 text-orange-400" /> },
  ETH: { name: 'Ethereum', network: 'ERC20', icon: <Ethereum className="w-6 h-6" /> },
  USDT: { name: 'Tether', network: 'TRC20', icon: <Tether className="w-6 h-6" /> },
  USDC: { name: 'USD Coin', network: 'ERC20', icon: <Usdc className="w-6 h-6" /> },
};

const Withdraw = () => {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const handleWithdraw = (e) => {
    e.preventDefault();
    // Handle withdrawal logic here
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: 'Completed',
          bg: 'bg-[#80ee64]/10',
          textColor: 'text-[#80ee64]',
          border: 'border-[#80ee64]/30',
        };
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Pending',
          bg: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          border: 'border-yellow-500/30',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: 'Failed',
          bg: 'bg-red-500/10',
          textColor: 'text-red-400',
          border: 'border-red-500/30',
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Unknown',
          bg: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          border: 'border-gray-500/30',
        };
    }
  };

  return (
    <>
      <Helmet>
        <title>Withdraw - NovaTrade AI</title>
        <meta name="description" content="Withdraw your earnings from NovaTrade AI." />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">
        {/* Header */}
      

        {/* Main Withdrawal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Withdrawal Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-[#0F1014] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#80ee64]/10 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#80ee64]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Request Withdrawal</h2>
                <p className="text-sm text-gray-400">Fill in the details below</p>
              </div>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-6">
              {/* Currency Selector */}
              <div>
                <label className="block text-sm text-gray-400 mb-3">Select Currency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.keys(coinData).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCoin(key)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                        selectedCoin === key
                          ? 'bg-[#80ee64]/10 border-[#80ee64]/50 shadow-[0_0_20px_rgba(128,238,100,0.2)]'
                          : 'bg-[#181A20] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex-shrink-0">{coinData[key].icon}</div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{key}</p>
                        <p className="text-xs text-gray-400 truncate">{coinData[key].name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">Available: $7,202.62</p>
                  <button
                    type="button"
                    onClick={() => setAmount('7202.62')}
                    className="text-xs text-[#80ee64] hover:text-[#70de54] transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Wallet Address Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">
                    Your <span className="font-semibold text-white">{selectedCoin}</span> Wallet Address
                  </label>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-[#181A20] rounded-md">
                    {coinData[selectedCoin].network}
                  </span>
                </div>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={`Your ${coinData[selectedCoin].network} wallet address`}
                    className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors font-mono text-sm"
                  />
                </div>
              </div>

              {/* Fee Information */}
              <div className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Network Fee</span>
                  <span className="text-sm text-white font-medium">~$2.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">You will receive</span>
                  <span className="text-sm text-[#80ee64] font-semibold">
                    {amount ? `$${(parseFloat(amount) - 2.5).toFixed(2)}` : '$0.00'}
                  </span>
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-400 text-sm mb-1">Important Notice</p>
                    <p className="text-xs text-gray-300">
                      Double-check your wallet address. Withdrawals to incorrect addresses cannot be reversed and may result in permanent loss of funds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!amount || !address}
                className="w-full bg-[#80ee64] hover:bg-[#70de54] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0F1014] font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-5 h-5" />
                Withdraw Now
              </motion.button>
            </form>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0F1014] border border-white/5 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Withdrawal Information</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Processing Time</h4>
                  <p className="text-xs text-gray-400">Withdrawals are processed within 24-48 hours</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Minimum Withdrawal</h4>
                  <p className="text-xs text-gray-400">$50 minimum withdrawal amount</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Security</h4>
                  <p className="text-xs text-gray-400">All withdrawals are secured with 2FA verification</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <h4 className="text-sm font-semibold text-white mb-2">Need Help?</h4>
              <p className="text-xs text-gray-400 mb-3">
                If you have any questions about withdrawals, contact our support team.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10 hover:border-white/20"
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Withdrawal History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#0F1014] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Withdrawal History</h2>
              <p className="text-sm text-gray-400">Track all your withdrawal transactions</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10 hover:border-white/20">
              View All
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Currency</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Amount</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">USD Value</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Fee</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Date & Time</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => {
                  const statusConfig = getStatusConfig(withdrawal.status);
                  return (
                    <tr
                      key={withdrawal.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          {coinData[withdrawal.coin].icon}
                          <span className="text-sm font-medium text-white">{withdrawal.coin}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-white font-medium">{withdrawal.amount}</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-400">{withdrawal.usdValue}</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-400">{withdrawal.fee}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.textColor} border ${statusConfig.border}`}>
                          {statusConfig.icon}
                          <span className="text-xs font-medium">{statusConfig.text}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm text-gray-400">
                          <div>{withdrawal.date}</div>
                          <div className="text-xs text-gray-500">{withdrawal.time}</div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-xs text-gray-500 font-mono">{withdrawal.address}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {withdrawals.map((withdrawal) => {
              const statusConfig = getStatusConfig(withdrawal.status);
              return (
                <div
                  key={withdrawal.id}
                  className="bg-[#181A20] border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {coinData[withdrawal.coin].icon}
                      <div>
                        <p className="text-sm font-semibold text-white">{withdrawal.coin}</p>
                        <p className="text-xs text-gray-400">{withdrawal.amount}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.textColor} border ${statusConfig.border}`}>
                      {statusConfig.icon}
                      <span className="text-xs font-medium">{statusConfig.text}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">USD Value</span>
                      <span className="text-xs text-white font-medium">{withdrawal.usdValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Fee</span>
                      <span className="text-xs text-gray-300">{withdrawal.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Date</span>
                      <span className="text-xs text-gray-300">{withdrawal.date} {withdrawal.time}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 font-mono">{withdrawal.address}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Withdraw;