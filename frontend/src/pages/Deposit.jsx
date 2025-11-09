import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Copy, Bitcoin, Wallet, Check, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Ethereum, Tether, Usdc } from '@/components/CoinIcons';

const coinData = {
  BTC: {
    name: "Bitcoin",
    network: "BTC Mainnet",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    icon: <Bitcoin className="w-6 h-6 text-orange-400" />,
  },
  ETH: {
    name: "Ethereum",
    network: "ERC20",
    address: "0x1234AbCdEfGhIjKlMnOpQrStUvWxYz567890aBcDeF",
    icon: <Ethereum className="w-6 h-6" />,
  },
  USDT: {
    name: "Tether",
    network: "TRC20",
    address: "TABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ab",
    icon: <Tether className="w-6 h-6" />,
  },
  USDC: {
    name: "USD Coin",
    network: "ERC20",
    address: "0x9876FeDcBa0987654321fedcba9876543210FeDc",
    icon: <Usdc className="w-6 h-6" />,
  },
};

// Mock deposit history data
const depositHistory = [
  {
    id: 1,
    coin: 'BTC',
    amount: '0.0234',
    usdValue: '$1,245.50',
    status: 'completed',
    date: '2024-01-15',
    time: '14:32 PM',
    txHash: '0x1a2b3c4d5e6f7g8h9i0j...',
  },
  {
    id: 2,
    coin: 'USDT',
    amount: '5,000.00',
    usdValue: '$5,000.00',
    status: 'completed',
    date: '2024-01-14',
    time: '09:15 AM',
    txHash: '0x9i8h7g6f5e4d3c2b1a0j...',
  },
  {
    id: 3,
    coin: 'ETH',
    amount: '2.5',
    usdValue: '$4,250.00',
    status: 'pending',
    date: '2024-01-14',
    time: '08:45 AM',
    txHash: '0x5e4d3c2b1a0j9i8h7g6f...',
  },
  {
    id: 4,
    coin: 'USDC',
    amount: '1,000.00',
    usdValue: '$1,000.00',
    status: 'completed',
    date: '2024-01-13',
    time: '16:20 PM',
    txHash: '0x7g6f5e4d3c2b1a0j9i8h...',
  },
  {
    id: 5,
    coin: 'BTC',
    amount: '0.0150',
    usdValue: '$798.75',
    status: 'failed',
    date: '2024-01-12',
    time: '11:30 AM',
    txHash: '0x3c2b1a0j9i8h7g6f5e4d...',
  },
];

const Deposit = () => {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coinData[selectedCoin].address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <title>Deposit - NovaTrade AI</title>
        <meta name="description" content="Deposit cryptocurrency into your NovaTrade AI account." />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">
        {/* Header */}
      

        {/* Main Deposit Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deposit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-[#0F1014] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#80ee64]/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#80ee64]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Deposit Address</h2>
                <p className="text-sm text-gray-400">Send crypto to this address</p>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-3">Select Currency</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(coinData).map((key) => (
                  <button
                    key={key}
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

            {/* Deposit Address */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400">
                  Your <span className="font-semibold text-white">{selectedCoin}</span> Address
                </label>
                <span className="text-xs text-gray-500 px-2 py-1 bg-[#181A20] rounded-md">
                  {coinData[selectedCoin].network}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={coinData[selectedCoin].address}
                  className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-white text-sm font-mono focus:outline-none focus:border-[#80ee64]/50 transition-colors"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-[#80ee64]" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-400 text-sm mb-1">Important Notice</p>
                  <p className="text-xs text-gray-300">
                    Only send <span className="font-semibold text-white">{selectedCoin}</span> via the{' '}
                    <span className="font-semibold text-white">{coinData[selectedCoin].network}</span> network. 
                    Sending other assets or using a different network may result in permanent loss of funds.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#80ee64] hover:bg-[#70de54] text-[#0F1014] font-semibold py-3.5 rounded-xl transition-all duration-300"
            >
              I've Made a Deposit
            </motion.button>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0F1014] border border-white/5 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Deposit Information</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Instant Credit</h4>
                  <p className="text-xs text-gray-400">Funds are credited after network confirmations</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Processing Time</h4>
                  <p className="text-xs text-gray-400">Usually takes 10-30 minutes depending on network</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Minimum Deposit</h4>
                  <p className="text-xs text-gray-400">No minimum deposit amount required</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <h4 className="text-sm font-semibold text-white mb-2">Need Help?</h4>
              <p className="text-xs text-gray-400 mb-3">
                If you have any questions about deposits, please contact our support team.
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

        {/* Deposit History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#0F1014] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Deposit History</h2>
              <p className="text-sm text-gray-400">Track all your deposit transactions</p>
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
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Date & Time</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {depositHistory.map((deposit, index) => {
                  const statusConfig = getStatusConfig(deposit.status);
                  return (
                    <tr
                      key={deposit.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          {coinData[deposit.coin].icon}
                          <span className="text-sm font-medium text-white">{deposit.coin}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-white font-medium">{deposit.amount}</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-400">{deposit.usdValue}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.textColor} border ${statusConfig.border}`}>
                          {statusConfig.icon}
                          <span className="text-xs font-medium">{statusConfig.text}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm text-gray-400">
                          <div>{deposit.date}</div>
                          <div className="text-xs text-gray-500">{deposit.time}</div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-mono">{deposit.txHash}</span>
                          <button className="p-1 rounded hover:bg-white/5 transition-colors">
                            <Copy className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {depositHistory.map((deposit) => {
              const statusConfig = getStatusConfig(deposit.status);
              return (
                <div
                  key={deposit.id}
                  className="bg-[#181A20] border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {coinData[deposit.coin].icon}
                      <div>
                        <p className="text-sm font-semibold text-white">{deposit.coin}</p>
                        <p className="text-xs text-gray-400">{deposit.amount}</p>
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
                      <span className="text-xs text-white font-medium">{deposit.usdValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Date</span>
                      <span className="text-xs text-gray-300">{deposit.date} {deposit.time}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 font-mono truncate flex-1">{deposit.txHash}</span>
                      <button className="p-1 rounded hover:bg-white/5 transition-colors ml-2">
                        <Copy className="w-3 h-3 text-gray-500" />
                      </button>
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

export default Deposit;