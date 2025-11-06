import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Radar, Layers, BarChart3 } from 'lucide-react';

const benefits = [
  {
    title: 'Backtested Strategy',
    description: 'Our algorithms are rigorously tested against historical data to ensure consistent performance',
    icon: CheckCircle2,
  },
  {
    title: 'Early Trend Detection',
    description: 'AI identifies market trends before they become obvious, giving you a competitive edge',
    icon: Radar,
  },
  {
    title: 'Adaptable Trading',
    description: 'Machine learning continuously adapts to changing market conditions in real-time',
    icon: Layers,
  },
  {
    title: 'Diversified Strategies',
    description: 'Multiple trading strategies work simultaneously to maximize returns and minimize risk',
    icon: BarChart3,
  },
];

const Benefits = () => {
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
            Why Choose <span className="text-green-400 glow-green">NovaTrade AI</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Advanced AI technology meets proven trading strategies for unmatched performance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 card-glow group"
              >
                <div className="mb-4">
                  <div className="inline-flex p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-all duration-300">
                    <Icon className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;