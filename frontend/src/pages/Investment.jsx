import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Calculator,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Star,
  Crown,
  Rocket,
} from "lucide-react";

// Map plan names to icons for visual consistency
const iconMap = {
  "Starter Plan": Target,
  "Growth Plan": TrendingUp,
  "Pro Plan": Zap,
  "Elite Plan": Star,
  "Titan Plan": Crown,
  // Fallback for any other plans
  "Advanced Plan": Rocket,
  "Whale Plan": Sparkles,
};

const Investment = () => {
  const [plans, setPlans] = useState([]);
  const [investment, setInvestment] = useState("");
  const [calculatedProfit, setCalculatedProfit] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeInvestment, setActiveInvestment] = useState(null);

  useEffect(() => {
    const fetchActiveInvestment = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/invest/active`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success && res.data.active) {
          setActiveInvestment(res.data.investment);
        } else {
          setActiveInvestment(null);
        }
      } catch (err) {
        console.error("Error loading active investment:", err);
      }
    };

    fetchActiveInvestment();
  }, []);

  // ✅ Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/plans`
        );
        if (res.data.success) {
          setPlans(res.data.data);
        }
      } catch (err) {
        console.error("Error loading plans:", err);
      }
    };
    fetchPlans();
  }, []);

  // ✅ Start investment request to backend
  const handleStartInvestment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first to start investing.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/invest/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Investment started successfully!");
        setTimeout(() => {
          window.location.href = "/dashboard/investment";
        }, 2000);
      } else {
        toast.error(res.data.message || "Could not start investment.");
      }
    } catch (err) {
      console.error("Error starting investment:", err);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong while starting your investment."
      );
    }
  };

  // ✅ Calculate profit based on entered investment
  const calculateProfit = () => {
    const amount = parseFloat(investment);
    if (isNaN(amount) || amount <= 0) return;

    const plan = plans.find(
      (p) =>
        amount >= p.min_amount &&
        (p.max_amount === null || amount <= p.max_amount)
    );

    if (!plan) return;

    const profit = (amount * plan.roi) / 100;
    const totalReturn = amount + profit;

    setCalculatedProfit({
      amount,
      roi: plan.roi,
      profit,
      totalReturn,
      planName: plan.name,
      duration: `${plan.duration_days} Days`,
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
        <title>Investment Plans - Impulse Edge</title>
        <meta
          name="description"
          content="Explore investment plans and calculate your potential profits with Impulse Edge."
        />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0F1014] rounded-2xl p-6 flex flex-col items-center text-center border border-white/5"
        >
          {activeInvestment ? (
            <>
              <h2 className="text-xl font-bold text-[#80ee64] mb-2">
                Active Investment
              </h2>
              <p className="text-sm text-gray-400 mb-5 max-w-md">
                You're currently enrolled in the{" "}
                <span className="text-white font-semibold">
                  {activeInvestment.plan_name}
                </span>{" "}
                plan.
              </p>

              {/* Plan Summary */}
              <div className="flex flex-wrap justify-center gap-4 mb-5 text-sm">
                <div className="bg-[#181A20] border border-white/5 rounded-xl px-4 py-2">
                  <span className="text-gray-400">Amount: </span>
                  <span className="text-white font-medium">
                    ${Number(activeInvestment.amount).toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#181A20] border border-white/5 rounded-xl px-4 py-2">
                  <span className="text-gray-400">ROI Target: </span>
                  <span className="text-white font-medium">
                    {activeInvestment.monthly_target_roi}%
                  </span>
                </div>
                <div className="bg-[#181A20] border border-white/5 rounded-xl px-4 py-2">
                  <span className="text-gray-400">Duration: </span>
                  <span className="text-white font-medium">
                    {activeInvestment.duration_days} Days
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-sm text-left">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>
                    {activeInvestment.elapsed_days} /{" "}
                    {activeInvestment.duration_days} days
                  </span>
                  <span>{activeInvestment.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#181A20] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeInvestment.progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-[#80ee64] rounded-full"
                  ></motion.div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2">
                Ready to Start?
              </h2>
              <p className="text-sm text-gray-400 mb-5 max-w-md">
                The system will automatically detect your eligible plan based on
                your wallet balance. Once started, you'll receive daily ROI
                updates automatically.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartInvestment}
                className="px-8 py-3 rounded-xl bg-[#80ee64] hover:bg-[#70de54] text-[#0F1014] font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Investment
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Plans Grid - Changed to 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan, index) => {
            const IconComponent = iconMap[plan.name] || Target;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0F1014] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all duration-300 group hover:shadow-lg"
              >
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {plan.description || "Investment plan details"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#80ee64]/10 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-[#80ee64]" />
                  </div>
                </div>

                {/* ROI */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#80ee64]">
                      {plan.roi}%
                    </span>
                    <span className="text-sm text-gray-400">ROI</span>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="space-y-2 mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Range</span>
                    <span className="text-white font-medium">
                      ${Number(plan.min_amount).toLocaleString()}{" "}
                      {plan.max_amount
                        ? `- $${Number(plan.max_amount).toLocaleString()}`
                        : "+"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">
                      {plan.duration_days} Days
                    </span>
                  </div>
                  {plan.auto_roi !== undefined && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Auto ROI</span>
                      <span
                        className={`font-medium ${
                          plan.auto_roi ? "text-[#80ee64]" : "text-gray-400"
                        }`}
                      >
                        {plan.auto_roi ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Note */}
                <p className="text-xs text-gray-500 italic text-center">
                  Automatically applied when your balance matches this plan
                  range
                </p>
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
                <h2 className="text-xl font-bold text-white">
                  Profit Calculator
                </h2>
                <p className="text-sm text-gray-400">
                  Calculate your potential returns
                </p>
              </div>
            </div>

            {/* Input */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Investment Amount
                </label>
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

            {/* Results */}
            {calculatedProfit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Selected Plan:</span>
                  <span className="px-3 py-1 bg-[#80ee64]/10 border border-[#80ee64]/30 rounded-full text-sm font-medium text-[#80ee64]">
                    {calculatedProfit.planName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Investment</p>
                    <p className="text-lg font-bold text-white">
                      $
                      {calculatedProfit.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">
                      Profit ({calculatedProfit.roi}%)
                    </p>
                    <p className="text-lg font-bold text-[#80ee64]">
                      $
                      {calculatedProfit.profit.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="bg-[#181A20] border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Total Return</p>
                    <p className="text-lg font-bold text-white">
                      $
                      {calculatedProfit.totalReturn.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#80ee64]/5 border border-[#80ee64]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#80ee64]" />
                    <span className="text-sm text-gray-400">
                      Investment Duration
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {calculatedProfit.duration}
                  </span>
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
            <h3 className="text-lg font-bold text-white mb-4">
              Why Invest with Us?
            </h3>

            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    High Returns
                  </h4>
                  <p className="text-xs text-gray-400">
                    Earn up to 25% monthly ROI on your investments
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    Fast Processing
                  </h4>
                  <p className="text-xs text-gray-400">
                    Quick deposit and withdrawal processing
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    AI-Powered
                  </h4>
                  <p className="text-xs text-gray-400">
                    Advanced AI algorithms optimize your returns
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#80ee64]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#80ee64]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    Secure Platform
                  </h4>
                  <p className="text-xs text-gray-400">
                    Bank-level security for your investments
                  </p>
                </div>
              </div>
            </div>

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