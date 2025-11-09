import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Clock, TrendingUp, ArrowRight, Sparkles, Target, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter Plan',
    roi: 4,
    duration: '30 Days',
    min: 50,
    max: 74999,
    tier: '$50 - $75K',
    icon: Target
  },
  {
    name: 'Advanced Plan',
    roi: 6,
    duration: '30 Days',
    min: 75000,
    max: 99999,
    tier: '$75K - $100K',
    icon: TrendingUp
  },
  {
    name: 'Pro Plan',
    roi: 8,
    duration: '60 Days',
    min: 100000,
    max: 249999,
    tier: '$100K - $250K',
    icon: Zap
  },
  {
    name: 'Whale Plan',
    roi: 10,
    duration: '90 Days',
    min: 250000,
    max: Infinity,
    tier: '$250K+',
    icon: Sparkles
  },
];

const Investment = () => {
  const [investment, setInvestment] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const calculateProfit = () => {
    const amount = parseFloat(investment);
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    const plan = plans.find(p => amount >= p.min && amount <= p.max);
    if (!plan) {
      return;
    }
    const profit = (amount * plan.roi) / 100;
    const totalReturn = amount + profit;
    setCalculatedProfit({
      amount,
      roi: plan.roi,
      profit,
      totalReturn,
      planName: plan.name,
      duration: plan.duration
    });
    setSelectedPlan(plan);
  };

  const handleInputChange = (e) => {
    setInvestment(e.target.value);
    if (calculatedProfit) {
      setCalculatedProfit(null);
      setSelectedPlan(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Investment Plans - NovaTrade AI</title>
        <meta name="description" content="Explore investment plans and calculate your potential profits with NovaTrade AI." />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-0"
        >
        </motion.div>

        {/* Investment Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 !mt-0">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0F1014] border border-white/5 hover:border-white/10 rounded-xl p-6 transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
              >
                <div className="relative z-10 flex flex-col gap-5">
                  {/* Header — Title + Icon */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-xs text-gray-400">{plan.tier}</p>
                    </div>
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-[#80ee64]" />
                    </div>
                  </div>

                  {/* ROI + Duration Row with borders */}
                  <div className="border-y border-white/5 py-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{plan.roi}%</span>
                      <span className="text-sm text-gray-400">ROI</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{plan.duration}</span>
                    </div>
                  </div>

                  {/* Invest Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-full bg-[#80ee64] text-[#0F1014] font-semibold text-sm 
              transition-all border border-transparent hover:shadow-[0_0_12px_rgba(128,238,100,0.6)] 
              flex items-center justify-center gap-2 group"
                  >
                    Invest Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>


        {/* Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 !mt-[1.5rem]">
          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-[#0F1014] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#80ee64]/10 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#80ee64]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Profit Calculator</h2>
                <p className="text-sm text-gray-400">Calculate your potential returns</p>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Investment Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={investment}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={calculateProfit}
                disabled={!investment || parseFloat(investment) <= 0}
                className="w-full bg-[#80ee64] hover:bg-[#70de54] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0F1014] font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate Profit
              </motion.button>
            </div>

            {/* Results Section */}
            {calculatedProfit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-4"
              >
                {/* Plan Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Selected Plan:</span>
                  <span className="px-3 py-1 bg-[#80ee64]/10 border border-[#80ee64]/30 rounded-full text-sm font-medium text-[#80ee64]">
                    {calculatedProfit.planName}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Investment</p>
                    <p className="text-lg font-bold text-white">
                      ${calculatedProfit.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Profit ({calculatedProfit.roi}%)</p>
                    <p className="text-lg font-bold text-[#80ee64]">
                      ${calculatedProfit.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Total Return</p>
                    <p className="text-lg font-bold text-white">
                      ${calculatedProfit.totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Duration Info */}
                <div className="flex items-center justify-between bg-[#80ee64]/5 border border-[#80ee64]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#80ee64]" />
                    <span className="text-sm text-gray-400">Investment Duration</span>
                  </div>
                  <span className="text-sm font-medium text-white">{calculatedProfit.duration}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-[#0F1014] border border-white/5 rounded-2xl p-6 flex flex-col"
          >
            <h3 className="text-lg font-bold text-white mb-4">Why Invest with Us?</h3>

            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">High Returns</h4>
                  <p className="text-xs text-gray-400">Earn up to 10% monthly ROI on your investments</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Fast Processing</h4>
                  <p className="text-xs text-gray-400">Quick deposit and withdrawal processing</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">AI-Powered</h4>
                  <p className="text-xs text-gray-400">Advanced AI algorithms optimize your returns</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Secure Platform</h4>
                  <p className="text-xs text-gray-400">Bank-level security for your investments</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10 hover:border-white/20"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Investment;