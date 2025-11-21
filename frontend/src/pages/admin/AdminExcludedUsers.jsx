import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Search, Users, UserMinus, UserPlus } from "lucide-react";

const AdminExcludedUsers = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [excludedUsers, setExcludedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_BASE_URL;

  /** Fetch excluded user IDs */
  const fetchExcludedUsers = async () => {
    try {
      const res = await fetch(`${API}/admin/excluded-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExcludedUsers(data.userIds || []);
    } catch (err) {
      console.error(err);
    }
  };

  /** Fetch all users */
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${API}/admin/users?search=${searchTerm}&role=user&page=${page}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExcludedUsers();
    fetchUsers();
  }, [searchTerm, page]);

  /** Add user to exclude list */
  const handleAdd = async (userId) => {
    try {
      const res = await fetch(`${API}/admin/excluded-users/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "User Excluded", description: "User added to exclude list." });
        fetchExcludedUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /** Remove user from exclude list */
  const handleRemove = async (userId) => {
    try {
      const res = await fetch(`${API}/admin/excluded-users/remove/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "User Restored", description: "User removed from exclude list." });
        fetchExcludedUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isExcluded = (uid) => excludedUsers.includes(uid);

  return (
    <>
      <Helmet>
        <title>Excluded Users - Admin</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Excluded Users
          </h1>
          <p className="text-sm text-gray-400">
            Add or remove users from admin analytics
          </p>
        </motion.div>

        {/* Search */}
        <div className="bg-[#0F1014] border border-white/5 rounded-xl p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              className="w-full bg-[#1A1B1F] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-[#0F1014] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1A1B1F] border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.04 }}
                  className="hover:bg-white/5"
                >
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    {isExcluded(user.id) ? (
                      <button
                        onClick={() => handleRemove(user.id)}
                        className="text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                      >
                        <UserMinus className="w-4 h-4" />
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdd(user.id)}
                        className="text-[#80ee64] bg-[#80ee64]/10 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No users found.</p>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0F1014] border border-white/5 rounded-xl p-4"
            >
              <h3 className="text-white font-semibold">{user.name}</h3>
              <p className="text-gray-400 text-sm">{user.email}</p>

              <div className="mt-3">
                {isExcluded(user.id) ? (
                  <button
                    onClick={() => handleRemove(user.id)}
                    className="w-full text-red-400 bg-red-400/10 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <UserMinus className="w-4 h-4" />
                    Remove from Excluded
                  </button>
                ) : (
                  <button
                    onClick={() => handleAdd(user.id)}
                    className="w-full text-[#80ee64] bg-[#80ee64]/10 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add to Excluded
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#1A1B1F] border border-white/5 rounded-lg text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-400 text-sm">Page {page}</span>
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

export default AdminExcludedUsers;
