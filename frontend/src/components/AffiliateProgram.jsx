import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Advanced",
    highlight: "Grid Trading",
    points: ["Detects momentum", "Locks profits", "Always on autopilot"],
    image: "/home/features/1.svg",
  },
  {
    title: "Decade of",
    highlight: "Backtesting",
    points: ["10+ years of backtesting", "No excuses", "Proven performance"],
    image: "/home/features/2.svg",
  },
  {
    title: "Scale Big,",
    highlight: "Safely",
    points: ["Targets trends", "Scales smart", "Bulletproof protection"],
    image: "/home/features/3.svg",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="relative bg-black text-white py-5 px-0 sm:px-0 overflow-hidden">
      <div className="container mx-auto max-w-full relative">
        {/* 3-column layout with shortened divider lines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 relative">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col justify-between px-4 lg:px-12 relative"
            >
              {/* Title */}
              <h3 className="text-2xl md:text-2xl font-light leading-tight mb-5 md:mb-8">
                {feature.title}{" "}
                <span className="text-[#80ee64] font-normal">
                  {feature.highlight}
                </span>
              </h3>

              {/* Bullet Points */}
              <ul className="space-y-2 mb-8">
                {feature.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-[#80ee64] flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-black"></span>
                    </span>
                    <span className="text-gray-200 text-base font-light">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Image */}
              <div className="relative mt-auto h-[180px] sm:h-[200px]">
                <img
                  src={feature.image}
                  alt={`${feature.title} ${feature.highlight}`}
                  className="w-[100%] sm:w-[80%] h-auto object-contain"
                />
              </div>

              {/* Shorter Divider Line */}
              {index < features.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-16 bottom-16 w-px bg-[#637260]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
