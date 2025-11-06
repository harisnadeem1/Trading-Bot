
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, Users, List, TrendingUp, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900/50 border-r border-blue-500/20 p-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-400 p-4 glow-blue">
          <Shield />
          <span>Admin Panel</span>
        </div>
         <div className="p-4 text-center">
            <p className="text-lg font-semibold">{currentUser?.name}</p>
            <p className="text-xs text-gray-400">{currentUser?.email}</p>
        </div>
        <nav className="flex flex-col mt-4 space-y-2 flex-grow">
          {adminNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href}>
                <motion.div
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 relative ${
                    isActive ? 'bg-blue-500/10 text-blue-300' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  {isActive && <motion.div layoutId="active-pill-admin" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-full" />}
                  <Icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : ''}`} />
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

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

       {/* Mobile Admin Nav is not implemented for simplicity, but could be added */}
    </div>
  );
};

export default AdminLayout;
