import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Copy, Bitcoin, Wallet, Check, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import axios from "axios";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Deposit = () => {
  const [selectedCoin, setSelectedCoin] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");

  const [copied, setCopied] = useState(false);
  const [coinData, setCoinData] = useState({});
  const [depositHistory, setDepositHistory] = useState([]);
  const { token } = useAuthStore();


  const [showModal, setShowModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/deposits/wallets`);
        const wallets = res.data.data.reduce((acc, w) => {
          if (!acc[w.symbol]) {
            acc[w.symbol] = {
              name: w.name,
              icon: (
                <img
                  src={`/crypto_icons/${w.symbol.toLowerCase()}-logo.png`}
                  alt={w.symbol}
                  className="w-6 h-6 rounded-full"
                />
              ),
              networks: [],
            };
          }
          acc[w.symbol].networks.push({
            network: w.network,
            address: w.wallet_address,
          });
          return acc;
        }, {});
        setCoinData(wallets);
        const firstCoin = Object.keys(wallets)[0];
        if (firstCoin) {
          setSelectedCoin(firstCoin);
          // ✅ auto select first available network
          const firstNetwork = wallets[firstCoin]?.networks?.[0]?.network || "";
          setSelectedNetwork(firstNetwork);
        }
      } catch (err) {
        console.error("Error fetching wallets:", err);
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/deposits/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepositHistory(res.data.data || []);
      } catch (err) {
        console.error("Error fetching deposit history:", err);
      }
    };

    fetchWallets();
    if (token) fetchHistory();
  }, [token]);




  const handleCopy = () => {
    if (!selectedCoin || !selectedNetwork) return;
    const address = coinData[selectedCoin].networks.find(
      (n) => n.network === selectedNetwork
    )?.address;
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositSubmit = async () => {
    if (!depositAmount || !txHash) {
      alert("Please enter both amount and transaction hash.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${API_BASE_URL}/deposits`,
        {
          currency_symbol: selectedCoin,
          network: selectedNetwork,
          amount: depositAmount,
          tx_hash: txHash,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
     setShowModal(false);
setDepositAmount("");
setTxHash("");
toast.success("Deposit submitted successfully");

      const res = await axios.get(`${API_BASE_URL}/deposits/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepositHistory(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong while submitting your deposit");
    } finally {
      setIsSubmitting(false);
    }
  };


  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
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
  if (!selectedCoin || !coinData[selectedCoin]) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading wallet information...
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>Deposit - Impulse Edge</title>
        <meta name="description" content="Deposit cryptocurrency into your Impulse Edge account." />
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
                    onClick={() => {
                      setSelectedCoin(key);
                      // ✅ auto-select first network for this new coin
                      const firstNetwork = coinData[key]?.networks?.[0]?.network || "";
                      setSelectedNetwork(firstNetwork);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${selectedCoin === key
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

            {/* Network Selector */}
            {selectedCoin && coinData[selectedCoin]?.networks?.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Select Network</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {coinData[selectedCoin].networks.map((n) => (
                    <button
                      key={n.network}
                      onClick={() => setSelectedNetwork(n.network)}
                      className={`p-3 rounded-xl border text-sm transition-all duration-300 ${selectedNetwork === n.network
                          ? 'bg-[#80ee64]/10 border-[#80ee64]/50 text-[#80ee64]'
                          : 'bg-[#181A20] border-white/5 text-white hover:border-white/10'
                        }`}
                    >
                      {n.network}
                    </button>
                  ))}
                </div>
              </div>
            )}


            {/* Deposit Address */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400">
                  Your <span className="font-semibold text-white">{selectedCoin}</span> Address
                </label>
                <span className="text-xs text-gray-500 px-2 py-1 bg-[#181A20] rounded-md">
                  {selectedNetwork || "Select a network"}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={
                    coinData[selectedCoin]?.networks?.find((n) => n.network === selectedNetwork)?.address || ""
                  }
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
                    <span className="font-semibold text-white">{selectedNetwork || "Select a network"}</span> network.
                    Sending other assets or using a different network may result in permanent loss of funds.
                  </p>
                </div>
              </div>
            </div>

            <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => setShowModal(true)}
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
              <motion.a
  href="https://t.me/ImpulseEdge"
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="block w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10 hover:border-white/20 text-center"
>
  Contact Support
</motion.a>

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
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Network</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Date & Time</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {depositHistory.map((deposit) => {
                  const statusConfig = getStatusConfig(deposit.status);
                  return (
                    <tr key={deposit.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          {coinData[deposit.symbol]?.icon || (
                            <div className="w-6 h-6 rounded-full bg-gray-700" />
                          )}
                          <span className="text-sm font-medium text-white">{deposit.symbol}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-white font-medium">{deposit.amount}</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-400">{deposit.network}</span>
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
                          <div>{deposit.date}</div>
                          <div className="text-xs text-gray-500">{deposit.time}</div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-mono">{deposit.tx_hash}</span>
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
            {coinData[deposit.symbol]?.icon || (
              <div className="w-6 h-6 rounded-full bg-gray-700" />
            )}
            <div>
              <p className="text-sm font-semibold text-white">{deposit.symbol}</p>
              <p className="text-xs text-gray-400">{deposit.amount}</p>
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
            <span className="text-xs text-white font-medium">{deposit.network}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Date</span>
            <span className="text-xs text-gray-300">{deposit.date} {deposit.time}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-gray-500 font-mono truncate flex-1">
              {deposit.tx_hash}
            </span>
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
      {showModal && (
  <motion.div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-[#0F1014] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
    >
      <h3 className="text-xl font-bold text-white mb-4">Confirm Deposit</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Amount ({selectedCoin})</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full bg-[#181A20] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#80ee64]/50"
            placeholder={`Enter amount in ${selectedCoin}`}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Transaction Hash</label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="w-full bg-[#181A20] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#80ee64]/50"
            placeholder="Paste your transaction hash"
          />
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mt-2">
          <p className="text-xs text-amber-400 leading-relaxed">
            ⚠️ <b>Important:</b> Ensure your amount and transaction hash are <b>100% correct</b>.
            Incorrect values may cause your deposit to not be processed. You’ll need to contact
            support to resolve such issues.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDepositSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm rounded-lg bg-[#80ee64] hover:bg-[#70de54] text-[#0F1014] font-semibold disabled:opacity-70"
          >
            {isSubmitting ? "Processing..." : "Confirm Deposit"}
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}

    </>
  );
};

export default Deposit;