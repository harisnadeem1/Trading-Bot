
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'user@novatrade.ai', joinDate: '2025-08-15', totalDeposited: 12500, totalWithdrawn: 5200, role: 'User' },
  { id: 2, name: 'Jane Smith', email: 'another@example.com', joinDate: '2025-09-01', totalDeposited: 7800, totalWithdrawn: 1200, role: 'User' },
  { id: 3, name: 'Test User', email: 'test@example.com', joinDate: '2025-09-20', totalDeposited: 1200, totalWithdrawn: 0, role: 'User' },
  { id: 4, name: 'Pro Investor', email: 'pro@investor.com', joinDate: '2025-07-10', totalDeposited: 150000, totalWithdrawn: 75000, role: 'VIP' },
  { id: 5, name: 'Admin', email: 'admin@novatrade.ai', joinDate: '2025-06-01', totalDeposited: 0, totalWithdrawn: 0, role: 'Admin' },
];

const AdminUsers = () => {
  const { toast } = useToast();

  const handleView = (userId) => {
    toast({
      title: 'Viewing User...',
      description: `Displaying details for user ID #${userId}. (This is a placeholder.)`,
    });
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'text-red-400';
      case 'VIP': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin</title>
        <meta name="description" content="View and manage all registered users." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-blue-400 glow-blue"
        >
          Manage Users
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 border border-blue-500/20 rounded-xl overflow-hidden card-glow-blue"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/60">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Join Date</th>
                  <th className="p-4 font-semibold">Deposited</th>
                  <th className="p-4 font-semibold">Withdrawn</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-800 hover:bg-blue-500/5 transition-colors">
                    <td className="p-4 text-gray-500">{user.id}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4 text-gray-500">{user.joinDate}</td>
                    <td className="p-4 font-mono text-green-400">${user.totalDeposited.toLocaleString()}</td>
                    <td className="p-4 font-mono text-orange-400">${user.totalWithdrawn.toLocaleString()}</td>
                    <td className="p-4 font-semibold">
                      <span className={getRoleColor(user.role)}>{user.role}</span>
                    </td>
                    <td className="p-4 text-right">
                      <Button onClick={() => handleView(user.id)} size="icon" variant="ghost" className="text-gray-400 hover:text-blue-400">
                        <Eye size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminUsers;
