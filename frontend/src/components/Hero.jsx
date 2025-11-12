import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const Hero = () => {
  const { isAuthenticated, openAuthModal } = useAuthStore();

  return (
    <section
      id="home"
      className="
        relative min-h-screen flex items-center justify-center overflow-hidden px-0 bg-black
        pt-16 pb-12 md:pt-24 md:pb-16
      "
    >
      {/* Background Ellipse */}
      <div
        className="
          absolute pointer-events-none z-20 opacity-35 transition-all duration-700
          w-[850px] h-[850px] sm:w-[950px] sm:h-[950px] md:w-[1300px] md:h-[1300px]
          top-[-5%] left-1/2 -translate-x-1/2
          md:top-1/2 md:left-1/2 md:-translate-y-1/2
        "
      >
        <img
          src='/home/hero/Green_Ellipse.svg'
          alt=''
          className='w-full h-full object-contain'
        />
      </div>

      {/* Main Content */}
      <div className='relative z-10 container mx-auto flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-16'>

        {/* Left: Video */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='lg:w-1/2 flex justify-center lg:justify-start relative z-0'
        >
          <div
            className='
              relative 
              w-[420px] h-[420px]
              sm:w-[500px] sm:h-[500px]
              md:w-[620px] md:h-[620px]
              lg:w-[680px] lg:h-[680px]
            '
          >
            <div className='w-full h-full rounded-2xl overflow-hidden bg-transparent'>
              <video
                autoPlay
                loop
                muted
                playsInline
                className='
                  w-full h-full bg-transparent mix-blend-screen
                  object-cover md:object-contain
                '
              >
                <source src='/home/hero/box.mp4' type='video/mp4' />
              </video>
            </div>
          </div>
        </motion.div>

        {/* Right: Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='lg:w-1/2 text-center lg:text-left px-0'
        >
          <h1
            className="
    text-[2rem] md:text-6xl lg:text-7xl
    font-light tracking-tight mb-0 md:mb-4 leading-tight z-30
  "
          >
            <span className="text-white font-light">Frequencee</span>
          </h1>

          <h2
            className="
    text-[2rem] md:text-5xl lg:text-6xl
    font-light tracking-tight mb-4 md:mb-6 leading-tight
  "
          >
            <span className="text-[#80ee64]">AI Trading Bot</span>
          </h2>

          <p
            className="
    text-base md:text-lg 
    text-[#ddffdc99] 
    max-w-xl mx-auto lg:mx-0 mb-6
  "
          >
            Why trade the hard way when this bot makes winning effortless?
          </p>


          {/* Specifications */}
          <div className="bg-[#212525] border border-[#2a2d2d] rounded-2xl p-6 mb-8 max-w-xl mx-auto lg:mx-0 relative z-30">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#80ee64] animate-pulse"></div>
              <h3 className="text-white text-lg font-medium">Specifications</h3>
            </div>

            <div className="space-y-6">
              {[
                ['Speed of Execution', 90],
                ['Market Adaptability', 64],
                ['Risk Mitigation', 70],
                ['Profit Consistency', 83],
                ['Customization Options', 51],
              ].map(([label, percent]) => (
                <div key={label}>
                  {/* Label Row */}
                  <div className="flex justify-between mb-2">
                    <span className="text-[#e6e6e6] text-sm">{label}</span>
                    <span className="text-white font-semibold">{percent}%</span>
                  </div>

                  {/* 6-Segment Progress Bar */}
                  <div className="flex justify-between items-center gap-[4px]">
                    {Array.from({ length: 6 }).map((_, i) => {
                      // Calculate how many segments should be filled based on percent
                      const filledSegments = Math.floor(percent / (100 / 6));
                      const isFilled = i < filledSegments;
                      const partialFill =
                        i === filledSegments && percent % (100 / 6) !== 0
                          ? ((percent % (100 / 6)) / (100 / 6)) * 100
                          : null;

                      return (
                        <div
                          key={i}
                          className="flex-1 h-[6px] bg-[#2e3232] rounded-full overflow-hidden"
                        >
                          {isFilled ? (
                            <div className="w-full h-full bg-[#80ee64]"></div>
                          ) : partialFill ? (
                            <div
                              className="h-full bg-[#80ee64]"
                              style={{ width: `${partialFill}%` }}
                            ></div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              onClick={() => {
                const section = document.getElementById("investment-plans");
                if (section) {
                  const yOffset = -100; // 👈 adjust this (-60 to -120) depending on your header height
                  const y =
                    section.getBoundingClientRect().top + window.pageYOffset + yOffset;

                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="bg-[#80ee64] hover:bg-[#70de54] text-black font-semibold px-8 h-12 rounded-full text-[15px] shadow-lg shadow-[#80ee64]/20 hover:shadow-[#80ee64]/30 transition-all duration-300"
            >
              ROI Levels
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const section = document.getElementById("how-it-works");
                if (section) {
                  const yOffset = -30; // adjust if needed
                  const y =
                    section.getBoundingClientRect().top + window.pageYOffset + yOffset;

                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-black px-8 h-12 rounded-full text-[15px] transition-all duration-300"
            >
              How It Wins
            </Button>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
