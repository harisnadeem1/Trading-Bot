import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Copy, Users, DollarSign, Share2, TrendingUp, Gift, Check, ArrowRight, Info } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Affiliate = () => {
  const { token } = useAuthStore();
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    activeReferrals: 0,
    referrals: [],
  });

  useEffect(() => {
    const fetchAffiliateStats = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/affiliate/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.data);
      } catch (err) {
        console.error('Error fetching affiliate dashboard:', err);
      }
    };

    fetchAffiliateStats();
  }, [token]);

  useEffect(() => {
    const fetchReferralLink = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/referral/link`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferralLink(res.data.referral_link);
      } catch (err) {
        console.error('Error fetching referral link:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralLink();
  }, [token]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Affiliate Program - Impulse Edge</title>
        <meta name="description" content="Earn commissions with the Impulse Edge affiliate program." />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">
        {/* Header */}


        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0F1014] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-center gap-3 mb-3">
              <h3 className="text-sm text-gray-400 font-medium">Total Referrals</h3>
              <div className="flex items-center justify-center">
                <Users className="w-6 h-6 text-[#80ee64]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
            <p className="text-xs text-gray-500 mt-1">Total sign-ups</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0F1014] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-center gap-3 mb-3">
              <h3 className="text-sm text-gray-400 font-medium">Total Earned</h3>
              <div className="flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#80ee64]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              ${Number(stats.totalEarnings).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#0F1014] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-center gap-3 mb-3">
              <h3 className="text-sm text-gray-400 font-medium">Active Referrals</h3>
              <div className="flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#80ee64]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.activeReferrals}</p>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </motion.div>




          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#0F1014] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-center gap-3 mb-3">
              <h3 className="text-sm text-gray-400 font-medium">Team Revenue</h3>
              <div className="flex items-center justify-center">
                <Gift className="w-6 h-6 text-[#80ee64]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              ${Number(stats.teamRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total deposits generated by your 5-level team</p>
          </motion.div>

        </div>

        {/* Commission Structure Section */}


        {/* Referral Link Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 bg-[#0F1014] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#80ee64]/10 rounded-xl flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#80ee64]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Referral Link</h2>
                <p className="text-sm text-gray-400">Share and start earning commissions</p>
              </div>
            </div>

            {loading ? (
              <div className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-400">Loading your referral link...</p>
              </div>
            ) : !token ? (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <p className="text-sm text-amber-400">Please log in to view your referral link.</p>
              </div>
            ) : referralLink ? (
              <>
                <div className="relative mb-4">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-white text-sm font-mono focus:outline-none"
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className="w-full bg-[#80ee64] hover:bg-[#70de54] text-[#0F1014] font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </motion.button>
              </>
            ) : (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <p className="text-sm text-red-400">No referral link found.</p>
              </div>
            )}
          </motion.div>




          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-[#0F1014] border border-white/5 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">1. Share Link</h4>
                  <p className="text-xs text-gray-400">Share your unique referral link</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">2. They Sign Up</h4>
                  <p className="text-xs text-gray-400">New users register using your link</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">3. Earn Commission</h4>
                  <p className="text-xs text-gray-400">Get paid when they deposit or invest</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">4. Grow Network</h4>
                  <p className="text-xs text-gray-400">Earn from 5 levels deep</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#0F1014] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#80ee64]/10 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#80ee64]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Commission Structure</h2>
              <p className="text-sm text-gray-400">Earn up to 30% across 5 levels</p>
            </div>
          </div>

          {/* Visual Level Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {[
              { level: 1, commission: 10, color: 'from-[#80ee64] to-[#70de54]' },
              { level: 2, commission: 8, color: 'from-[#70de54] to-[#60ce44]' },
              { level: 3, commission: 6, color: 'from-[#60ce44] to-[#50be34]' },
              { level: 4, commission: 4, color: 'from-[#50be34] to-[#40ae24]' },
              { level: 5, commission: 2, color: 'from-[#40ae24] to-[#309e14]' },
            ].map((item) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + item.level * 0.1 }}
                className="relative bg-[#181A20] border border-white/5 rounded-xl p-4 hover:border-[#80ee64]/30 transition-all group"
              >
                {/* Level Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-400">LEVEL {item.level}</span>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                </div>

                {/* Commission Percentage */}
                <div className="mb-2">
                  <p className="text-3xl font-bold text-white">{item.commission}%</p>
                </div>

                {/* Visual Bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.commission * 10}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="bg-gradient-to-r from-[#80ee64]/10 to-[#80ee64]/5 border border-[#80ee64]/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#80ee64]/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#80ee64]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Commission Potential</p>
                  <p className="text-2xl font-bold text-white">30%</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[#80ee64]">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-semibold">Across 5 Levels</span>
              </div>
            </div>
          </div>

          {/* How It Works - Modern Cards */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-4">How Commissions Work</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Direct Commissions */}
              <div className="bg-gradient-to-br from-[#181A20] to-[#0F1014] border border-white/5 rounded-xl p-5 hover:border-[#80ee64]/20 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#80ee64]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#80ee64]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Direct Commissions</h4>
                    <p className="text-xs text-gray-400">On investments</p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                  Earn commission based on your referrals' total investment without reducing their funds.
                </p>

                {/* Example Box */}
                <div className="bg-[#0F1014] border border-[#80ee64]/10 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-5 h-5 bg-[#80ee64]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#80ee64]">1</span>
                    </div>
                    <p className="text-xs text-gray-400">Level 1 referral invests <span className="text-white font-semibold">$10,000</span></p>
                  </div>
                  <div className="flex items-center gap-2 pl-7">
                    <ArrowRight className="w-4 h-4 text-[#80ee64]" />
                    <p className="text-sm font-bold text-[#80ee64]">You earn $1,000 (10%)</p>
                  </div>
                </div>
              </div>

              {/* Passive Commissions */}
              <div className="bg-gradient-to-br from-[#181A20] to-[#0F1014] border border-white/5 rounded-xl p-5 hover:border-[#80ee64]/20 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#80ee64]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-[#80ee64]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Passive Commissions</h4>
                    <p className="text-xs text-gray-400">On profits</p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                  Earn automatically from your team's profits across all five levels of your network.
                </p>

                {/* Example Box */}
                <div className="bg-[#0F1014] border border-[#80ee64]/10 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-5 h-5 bg-[#80ee64]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#80ee64]">2</span>
                    </div>
                    <p className="text-xs text-gray-400">Level 2 member earns <span className="text-white font-semibold">$1,000 profit</span></p>
                  </div>
                  <div className="flex items-center gap-2 pl-7">
                    <ArrowRight className="w-4 h-4 text-[#80ee64]" />
                    <p className="text-sm font-bold text-[#80ee64]">You earn $80 (8%) automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note - Redesigned */}
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-400 mb-2">Important Information</p>
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300">Commissions continue up to Level 5 (2%)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300">Beyond Level 5, no commissions are given</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300">No deductions from your team's profits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Referrals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-[#0F1014] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Your Referrals</h2>
              <p className="text-sm text-gray-400">Track your referred users and earnings</p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">User</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Join Date</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Total Deposited</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Your Commission</th>
                  <th className="text-left text-xs font-medium text-gray-400 pb-3 px-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {stats.referrals.length > 0 ? (
                  stats.referrals.map((referral) => (
                    <tr
                      key={referral.user_id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <span className="text-sm text-white">{referral.email}</span>
                      </td>

                      <td className="py-4 px-2">
                        <div className="text-sm text-gray-400">
                          <div>{referral.join_date}</div>
                          <div className="text-xs text-gray-500">{referral.join_time}</div>
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        <span className="text-sm text-white font-medium">
                          ${Number(referral.total_deposited).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="py-4 px-2">
                        <span className="text-sm text-[#80ee64] font-semibold">
                          ${Number(referral.commission_earned).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${referral.status === 'active'
                              ? 'bg-[#80ee64]/10 text-[#80ee64] border border-[#80ee64]/30'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            }`}
                        >
                          {referral.status === 'active' ? <Check className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                          {referral.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500 text-sm">
                      No referrals found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {stats.referrals.length > 0 ? (
              stats.referrals.map((referral) => (
                <div key={referral.user_id} className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{referral.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {referral.join_date} {referral.join_time}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${referral.status === 'active'
                          ? 'bg-[#80ee64]/10 text-[#80ee64] border border-[#80ee64]/30'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                        }`}
                    >
                      {referral.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Total Deposited</span>
                      <span className="text-xs text-white font-medium">
                        ${Number(referral.total_deposited).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Your Commission</span>
                      <span className="text-xs text-[#80ee64] font-semibold">
                        ${Number(referral.commission_earned).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">No referrals found yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Affiliate;