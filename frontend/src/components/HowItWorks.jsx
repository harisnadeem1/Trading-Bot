import React from "react";
import { motion } from "framer-motion";
import {
  Maximize2,
  BarChart3,
  Shield,
  FileText,
  PieChart,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Maximize2,
    title: "The Pattern",
    highlight: "Hunter",
    description:
      "Scans through chaos to pinpoint high-value opportunities. Your edge in a noisy market.",
  },
  {
    icon: BarChart3,
    title: "Momentum Is",
    highlight: "Money",
    description:
      "Turns volatility into your secret weapon, catching trends before they take off.",
  },
  {
    icon: Shield,
    title: "Flawless Entries",
    highlight: "Only",
    description:
      "Only pulls the trigger when everything aligns—precision guaranteed.",
  },
  {
    icon: FileText,
    title: "Breakout",
    highlight: "Entry",
    description:
      "Perfectly times every breakout move, ensuring no profit is left behind.",
  },
  {
    icon: PieChart,
    title: "Win By",
    highlight: "Scaling",
    description:
      "Stacks profits strategically, ensuring every trend works harder for you.",
  },
  {
    icon: CheckCircle,
    title: "Calculated",
    highlight: "Moves",
    description:
      "Monitors risk in real-time, ensuring your trades always stay under control.",
  },
  {
    icon: TrendingUp,
    title: "Exiting at the",
    highlight: "Peak",
    description:
      "Tracks trailing stops and profit targets with AI precision for perfect exits.",
  },
];

const TheBrain = () => {
  return (
    <section id="how-it-works" className="relative bg-black text-white py-20 px-0 sm:px-6 overflow-hidden">
      <div className="container mx-auto max-w-full">
        {/* DESKTOP GRID */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#2a2d2d] rounded-[36px] overflow-hidden">
          {/* Left Title Panel */}
          <div className="bg-[#151818] border-r border-b border-[#2a2d2d] flex flex-col justify-center items-start px-10 py-20 rounded-tl-[36px]">
            <h2 className="text-6xl font-light leading-tight">
              The
              <br />
              <span className="text-[#80ee64] font-normal">Brain</span>
            </h2>
          </div>

          {/* Top Row */}
          {features.slice(0, 3).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-[#101210] border-r border-b border-[#2a2d2d] p-10 flex flex-col justify-start"
              >
                <Icon className="w-8 h-8 text-[#80ee64] mb-20" />
                <h3 className="text-2xl font-light mb-4">
                  {feature.title}{" "}
                  <span className="text-[#80ee64] font-normal">
                    {feature.highlight}
                  </span>
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}

          {/* Bottom Row */}
          {features.slice(3).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-[#101210] border-r border-t border-[#2a2d2d] p-10 flex flex-col justify-start ${
                  index === features.slice(3).length - 1
                    ? "border-r-0 rounded-br-[36px]"
                    : ""
                }`}
              >
                <Icon className="w-8 h-8 text-[#80ee64] mb-20" />
                <h3 className="text-2xl font-light mb-4">
                  {feature.title}{" "}
                  <span className="text-[#80ee64] font-normal">
                    {feature.highlight}
                  </span>
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* MOBILE SLIDER */}
        <div className="md:hidden">
          <div
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Left Title Box */}
            <div className="min-w-[18rem] bg-[#151818] rounded-2xl flex flex-col justify-center items-start px-8 py-20 snap-center flex-shrink-0">
              <h2 className="text-5xl font-light leading-tight">
                The
                <br />
                <span className="text-[#80ee64] font-normal">Brain</span>
              </h2>
            </div>

            {/* Slider Cards */}
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="max-w-[20rem] bg-[#101210] border border-[#2a2d2d] rounded-2xl p-8 flex flex-col justify-start snap-center flex-shrink-0"
                >
                  <Icon className="w-7 h-7 text-[#80ee64] mb-10" />
                  <h3 className="text-2xl font-light mb-4">
                    {feature.title}{" "}
                    <span className="text-[#80ee64] font-normal">
                      {feature.highlight}
                    </span>
                  </h3>
                  <p className="text-gray-400 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Hide Scrollbar */}
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default TheBrain;
