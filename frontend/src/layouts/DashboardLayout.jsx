
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Users, Home, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

const sidebarNavItems = [
  { name: 'Dashboard', href: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Investment', href: '/dashboard/investment', icon: TrendingUp },
  { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownToLine },
  { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpFromLine },
  { name: 'Affiliate', href: '/dashboard/affiliate', icon: Users },
];

const mobileNavItems = [
    { name: 'Home', href: '/dashboard/overview', icon: Home },
    { name: 'Investment', href: '/dashboard/investment', icon: TrendingUp },
    { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownToLine },
    { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpFromLine },
    { name: 'Affiliate', href: '/dashboard/affiliate', icon: Users },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const currentUser = useAuthStore((state) => state.currentUser);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900/50 border-r border-green-500/20 p-4">
        <Link to="/" className="text-2xl font-bold text-green-400 p-4 glow-green">NovaTrade AI</Link>
        <div className="p-4 text-center">
            <p className="text-lg font-semibold">{currentUser?.name}</p>
            <p className="text-xs text-gray-400">{currentUser?.email}</p>
        </div>
        <nav className="flex flex-col mt-4 space-y-2 flex-grow">
          {sidebarNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href}>
                <motion.div
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 relative ${
                    isActive ? 'bg-green-500/10 text-green-300' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  {isActive && <motion.div layoutId="active-pill-user" className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-r-full" />}
                  <Icon className={`w-6 h-6 ${isActive ? 'text-green-400' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-4 p-3 text-gray-400 hover:bg-red-500/20 hover:text-red-400">
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Logout</span>
        </Button>
      </aside>

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-green-500/20 flex justify-around p-2 z-50">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.name} to={item.href} className="flex flex-col items-center justify-center text-xs w-16 h-14">
              <motion.div
                className={`relative flex flex-col items-center gap-1 transition-colors duration-300 ${
                  isActive ? 'text-green-400' : 'text-gray-500'
                }`}
                animate={{ y: isActive ? -5 : 0 }}
              >
                <Icon className="w-6 h-6" />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="mobile-active-dot" 
                    className="absolute -bottom-2 w-1.5 h-1.5 bg-green-400 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
         <button onClick={handleLogout} className="flex flex-col items-center justify-center text-xs w-16 h-14 text-gray-500">
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardLayout;
