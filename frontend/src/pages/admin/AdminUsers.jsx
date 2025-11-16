import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Users, UserCheck, Crown } from "lucide-react";

const AdminUsers = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [page, setPage] = useState(1);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/users`;

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}?search=${searchTerm}&role=${filterRole}&page=${page}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!data.success) {
        toast({
          title: "Error",
          description: data.message || "Failed to load users",
          variant: "destructive",
        });
        return;
      }

      setUsers(data.users);
      setTotalUsers(data.total);
      setActiveUsers(data.users.filter((u) => u.totalDeposited > 0).length);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Cannot load users",
        variant: "destructive",
      });
    }
  };

  // Fetch users on search, role filter, or page change
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterRole, page]);

  /** Role Badge UI */
  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-red-500/10 text-red-400 border-red-500/20",
      user: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      vip: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };

    const icons = {
      admin: <Crown className="w-3 h-3" />,
      vip: <Crown className="w-3 h-3" />,
      user: null,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
          styles[role.toLowerCase()]
        }`}
      >
        {icons[role.toLowerCase()]}
        {role}
      </span>
    );
  };

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-[#80ee64]",
      bgColor: "bg-[#80ee64]/10",
      subtitle: "Registered users",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      subtitle: "Users with deposits",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Manage Users
          </h1>
          <p className="text-sm text-gray-400">
            View and manage all registered users
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#0F1014] border border-white/5 rounded-xl p-4 sm:p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm text-gray-400 font-medium">
                  {stat.title}
                </h3>
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`}
                  />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="bg-[#0F1014] border border-white/5 rounded-xl p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="w-full bg-[#1A1B1F] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm"
              />
            </div>

            {/* Role */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterRole}
                onChange={(e) => {
                  setPage(1);
                  setFilterRole(e.target.value);
                }}
                className="bg-[#1A1B1F] border border-white/5 rounded-lg px-4 py-2.5 text-white text-sm cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="user">User</option>
                <option value="vip">VIP</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0F1014] border border-white/5 rounded-xl overflow-hidden"
        >
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1A1B1F] border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Deposited
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Withdrawn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.03 }}
                    className="hover:bg-white/5"
                  >
                    <td className="px-6 py-4 text-white">{user.name}</td>
                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-[#80ee64] font-semibold">
                      ${user.totalDeposited.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-orange-400 font-semibold">
                      ${user.totalWithdrawn.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                No users found for given criteria.
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#1A1B1F] border border-white/5 rounded-lg text-white disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-400 text-sm">
            Page {page}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < 20}
            className="px-4 py-2 bg-[#1A1B1F] border border-white/5 rounded-lg text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
