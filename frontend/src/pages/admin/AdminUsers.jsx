import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Filter, 
  Users, 
  UserCheck, 
  Crown,
  Lock,
  Unlock,
  UserMinus,
  UserPlus,
  Shield
} from "lucide-react";

const AdminUsers = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [excludedUsers, setExcludedUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lockedUsers, setLockedUsers] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("user");
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  /** Fetch excluded user IDs */
  const fetchExcludedUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/excluded-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExcludedUsers(data.userIds || []);
    } catch (err) {
      console.error(err);
    }
  };

  /** Fetch users with filters */
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${API_URL}/admin/users?search=${searchTerm}&role=${filterRole}&page=${page}&limit=20`,
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

      // Filter out admins if role is 'user'
      const filteredUsers = filterRole === "user" 
        ? data.users.filter(u => u.role === "user")
        : data.users;

      setUsers(filteredUsers);
      setTotalUsers(data.total);
      setActiveUsers(data.users.filter((u) => u.totalDeposited > 0).length);
      setLockedUsers(data.users.filter((u) => u.is_locked).length);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Cannot load users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchExcludedUsers();
    fetchUsers();
  }, [searchTerm, filterRole, page]);

  /** Lock User */
  const handleLock = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/lock`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast({ title: "Success", description: "User locked successfully" });
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, is_locked: true } : u))
        );
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to lock user",
        variant: "destructive",
      });
    }
  };

  /** Unlock User */
  const handleUnlock = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/unlock`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast({ title: "Success", description: "User unlocked successfully" });
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, is_locked: false } : u))
        );
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to unlock user",
        variant: "destructive",
      });
    }
  };

  /** Add user to exclude list */
  const handleAddToExcluded = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/excluded-users/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "User excluded from analytics",
        });
        fetchExcludedUsers();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to exclude user",
        variant: "destructive",
      });
    }
  };

  /** Remove user from exclude list */
  const handleRemoveFromExcluded = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/excluded-users/remove/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "User included in analytics",
        });
        fetchExcludedUsers();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to include user",
        variant: "destructive",
      });
    }
  };

  const isExcluded = (uid) => excludedUsers.includes(uid);

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
          styles[role?.toLowerCase()] || styles.user
        }`}
      >
        {icons[role?.toLowerCase()]}
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
      subtitle: "Registered",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      subtitle: "With deposits",
    },
    {
      title: "Locked Users",
      value: lockedUsers,
      icon: Lock,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      subtitle: "Account locked",
    },
    {
      title: "Excluded",
      value: excludedUsers.length,
      icon: Shield,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      subtitle: "From analytics",
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
            User Management
          </h1>
          <p className="text-sm text-gray-400">
            View and manage all registered users
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#0F1014] border border-white/5 rounded-xl p-3 sm:p-4 lg:p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-xs text-gray-400 font-medium">
                  {stat.title}
                </h3>
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 ${stat.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center`}
                >
                  <stat.icon
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color}`}
                  />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="bg-[#0F1014] border border-white/5 rounded-xl p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                className="w-full bg-[#1A1B1F] border border-white/5 rounded-lg pl-10 pr-4 py-2 sm:py-2.5 text-white text-sm placeholder:text-gray-500 focus:border-white/10 focus:outline-none transition"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={filterRole}
                onChange={(e) => {
                  setPage(1);
                  setFilterRole(e.target.value);
                }}
                className="w-full sm:w-auto bg-[#1A1B1F] border border-white/5 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm cursor-pointer focus:border-white/10 focus:outline-none transition"
              >
                <option value="user">Users Only</option>
                <option value="All">All Roles</option>
                <option value="vip">VIP</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table - Desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:block bg-[#0F1014] border border-white/5 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-[#1A1B1F] border-b border-white/5">
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Deposited
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
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
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-white font-medium">
                      {user.name}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-sm">
                      {user.email}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-sm">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-[#80ee64] font-semibold">
                      ${user.totalDeposited?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3.5">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1.5">
                        {user.is_locked && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
                            <Lock className="w-3 h-3" />
                            Locked
                          </span>
                        )}
                        {isExcluded(user.id) && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 w-fit">
                            <Shield className="w-3 h-3" />
                            Excluded
                          </span>
                        )}
                        {!user.is_locked && !isExcluded(user.id) && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-green-500/10 text-green-400 border border-green-500/20 w-fit">
                            <Unlock className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {/* Lock/Unlock Button */}
                        {user.is_locked ? (
                          <button
                            onClick={() => handleUnlock(user.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors border border-green-500/20"
                            title="Unlock user"
                          >
                            <Unlock className="w-3 h-3" />
                            Unlock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLock(user.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                            title="Lock user"
                          >
                            <Lock className="w-3 h-3" />
                            Lock
                          </button>
                        )}

                        {/* Exclude/Include Button */}
                        {isExcluded(user.id) ? (
                          <button
                            onClick={() => handleRemoveFromExcluded(user.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                            title="Include in analytics"
                          >
                            <UserPlus className="w-3 h-3" />
                            Include
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToExcluded(user.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors border border-orange-500/20"
                            title="Exclude from analytics"
                          >
                            <UserMinus className="w-3 h-3" />
                            Exclude
                          </button>
                        )}
                      </div>
                    </td>
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

        {/* Users Cards - Mobile & Tablet */}
        <div className="lg:hidden space-y-3">
          {users.length === 0 ? (
            <div className="bg-[#0F1014] border border-white/5 rounded-xl p-8 sm:p-12 text-center">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                No users found for given criteria.
              </p>
            </div>
          ) : (
            users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-[#0F1014] border border-white/5 rounded-xl p-3 sm:p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold mb-1 truncate">
                      {user.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm break-all line-clamp-1">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex-shrink-0">{getRoleBadge(user.role)}</div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {user.is_locked && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                  {isExcluded(user.id) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <Shield className="w-3 h-3" />
                      Excluded
                    </span>
                  )}
                  {!user.is_locked && !isExcluded(user.id) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                      <Unlock className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Deposited</p>
                    <p className="text-[#80ee64] font-semibold text-sm sm:text-base">
                      ${user.totalDeposited?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Joined</p>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 sm:pt-3 border-t border-white/5 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {user.is_locked ? (
                      <button
                        onClick={() => handleUnlock(user.id)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors border border-green-500/20 font-medium"
                      >
                        <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Unlock User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLock(user.id)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 font-medium"
                      >
                        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Lock User
                      </button>
                    )}

                    {isExcluded(user.id) ? (
                      <button
                        onClick={() => handleRemoveFromExcluded(user.id)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20 font-medium"
                      >
                        <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Include
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToExcluded(user.id)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors border border-orange-500/20 font-medium"
                      >
                        <UserMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Exclude
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-3 sm:py-4 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 sm:px-4 py-2 bg-[#1A1B1F] border border-white/5 rounded-lg text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1A1B1F]/80 hover:border-white/10 transition-all active:scale-95"
          >
            Previous
          </button>

          <span className="text-gray-400 text-xs sm:text-sm font-medium">
            Page {page}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < 20}
            className="px-3 sm:px-4 py-2 bg-[#1A1B1F] border border-white/5 rounded-lg text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1A1B1F]/80 hover:border-white/10 transition-all active:scale-95"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;