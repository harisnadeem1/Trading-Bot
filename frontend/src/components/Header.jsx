import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn , Home, BadgeDollarSign, Rocket, Users, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';



const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const isLoggedIn = isAuthenticated(); // ✅ Call the function to get actual boolean
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openAuth) {
      openAuthModal(location.state.openAuth);
    }
  }, [location, openAuthModal]);

  const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Investment Plans", href: "/#investment-plans", icon: BadgeDollarSign },
  { name: "How it Works", href: "/#how-it-works", icon: Rocket },
  { name: "Affiliate", href: "/#affiliate", icon: Users },
  { name: "Benefits", href: "/#benefits", icon: Sparkles }
];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = href.substring(2);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
      setIsOpen(false);
    } else if (href === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-2 sm:px-4">
      <motion.header
        className="w-[95%] rounded-full transition-all duration-300 shadow-lg"
        animate={{
          backgroundColor: scrolled ? 'rgba(33, 37, 37, 0.95)' : 'rgba(33, 37, 37, 0.7)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(34, 197, 94, 0.15)'
            : '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-0 flex-shrink-0 group">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105"
              >
                {/* Lightning bolt */}
                <path
                  d="M 55 10 L 30 55 L 50 55 L 45 90 L 75 40 L 53 40 Z"
                  fill="#80ee64"
                  className="drop-shadow-lg group-hover:brightness-110"
                />
              </svg>

              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-2xl font-bold text-white tracking-tight hidden sm:inline">
                  Impulse<span className="text-[#80ee64]">Edge</span>
                </span>
                <span className="text-2xl font-bold text-white tracking-tight sm:hidden">
                  Impulse<span className="text-[#80ee64]">Edge</span>
                </span>
              </div>
            </Link>

            {/* Divider - Desktop Only */}
            <div className="hidden lg:block h-10 w-[2px] bg-gradient-to-b from-transparent via-gray-400 to-transparent mx-6 opacity-60" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-[15px] text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-6">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button className="bg-[#80ee64] hover:bg-[#70de54] text-black font-semibold rounded-full px-8 h-12 text-[15px] shadow-lg shadow-[#80ee64]/20 hover:shadow-[#80ee64]/30 transition-all duration-300">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => openAuthModal('signup')}
                  className="bg-[#80ee64] hover:bg-[#70de54] text-black font-semibold px-8 h-12 text-[15px] rounded-full shadow-lg shadow-[#80ee64]/20 hover:shadow-[#80ee64]/30 transition-all duration-300"
                >
                  Sign Up
                </Button>
              )}
            </div>

            {/* Mobile Right Side - Signup + Menu */}
            <div className="md:hidden flex items-center gap-2">
              {/* <Button
                onClick={() => openAuthModal('signup')}
                className="bg-[#80ee64] hover:bg-[#70de54] text-black font-semibold rounded-full px-4 h-9 text-sm shadow-lg shadow-[#80ee64]/20 transition-all duration-300"
              >
                Sign Up
              </Button> */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={30} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Improved Design */}
     {/* Mobile Menu - Bottom Sheet Style */}
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={() => setIsOpen(false)}
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-[#212525] rounded-t-3xl z-[70] border-t border-white/10 pb-10"
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        <nav className="flex flex-col px-4 mt-2 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="flex items-center gap-3 text-white py-3 px-2 text-[16px] rounded-xl"
              >
                <Icon size={20} className="text-green-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}

        
          

          {/* Sign Up Button */}
          <button
            onClick={() => {
              openAuthModal("signup");
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 
                       rounded-xl bg-[#80ee64] hover:bg-[#70de54] 
                       text-black font-semibold text-[16px]
                       transition-all shadow-lg shadow-[#80ee64]/20 mt-1"
          >
            <LogIn size={18} className="text-black" />
            Sign Up
          </button>
        </nav>
      </motion.div>
    </>
  )}
</AnimatePresence>


    </div>
  );
};

export default Header;