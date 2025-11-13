
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Specifications from '@/components/Specifications';
import InvestmentPlans from '@/components/InvestmentPlans';
import HowItWorks from '@/components/HowItWorks';
import AffiliateProgram from '@/components/AffiliateProgram';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';
import AffiliateSection from '@/components/AffiliateSection';

function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Impulse Edge - Trade Smarter with AI-Powered Crypto Trading</title>
        <meta name="description" content="Automated crypto trading powered by real-time market learning. Invest in AI-driven trading strategies with proven ROI and backtested performance." />
      </Helmet>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Header />
        <Hero />
        <InvestmentPlans />
        <HowItWorks />
        <AffiliateProgram />
        <AffiliateSection />

        <Benefits />
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
