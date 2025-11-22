import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, List, TrendingUp, LogOut, User, Menu, UserMinus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Transactions', href: '/admin/transactions', icon: List },
  { name: 'Plans', href: '/admin/plans', icon: TrendingUp },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#181A20] text-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Sidebar */}
        <aside className="flex flex-col w-72 bg-[#181A20]">
          {/* Logo/Header */}
          <div className="p-6">
            <Link to="/admin/dashboard" className="flex items-center gap-2 group">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 transition-transform duration-300 group-hover:scale-105"
              >
                {/* Lightning bolt */}
                <path
                  d="M 55 10 L 30 55 L 50 55 L 45 90 L 75 40 L 53 40 Z"
                  fill="#80ee64"
                  className="drop-shadow-lg group-hover:brightness-110"
                />
              </svg>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight">
                  Impulse<span className="text-[#80ee64]">Edge</span>
                </span>
                <span className="text-xs text-gray-400">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Admin Profile */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 p-3 bg-[#0F1014] rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#80ee64]/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-[#80ee64]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{currentUser?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{currentUser?.email || 'admin@novatrade.ai'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2 p-4 flex-grow overflow-y-auto">
            {adminNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-[#80ee64]/10 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#80ee64]' : ''}`} />
                    <span className="font-medium text-base">{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4">
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-[#181A20]">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Top Header */}
        <header className="bg-[#181A20] px-4 fixed top-0 left-0 right-0 z-40 border-b border-white/5" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <div className="flex items-center justify-between h-14">
            <Link to="/admin/dashboard" className="flex items-center gap-1.5 flex-shrink-0 group">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 transition-transform duration-300 group-hover:scale-105"
              >
                {/* Lightning bolt */}
                <path
                  d="M 55 10 L 30 55 L 50 55 L 45 90 L 75 40 L 53 40 Z"
                  fill="#80ee64"
                  className="drop-shadow-lg group-hover:brightness-110"
                />
              </svg>
              <span className="text-lg font-bold text-white tracking-tight">
                Impulse<span className="text-[#80ee64]">Edge</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg active:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="bg-[#181A20] min-h-screen" style={{ 
          paddingTop: 'calc(3.5rem + env(safe-area-inset-top))', 
          paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' 
        }}>
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-[#181A20] border-t border-white/5 z-50"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex justify-around items-center px-2 h-16">
            {adminNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className="flex-1 flex items-center justify-center py-2 max-w-[80px] min-h-[48px]"
                >
                  <div
                    className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                      isActive ? 'text-[#80ee64]' : 'text-gray-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-medium text-[11px] leading-tight">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
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
                className="fixed inset-0 bg-black/60 z-[60]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              />

              {/* Bottom Sheet Menu */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-[#0F1014] rounded-t-3xl z-[70] border-t border-white/10 overflow-hidden"
                style={{ 
                  maxHeight: '85vh',
                  paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
                }}
              >
                {/* Handle Bar */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-gray-600 rounded-full" />
                </div>

                {/* Menu Content */}
                <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 3rem)' }}>
                  {/* Profile Section */}
                  <div className="flex items-center gap-4 p-4 bg-[#181A20] border border-white/5 rounded-2xl mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#80ee64]/10 border-2 border-[#80ee64]/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-7 h-7 text-[#80ee64]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white truncate">{currentUser?.name || 'Admin'}</p>
                      <p className="text-sm text-gray-400 truncate">{currentUser?.email || 'admin@novatrade.ai'}</p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-red-500/10 active:bg-red-500/25 text-red-400 border border-red-500/20 transition-all min-h-[56px]"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold text-base">Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminLayout;