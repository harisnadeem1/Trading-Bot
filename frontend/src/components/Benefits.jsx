import React from 'react';
import { Check, Lightbulb } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: 'Profitable Backtested Strategy',
      description: 'Rigorously validate over 10+ years of price history across various currencies, ensuring a proven and reliable approach.',
    },
    {
      title: 'Early Trend Detection',
      description: 'Initiate breakouts swiftly as momentum accelerates, positioning traders to capitalize on emerging trends',
    },
    {
      title: 'Adaptable Trading',
      description: 'Dynamic algorithms react promptly to changing market conditions, providing adaptability in the face of evolving trends.',
    },
    {
      title: 'Diversified Strategies',
      description: 'Breakout approach diversifies volatility risk across EURUSD pairs, optimizing portfolio resilience.',
    },
    {
      title: 'Risk Calibration',
      description: 'Tight control over position sizing, momentum, and stops, empowering traders to manage risk efficiently.',
    },
    {
      title: 'Hands-Free Automation',
      description: 'We automate so much, it feels like cheating. But hey, why not make life easier?',
    },
    {
      title: 'Round-the-clock Operation',
      description: 'Markets dont sleep, and neither do we. Every opportunity is ours before you even wake up.',
    },
  ];

  return (
     <div id='benefits' className="relative min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* ✅ Elliptical Glow Background Image */}
      <div
        className="
          absolute 
          inset-0 
          flex 
          items-start sm:items-center 
          justify-center 
          mt-[-270px] sm:mt-0
        "
        aria-hidden="true"
      >
        {/* First ellipse */}
        <img
          src="/home/hero/Green_Ellipse.svg"
          alt=""
          className="w-[900px] h-[900px] sm:w-full sm:h-full opacity-40 blur-3xl object-contain pointer-events-none select-none"
        />
        {/* Second ellipse (stronger layer) */}
        <img
          src="/home/hero/Green_Ellipse.svg"
          alt=""
          className="absolute w-[850px] h-[850px] sm:w-[90%] sm:h-[90%] opacity-50 blur-2xl object-contain pointer-events-none select-none"
        />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Benefits Section - Scrollable */}
          <div className="lg:pr-8">
            <h2 className="text-4xl sm:text-4xl lg:text-4xl font-light mb-6 lg:mb-8 text-[#80ee64]">
              Benefits
            </h2>
            <p className="text-[#ddffdc99] text-sm sm:text-base mb-8 lg:mb-8 leading-relaxed">
              We've mastered the game. If you're still asking why, you're not ready. Frequencee doesn't sell promises—we deliver results while others are still talking
            </p>

            <div className="space-y-6 lg:space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="border-b border-gray-800 pb-6 lg:pb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-5 text-[#80ee64] flex-shrink-0 mt-1" />
                    <h3 className="text-xl sm:text-xl lg:text-xl font-light text-white">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-[#ddffdc99] text-sm sm:text-base leading-relaxed ml-8 sm:ml-9">

                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges Section - Sticky on Desktop */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-light mb-1 lg:mb-1">
              Challenges?
            </h2>
            <h3 className="text-3xl sm:text-4xl lg:text-4xl font-light mb-2 lg:mb-2 text-[#80ee64]">
              We Don't Have Any
            </h3>
            <p className="text-[#ddffdc99] text-sm sm:text-base mb-4 lg:mb-4 leading-relaxed">
              Our only 'challenge'? Helping you keep up with the wins. Well, there's one more... but scared money makes no money
            </p>

            <div className="rounded-2xl p-6 sm:p-8 lg:p-6 bg-[#212525]">

              <div className="inline-flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-[#80ee64]" />
              </div>
              
              <h4 className="text-2xl sm:text-2xl font-light mb-0 text-white">
                Drawdowns
              </h4>
              <h5 className="text-xl sm:text-2xl font-light mb-4 sm:mb-2 text-[#80ee64]">
                The Price of Playing to Win
              </h5>
              
              <p className="text-[#ddffdc99] text-sm sm:text-base leading-relaxed">
                Losing streaks happen, but they're the cost of bold strategies that yield bigger returns. With Frequencee, even the losses are calculated risks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;