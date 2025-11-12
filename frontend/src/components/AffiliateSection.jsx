import React from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, DollarSign, Network, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/store/authStore';

const AffiliateSection = () => {
  const { openAuthModal } = useAuthStore();

  const commissionLevels = [
    { level: 1, commission: 10, color: "from-[#8ffb86] to-[#7cf976]" },
    { level: 2, commission: 8, color: "from-[#72f36e] to-[#5ef75b]" },
    { level: 3, commission: 6, color: "from-[#5edb61] to-[#4ed04e]" },
    { level: 4, commission: 4, color: "from-[#505755] to-[#505755]" },
    { level: 5, commission: 2, color: "from-[#404645] to-[#404645]" },
  ];

  const features = [
    {
      icon: DollarSign,
      title: "Direct Commissions",
      description: "Earn up to 10% on every referral's investment instantly",
    },
    {
      icon: TrendingUp,
      title: "Passive Income",
      description: "Get up to 10% from your network's profits automatically",
    },
    {
      icon: Network,
      title: "5-Level Network",
      description: "Build deep and earn from 5 levels of referrals",
    },
    {
      icon: CheckCircle,
      title: "No Deductions",
      description: "Your team's earnings stay intact while you profit",
    },
  ];

  return (
    <section id="affiliate" className="relative bg-black text-white py-16 md:py-24 px-0 sm:px-0 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] opacity-20 pointer-events-none">
        <img
          src="/home/hero/Green_Ellipse.svg"
          alt=""
          className="w-full h-full object-contain blur-3xl"
        />
      </div>

      <div className="container mx-auto max-w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#132413] border border-[#2a2d2d] rounded-full mb-6">
            <Users className="w-4 h-4 text-[#80ee64]" />
            <span className="text-[#80ee64] text-sm font-medium">
              Affiliate Program
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4">
            Turn Your Network Into
            <br />
            <span className="text-[#80ee64] font-normal">Passive Wealth</span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Earn up to 30% total commissions across 5 levels. No caps, no limits—just pure profit from your network's success.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-[#101210] border border-[#2a2d2d] rounded-2xl p-6 hover:border-[#80ee64]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#132413] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#80ee64]" />
                </div>
                <h3 className="text-xl font-light mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Commission Structure */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#101210] border border-[#2a2d2d] rounded-3xl p-6 md:p-8"
          >
            <h3 className="text-2xl md:text-3xl font-light mb-6">
              Commission <span className="text-[#80ee64] font-normal">Structure</span>
            </h3>

            <div className="space-y-4 mb-8">
              {commissionLevels.map((level) => (
                <div
                  key={level.level}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-[#151818] rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-[#2a2d2d]">
                    <span className="text-[10px] text-gray-500 uppercase">Level</span>
                    <span className="text-xl font-bold text-white">{level.level}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Direct & Passive</span>
                      <span className="text-lg font-bold text-[#80ee64]">{level.commission}%</span>
                    </div>
                    <div className="h-2 bg-[#1a1d1d] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${level.commission * 10}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 * level.level }}
                        className={`h-full bg-gradient-to-r ${level.color} rounded-full`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#151818] border border-[#2a2d2d] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Potential</span>
                <span className="text-2xl font-bold text-[#80ee64]">30%</span>
              </div>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Direct Commissions */}
            <div className="bg-[#101210] border border-[#2a2d2d] rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#132413] rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#80ee64]" />
                </div>
                <h3 className="text-xl md:text-2xl font-light">
                  Direct <span className="text-[#80ee64] font-normal">Commissions</span>
                </h3>
              </div>

              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                When you invite someone, you earn a commission based on their total investment without reducing their funds.
              </p>

              <div className="bg-[#151818] border border-[#2a2d2d] rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">Example</p>
                <p className="text-sm text-white leading-relaxed">
                  If you personally invite a user (Level 1) who invests <span className="text-[#80ee64] font-semibold">$10,000</span> → you earn <span className="text-[#80ee64] font-semibold">10% ($1,000)</span> in your wallet.
                </p>
                <div className="mt-3 pt-3 border-t border-[#2a2d2d]">
                  <p className="text-sm text-gray-400">
                    If they invite someone else (Level 2), you earn <span className="text-[#80ee64] font-semibold">8%</span> of that person's investment.
                  </p>
                </div>
              </div>
            </div>

            {/* Passive Commissions */}
            <div className="bg-[#101210] border border-[#2a2d2d] rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#132413] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#80ee64]" />
                </div>
                <h3 className="text-xl md:text-2xl font-light">
                  Passive <span className="text-[#80ee64] font-normal">Commissions</span>
                </h3>
              </div>

              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Our system rewards you with up to 10% from your members' profits, across five levels of your network.
              </p>

              <div className="bg-[#151818] border border-[#2a2d2d] rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">Example</p>
                <p className="text-sm text-white leading-relaxed">
                  If a Level 2 member (8%) earns <span className="text-[#80ee64] font-semibold">$1,000</span> profit this month, you'll automatically receive <span className="text-[#80ee64] font-semibold">8% = $80 USDC</span>, completely passive.
                </p>
                <div className="mt-3 pt-3 border-t border-[#2a2d2d]">
                  <p className="text-sm text-gray-400">
                    No extra work. No deductions from your team's profits.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={() => openAuthModal('signup')}
            className="bg-[#80ee64] hover:bg-[#70de54] text-black font-semibold px-10 py-7 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#80ee64]/30 group"
          >
            Start Earning Today
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-gray-500 text-sm mt-4">
            Join now and unlock unlimited earning potential
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AffiliateSection;