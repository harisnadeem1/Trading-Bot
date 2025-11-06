import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Shield, TrendingUp, Settings } from 'lucide-react';

const specs = [
  { name: 'Speed of Execution', value: 95, icon: Zap },
  { name: 'Market Adaptability', value: 92, icon: Target },
  { name: 'Risk Mitigation', value: 88, icon: Shield },
  { name: 'Profit Consistency', value: 90, icon: TrendingUp },
  { name: 'Customization Options', value: 85, icon: Settings },
];

const Specifications = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-green-950/10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI <span className="text-green-400 glow-green">Specifications</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our trading bot is engineered for peak performance across all critical metrics
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={spec.name}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 card-glow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Icon className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-lg font-semibold">{spec.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{spec.value}%</span>
                </div>
                <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${spec.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                    style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Specifications;