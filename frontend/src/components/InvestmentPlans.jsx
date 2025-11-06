import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { tier: "$50k - $75k", roi: 4, height: 45, color: "from-[#404645] to-[#404645]", text: "text-[#c2c2c2]" },
  { tier: "$75k - $100k", roi: 6, height: 60, color: "from-[#505755] to-[#505755]", text: "text-[#e5e5e5]" },
  { tier: "$100k - $125k", roi: 8, height: 75, color: "from-[#5edb61] to-[#4ed04e]", text: "text-black" },
  { tier: "$125k - $150k", roi: 9, height: 85, color: "from-[#72f36e] to-[#5ef75b]", text: "text-black" },
  { tier: "$150k+", roi: 10, height: 95, color: "from-[#8ffb86] to-[#7cf976]", text: "text-black" },
];

const InvestmentPlans = () => {
  return (
    <section className="relative bg-black text-white py-12 md:py-16 lg:py-24 px-0 sm:px-0 overflow-hidden">
      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 items-center gap-8 md:gap-12 lg:gap-16">

        {/* Left - Bar Chart (Vertical on desktop, Horizontal on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-transparent border-l border-b md:border-l md:border-b border-[#2a2d2d] rounded-bl-[40px] md:rounded-bl-[60px] px-4 md:px-6 py-4 md:py-6 w-full"
        >
          {/* Desktop: Vertical Bars */}
          <div className="hidden md:flex items-end justify-between gap-2 lg:gap-3 h-[280px] lg:h-[320px] relative">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: `${plan.height}%`, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`bg-gradient-to-t ${plan.color} rounded-t-[12px] lg:rounded-t-[16px] relative shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                style={{ width: "100%", maxWidth: "110px", minHeight: "100px" }}
              >
                <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 leading-tight">
                  <p className={`text-[10px] lg:text-[11px] font-semibold ${plan.text} opacity-80`}>
                    ROI
                  </p>
                  <p className={`text-[18px] lg:text-[20px] font-bold ${plan.text}`}>
                    {plan.roi}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Bottom Labels */}
          <div className="hidden md:flex justify-between mt-4 lg:mt-6 text-[10px] lg:text-xs text-gray-400 px-1">
            {plans.map((plan) => (
              <p key={plan.tier} className="text-center w-full max-w-[110px] leading-tight">
                {plan.tier}
              </p>
            ))}
          </div>

          {/* Mobile: Horizontal Bars */}
          <div className="flex md:hidden flex-col gap-3 w-full">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: `${plan.height}%`, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                <div
                  className={`bg-gradient-to-r ${plan.color} rounded-r-[12px] relative shadow-lg transition-all duration-300`}
                  style={{ minWidth: "120px", height: "60px" }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 left-3 leading-tight">
                    <p className={`text-[10px] font-semibold ${plan.text} opacity-80`}>
                      ROI
                    </p>
                    <p className={`text-[18px] font-bold ${plan.text}`}>
                      {plan.roi}%
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 ml-1">
                  {plan.tier}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4 md:space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#132413] border border-[#2a2d2d] rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-[#80ee64]" />
            <span className="text-[#80ee64] text-[12px] md:text-[13px] font-medium">
              Smart Investment Tiers
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
            Rewards That<br />
            <span className="text-[#80ee64] font-normal">Match Your Ambition</span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-full">
            From $50K to $250K+, every investment level is built to deliver results.
            How far do you want to go?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">

            <Button
  className="bg-[#80ee64] hover:bg-[#70de54] text-black font-semibold 
             px-8 md:px-10 py-7 md:py-7 text-base md:text-lg 
             rounded-full transition-all duration-300 
             hover:scale-105 hover:shadow-xl hover:shadow-[#80ee64]/30 group"
>
  Start Investing
  <ArrowRight className="ml-3 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
</Button>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default InvestmentPlans;