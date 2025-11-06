import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Users, DollarSign, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mockReferrals = [
  { email: 'newuser1@example.com', joinDate: '2025-11-01', totalDeposited: 1500, commission: 150 },
  { email: 'investor22@example.com', joinDate: '2025-10-25', totalDeposited: 500, commission: 50 },
  { email: 'tradergal@example.com', joinDate: '2025-10-18', totalDeposited: 3600, commission: 360.25 },
  { email: 'crypto_kid@example.com', joinDate: '2025-09-30', totalDeposited: 0, commission: 0 },
];

const Affiliate = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Fetch referral link from backend
  useEffect(() => {
    const fetchReferralLink = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 Fetching referral link from backend...');
        const res = await axios.get(`${API_BASE_URL}/referral/link`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferralLink(res.data.referral_link);
        console.log('✅ Referral link received:', res.data.referral_link);
      } catch (err) {
        console.error('❌ Error fetching referral link:', err);
        toast({
          title: 'Failed to load referral link',
          description: err.response?.data?.message || 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferralLink();
  }, [token]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Referral link copied to clipboard!' });
  };

  return (
    <>
      <Helmet>
        <title>Affiliate Program - NovaTrade AI</title>
        <meta name="description" content="Earn commissions with the NovaTrade AI affiliate program." />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-green-400 glow-green"
        >
          Affiliate Program
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Users} title="Total Referrals" value="42" />
          <StatCard icon={DollarSign} title="Total Commission" value="$560.25" />
          <StatCard icon={DollarSign} title="Pending Payout" value="$120.00" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/30 rounded-2xl p-8 card-glow"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Share2 className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold">Your Referral Link</h2>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                  <p className="text-sm text-green-300">LEVEL 1</p>
                  <p className="text-xl font-bold">10%</p>
                </div>
                <div className="text-center bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                  <p className="text-sm text-green-300">LEVEL 2</p>
                  <p className="text-xl font-bold">5%</p>
                </div>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-400 mb-4">Loading your referral link...</p>
            ) : !token ? (
              <p className="text-gray-400 mb-4">Please log in to view your referral link.</p>
            ) : referralLink ? (
              <>
                <p className="text-gray-400 mb-4">
                  Share this link to invite others and earn commissions on their investments.
                </p>
                <div className="relative flex items-center mb-6">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pr-12 pl-4 py-3 text-white truncate"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-400 mb-4">No referral link found.</p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-gray-900/50 border border-green-500/20 rounded-xl overflow-hidden card-glow"
        >
          <h2 className="text-xl font-bold p-6">Your Referrals</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/60">
                  <th className="p-4 font-semibold">User Email</th>
                  <th className="p-4 font-semibold">Join Date</th>
                  <th className="p-4 font-semibold">Total Deposited</th>
                  <th className="p-4 font-semibold">Commission Earned</th>
                </tr>
              </thead>
              <tbody>
                {mockReferrals.map((ref, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-800 hover:bg-green-500/5 transition-colors"
                  >
                    <td className="p-4 text-gray-400">{ref.email}</td>
                    <td className="p-4 text-gray-500">{ref.joinDate}</td>
                    <td className="p-4 font-mono">${ref.totalDeposited.toFixed(2)}</td>
                    <td className="p-4 font-mono text-green-400">${ref.commission.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </>
  );
};

const StatCard = ({ icon: Icon, title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 card-glow"
  >
    <div className="flex items-center gap-4">
      <Icon className="w-8 h-8 text-green-400" />
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default Affiliate;
