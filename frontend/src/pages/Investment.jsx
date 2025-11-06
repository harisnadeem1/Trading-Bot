import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const plans = [
  { name: 'Starter Plan', roi: 4, duration: '30 Days', min: 50, max: 74999, tier: '$50 - $75K' },
  { name: 'Advanced Plan', roi: 6, duration: '30 Days', min: 75000, max: 99999, tier: '$75K - $100K' },
  { name: 'Pro Plan', roi: 8, duration: '60 Days', min: 100000, max: 249999, tier: '$100K - $250K' },
  { name: 'Whale Plan', roi: 10, duration: '90 Days', min: 250000, max: Infinity, tier: '$250K+' },
];

const Investment = () => {
  const [investment, setInvestment] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);
  const { toast } = useToast();

  const calculateProfit = () => {
    const amount = parseFloat(investment);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    const plan = plans.find(p => amount >= p.min && amount < p.max);
    if (!plan) {
      toast({ title: 'Amount does not fit any plan', variant: 'destructive' });
      return;
    }
    const profit = (amount * plan.roi) / 100;
    setCalculatedProfit({ amount, roi: plan.roi, profit, planName: plan.name });
  };
  
  const handleInvest = () => {
    toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  return (
    <>
      <Helmet>
        <title>Investment Plans - NovaTrade AI</title>
        <meta name="description" content="Explore investment plans and calculate your potential profits with NovaTrade AI." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-green-400 glow-green"
        >
          Investment Plans
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 card-glow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.tier}</p>
                <div className="text-4xl font-bold text-green-400 glow-green mb-4">{plan.roi}% <span className="text-lg font-normal text-gray-400">/ month</span></div>
                <div className="flex items-center gap-2 text-gray-400 text-sm"><Clock className="w-4 h-4" />{plan.duration}</div>
              </div>
              <Button onClick={handleInvest} className="w-full mt-6 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30">Invest Now</Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/30 rounded-2xl p-8 card-glow"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl font-bold">Profit Calculator</h3>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="number" value={investment} onChange={(e) => setInvestment(e.target.value)} placeholder="Enter amount" className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60" />
            </div>
            <Button onClick={calculateProfit} className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3">Calculate</Button>
            {calculatedProfit && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
                <p>Plan: <span className="font-bold">{calculatedProfit.planName}</span></p>
                <p>Monthly Profit ({calculatedProfit.roi}%): <span className="font-bold text-green-400 glow-green">${calculatedProfit.profit.toLocaleString()}</span></p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Investment;