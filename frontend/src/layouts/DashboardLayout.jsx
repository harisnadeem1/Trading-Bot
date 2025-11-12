import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Users, Home, LogOut, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const sidebarNavItems = [
  { name: 'Dashboard', href: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Investment', href: '/dashboard/investment', icon: TrendingUp },
  { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownToLine },
  { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpFromLine },
  { name: 'Affiliate', href: '/dashboard/affiliate', icon: Users },
];

const mobileNavItems = [
  { name: 'Investment', href: '/dashboard/investment', icon: TrendingUp },
  { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownToLine },
  { name: 'Home', href: '/dashboard/overview', icon: Home },
  { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpFromLine },
  { name: 'Affiliate', href: '/dashboard/affiliate', icon: Users },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log("currentUser:", currentUser);

  return (
    <div className="min-h-screen bg-[#181A20] text-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Sidebar */}
        <aside className="flex flex-col w-72 bg-[#181A20]">
          {/* Logo */}
          <div className="p-6">
            <Link to="/">
              <h1 className="text-2xl font-bold text-green-400 glow-green">NovaTrade AI</h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-3 p-4 flex-grow overflow-y-auto">
            {sidebarNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-white/5 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-base">{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area with Top Header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-[#181A20] px-6 py-4">
            <div className="flex items-center justify-end">
              {/* Right side - Profile and Actions */}
              <div className="flex items-center gap-3">
                {/* Profile Card */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0F1014] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                  <div className="w-9 h-9 rounded-full bg-[#80ee64]/10 border border-[#80ee64]/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#80ee64]" />
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-sm font-medium text-white">{currentUser?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-400">{currentUser?.email || 'user@example.com'}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium text-sm">Logout</span>
                </motion.button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-[#181A20]">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Top Header */}
        <header className="bg-[#181A20] px-4 py-4 fixed top-0 left-0 right-0 z-40">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-xl font-bold text-green-400 glow-green">NovaTrade AI</h1>
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-7 h-7 text-gray-400" />
            </motion.button>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="pt-16 pb-20 bg-[#181A20] min-h-screen">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#181A20] border-t border-white/5 backdrop-blur-xl flex justify-around p-2 z-50">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href} className="flex flex-col items-center justify-center text-xs w-16 h-16">
                <motion.div
                  className={`relative flex flex-col items-center gap-1 transition-colors duration-300 ${
                    isActive ? 'text-green-400' : 'text-gray-500'
                  }`}
                  animate={{ y: isActive ? -3 : 0 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium" style={{ fontSize: '12px' }}>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-dot"
                      className="absolute -bottom-2 w-1 h-1 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />

              {/* Bottom Sheet Menu */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-[#0F1014] rounded-t-3xl z-[70] border-t border-white/10"
              >
                {/* Handle Bar */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-gray-600 rounded-full" />
                </div>

                {/* Menu Content */}
                <div className="px-4 pb-8">
                  {/* Profile Section */}
                  <div className="flex items-center gap-4 p-4 bg-[#181A20] border border-white/5 rounded-2xl mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#80ee64]/10 border-2 border-[#80ee64]/20 flex items-center justify-center">
                      <User className="w-7 h-7 text-[#80ee64]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-white">{currentUser?.full_name || 'User'}</p>
                      <p className="text-sm text-gray-400">{currentUser?.email || 'user@example.com'}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-medium text-gray-500 px-3 mb-2">ACCOUNT</div>
                    
                    
                  </div>

                  {/* Logout Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold text-base">Logout</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;