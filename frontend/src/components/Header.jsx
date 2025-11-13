import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn } from 'lucide-react';
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
    { name: 'Home', href: '/' },
    { name: 'Investment Plans', href: '/#investment-plans' },
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Affiliate', href: '/#affiliate' },

    { name: 'Benefits', href: '/#benefits' },

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
              <Button
                onClick={() => openAuthModal('signup')}
                className="bg-[#80ee64] hover:bg-[#70de54] text-black font-semibold rounded-full px-4 h-9 text-sm shadow-lg shadow-[#80ee64]/20 transition-all duration-300"
              >
                Sign Up
              </Button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Improved Design */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden absolute top-20 sm:top-22 left-2 right-2 sm:left-4 sm:right-4 bg-[#212525] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden"
            >
              <nav className="flex flex-col p-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-white hover:bg-white/10 text-[15px] py-3.5 px-4 rounded-xl transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Only show login option if not authenticated */}
                {!isAuthenticated && (
                  <>
                    <div className="h-px bg-gray-800 my-2 mx-2" />

                    <button
                      onClick={() => { openAuthModal('login'); setIsOpen(false); }}
                      className="text-white hover:bg-white/10 text-[15px] py-3.5 px-4 rounded-xl transition-all duration-200 text-left flex items-center gap-2"
                    >
                      <LogIn size={18} />
                      Login
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;