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
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openAuth) {
      openAuthModal(location.state.openAuth);
    }
  }, [location, openAuthModal]);
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Investment Plans', href: '/#investment-plans' },
    { name: 'Affiliate', href: '/#affiliate-program' },
    { name: 'Contact', href: '/contact' },
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
    } else if (href === '/'){
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
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <svg 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 sm:w-10 sm:h-10"
              >
                {/* Outer glow circle */}
                <circle cx="50" cy="50" r="48" fill="url(#glow)" opacity="0.2"/>
                
                {/* Main circle background */}
                <circle cx="50" cy="50" r="40" fill="url(#mainGradient)"/>
                
                {/* Neural network nodes */}
                <circle cx="35" cy="30" r="3" fill="#80ee64"/>
                <circle cx="50" cy="25" r="3" fill="#80ee64"/>
                <circle cx="65" cy="30" r="3" fill="#80ee64"/>
                <circle cx="30" cy="50" r="3" fill="#80ee64"/>
                <circle cx="70" cy="50" r="3" fill="#80ee64"/>
                <circle cx="35" cy="70" r="3" fill="#80ee64"/>
                <circle cx="50" cy="75" r="3" fill="#80ee64"/>
                <circle cx="65" cy="70" r="3" fill="#80ee64"/>
                
                {/* Connection lines */}
                <line x1="35" y1="30" x2="50" y2="25" stroke="#80ee64" strokeWidth="1" opacity="0.4"/>
                <line x1="50" y1="25" x2="65" y2="30" stroke="#80ee64" strokeWidth="1" opacity="0.4"/>
                <line x1="35" y1="30" x2="30" y2="50" stroke="#80ee64" strokeWidth="1" opacity="0.4"/>
                <line x1="65" y1="30" x2="70" y2="50" stroke="#80ee64" strokeWidth="1" opacity="0.4"/>
                <line x1="30" y1="50" x2="35" y2="70" stroke="#80ee64" strokeWidth="1" opacity="0.4"/>
                <line x1="70" y1="50" x2="65" y2="70" stroke="#80ee64" strokeWidth="1" opacity="0.4"/>
                <line x1="35" y1="70" x2="50" y2="75" stroke="#80ee64" strokeWidth="1" opacity="0.4"/>
                <line x1="50" y1="75" x2="65" y2="70" stroke="#80ee64" strokeWidth="1" opacity="0.4"/>
                <line x1="50" y1="25" x2="50" y2="75" stroke="#80ee64" strokeWidth="1" opacity="0.3"/>
                
                {/* Center AI symbol - stylized "N" with upward arrow */}
                <path 
                  d="M 42 45 L 42 55 L 46 50 L 46 55 M 54 55 L 54 45 L 50 50 L 50 45 M 48 40 L 50 35 L 52 40" 
                  stroke="#80ee64" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
                
                {/* Gradients */}
                <defs>
                  <radialGradient id="glow">
                    <stop offset="0%" stopColor="#80ee64" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#80ee64" stopOpacity="0"/>
                  </radialGradient>
                  <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a4d2e"/>
                    <stop offset="100%" stopColor="#0f2818"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-base sm:text-xl font-bold text-white hidden sm:block">NovaTrade AI</span>
              <span className="text-base font-bold text-white sm:hidden">Nova</span>
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
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="bg-[#80ee64] hover:bg-[#70de54] text-black font-semibold rounded-full px-8 h-12 text-[15px] shadow-lg shadow-[#80ee64]/20 hover:shadow-[#80ee64]/30 transition-all duration-300">
                    Sign Up
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