import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Lock, Unlock } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const token = localStorage.getItem("token");

  // Load Users
  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        params: { search, role: "user", page, limit },  // ⬅ ONLY USERS
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // ⬅ Filter again for safety (removes admins)
        const onlyUsers = res.data.users.filter(u => u.role === "user");

        setUsers(onlyUsers);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  // Search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  // 🔒 Lock User
  const handleLock = async (id) => {
    try {
      await axios.post(
        `${API_URL}/admin/users/${id}/lock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User locked");

      // 🟢 Update instantly without reload flicker
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_locked: true } : u
        )
      );

    } catch (err) {
      toast.error("Error locking user");
    }
  };

  // 🔓 Unlock User
  const handleUnlock = async (id) => {
    try {
      await axios.post(
        `${API_URL}/admin/users/${id}/unlock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User unlocked");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_locked: false } : u
        )
      );

    } catch (err) {
      toast.error("Error unlocking user");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-white mb-6">Manage Users</h1>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6 bg-[#0F1014] border border-white/5 p-4 rounded-xl">

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 gap-2"
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            className="bg-transparent text-white placeholder-gray-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-[#0F1014] rounded-xl border border-white/5">
        <table className="w-full min-w-[900px]">
          <thead className="text-gray-400 bg-white/5 text-sm">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-4">{u.id}</td>
                <td className="p-4">{u.name}</td>
                <td className="p-4 text-gray-400">{u.email}</td>

                {/* User Status */}
                <td className="p-4">
                  {u.is_locked ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                      Locked
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      Active
                    </span>
                  )}
                </td>

                {/* Lock / Unlock Buttons */}
                <td className="p-4">
                  {u.is_locked ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUnlock(u.id)}
                      className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition"
                    >
                      <Unlock className="w-4 h-4" /> Unlock
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLock(u.id)}
                      className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition"
                    >
                      <Lock className="w-4 h-4" /> Lock
                    </motion.button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          className="px-4 py-2 bg-white/5 text-white rounded-lg disabled:opacity-30"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>

        <span className="text-gray-300">
          Page {page} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-white/5 text-white rounded-lg disabled:opacity-30"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default AdminUsers;
