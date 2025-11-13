import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, Clock, CheckCircle2, XCircle, ArrowUpRight, AlertCircle, TrendingDown, Shield } from 'lucide-react';
import { Ethereum, Tether, Usdc, Bitcoin } from '@/components/CoinIcons';
const coinLogos = {
  BTC: "/crypto_icons/btc-logo.png",
  ETH: "/crypto_icons/eth-logo.png",
  USDT: "/crypto_icons/usdt-logo.png",
  USDC: "/crypto_icons/usdc-logo.png",
};

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

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Withdraw = () => {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  // const [amount, setAmount] = useState('');
  // const [address, setAddress] = useState('');
  const { token } = useAuthStore(); // your JWT

  const [balance, setBalance] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);


useEffect(() => {
  const fetchWithdrawHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/withdraw/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setWithdrawals(res.data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch withdraw history:", err);
    }
  };
  fetchWithdrawHistory();
}, [token]);
  useEffect(() => {
    const fetchWithdrawOptions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/withdraw/options`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setBalance(res.data.balance);
          setCurrencies(res.data.currencies);
        }
      } catch (err) {
        console.error("❌ Failed to fetch withdraw options:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawOptions();
  }, [token]);


  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!selectedNetwork) {
      alert("Please select a network");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/withdraw/request`,
        {
          currencyNetworkId: selectedNetwork.network_id,
          amount: parseFloat(amount),
          walletAddress: address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("✅ Withdrawal request submitted successfully!");
        setAmount("");
        setAddress("");
        setSelectedCurrency(null);
        setSelectedNetwork(null);
      } else {
        alert("⚠️ " + res.data.message);
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Something went wrong"));
    }
  };



 const getStatusConfig = (status) => {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case 'approved':
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

    case 'rejected':
    case 'failed':
      return {
        icon: <XCircle className="w-4 h-4" />,
        text: 'Rejected',
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
        <title>Withdraw - Impulse Edge</title>
        <meta name="description" content="Withdraw your earnings from Impulse Edge." />
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
    {currencies.map((c) => (
      <button
        key={c.currency_id}
        type="button"
        onClick={() => {
          setSelectedCurrency(c);
          setSelectedNetwork(null);
        }}
        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
          selectedCurrency?.currency_id === c.currency_id
            ? "bg-[#80ee64]/10 border-[#80ee64]/50 shadow-[0_0_20px_rgba(128,238,100,0.2)]"
            : "bg-[#181A20] border-white/5 hover:border-white/10"
        }`}
      >
        {/* ✅ Pick logo from map or fallback */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden">
          <img
            src={coinLogos[c.symbol] || "/default-coin.svg"}
            alt={c.symbol}
            className="w-full h-full object-contain"
          />
        </div>

        {/* ✅ Text info */}
        <div className="text-left min-w-0">
          <p className="text-sm font-semibold text-white truncate">{c.symbol}</p>
          <p className="text-xs text-gray-400 truncate">{c.name}</p>
        </div>
      </button>
    ))}
  </div>
</div>



              {/* Network Selector */}
              {selectedCurrency && (
                <div>
                  <label className="block text-sm text-gray-400 mb-3 mt-4">Select Network</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedCurrency.networks.map((n) => (
                      <button
                        key={n.network_id}
                        type="button"
                        onClick={() => setSelectedNetwork(n)}
                        className={`p-3 rounded-xl border text-sm transition-all duration-300 ${selectedNetwork?.network_id === n.network_id
                          ? "bg-[#80ee64]/10 border-[#80ee64]/50 text-[#80ee64]"
                          : "bg-[#181A20] border-white/5 hover:border-white/10 text-gray-400"
                          }`}
                      >
                        {n.network_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                  <p className="text-xs text-gray-500">Available: ${balance.toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => setAmount(balance.toFixed(2))}
                    className="text-xs text-[#80ee64] hover:text-[#70de54] transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Wallet Address Input */}
            {/* Wallet Address Input */}
{selectedCurrency && (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm text-gray-400 flex items-center gap-2">
        {/* ✅ Coin Logo + Label */}
        <img
          src={coinLogos[selectedCurrency.symbol] || "/default-coin.svg"}
          alt={selectedCurrency.symbol}
          className="w-5 h-5 rounded-full"
        />
        <span>
          Your{" "}
          <span className="font-semibold text-white">
            {selectedCurrency.symbol}
          </span>{" "}
          Wallet Address
        </span>
      </label>

      {/* ✅ Dynamic Network Name */}
      {selectedNetwork && (
        <span className="text-xs text-gray-500 px-2 py-1 bg-[#181A20] rounded-md">
          {selectedNetwork.network_name}
        </span>
      )}
    </div>

    {/* ✅ Input Field */}
    <div className="relative">
      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder={`Your ${selectedNetwork ? selectedNetwork.network_name : "selected"} wallet address`}
        className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors font-mono text-sm"
      />
    </div>
  </div>
)}




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
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10 hover:border-white/20"
    >
      Refresh
    </button>
  </div>

  {/* Desktop Table View */}
  <div className="hidden lg:block overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-white/5">
          <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Currency</th>
          <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Amount</th>
          <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Network</th>
          <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Status</th>
          <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Date & Time</th>
          <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Address</th>
        </tr>
      </thead>
      <tbody>
        {withdrawals.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center text-gray-500 py-6">
              No withdrawal history found.
            </td>
          </tr>
        ) : (
          withdrawals.map((w) => {
            const statusConfig = getStatusConfig(w.status);
            const dateObj = new Date(w.created_at);
            const date = dateObj.toLocaleDateString();
            const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <tr
                key={w.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={coinLogos[w.currency_symbol] || "/default-coin.svg"}
                      alt={w.currency_symbol}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-white">
                      {w.currency_symbol}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-sm text-white font-medium">
                  ${Number(w.amount).toFixed(2)}
                </td>
                <td className="py-4 px-2 text-sm text-gray-400">
                  {w.network_name || "—"}
                </td>
                <td className="py-4 px-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.textColor} border ${statusConfig.border}`}
                  >
                    {statusConfig.icon}
                    <span className="text-xs font-medium">{statusConfig.text}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-400">
                    <div>{date}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                  </div>
                </td>
                <td className="py-4 px-2 text-xs text-gray-500 font-mono">
                  {w.wallet_address || "—"}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>

  {/* Mobile Card View */}
  <div className="lg:hidden space-y-3">
    {withdrawals.length === 0 ? (
      <p className="text-center text-gray-500 py-6">No withdrawal history found.</p>
    ) : (
      withdrawals.map((w) => {
        const statusConfig = getStatusConfig(w.status);
        const dateObj = new Date(w.created_at);
        const date = dateObj.toLocaleDateString();
        const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        return (
          <div
            key={w.id}
            className="bg-[#181A20] border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={coinLogos[w.currency_symbol] || "/default-coin.svg"}
                  alt={w.currency_symbol}
                  className="w-5 h-5 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {w.currency_symbol}
                  </p>
                  <p className="text-xs text-gray-400">${Number(w.amount).toFixed(2)}</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.textColor} border ${statusConfig.border}`}
              >
                {statusConfig.icon}
                <span className="text-xs font-medium">{statusConfig.text}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Network</span>
                <span className="text-xs text-gray-300">
                  {w.network_name || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Date</span>
                <span className="text-xs text-gray-300">
                  {date} {time}
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-xs text-gray-500 font-mono">
                  {w.wallet_address || "—"}
                </span>
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
</motion.div>

      </div>
    </>
  );
};

export default Withdraw;