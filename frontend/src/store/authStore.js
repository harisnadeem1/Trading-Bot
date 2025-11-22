// frontend/src/store/authStore.js
import { create } from "zustand";
import axios from "axios";
import { loginUser, signupUser } from "@/api/auth";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create((set, get) => ({
  isAuthModalOpen: false,
  authModalView: "login",
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  // 🔥 Lock popup state
  isLockModalOpen: false,
  openLockModal: () => set({ isLockModalOpen: true }),
  closeLockModal: () => set({ isLockModalOpen: false }),

  openAuthModal: (view = "login") => set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  // ⭐ LOGIN WITH LOCK CHECK (admin + 60-day)
  login: async (email, password) => {
    const res = await loginUser(email, password);

    // 👇 Backend says "locked"
    if (res.locked) {
      // clear any old session just in case
      get().logout();
      get().openLockModal();
      return { success: false, locked: true, message: res.message };
    }

    // 👇 Normal login failure (wrong pass etc.)
    if (!res.success) {
      return { success: false, message: res.message };
    }

    // ✅ Success: store user & token
    const data = res.data;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    set({
      currentUser: data,
      token: data.token,
      isAuthModalOpen: false,
    });

    return { success: true, user: data };
  },

  // ⭐ SIGNUP (unchanged)
  signup: async (email, password, name) => {
    const res = await signupUser(name, email, password);
    if (res.success) {
      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      set({
        currentUser: data,
        token: data.token,
        isAuthModalOpen: false,
      });

      return { success: true, user: data };
    }
    return { success: false, message: res.message };
  },

  // ⭐ GLOBAL USER CHECK (already logged-in users)
  fetchCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      set({ currentUser: data });
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      const errData = err.response?.data;

      // 👇 If locked while already logged in → logout + lock modal
      if (err.response?.status === 403 && errData?.error === "ACCOUNT_LOCKED") {
        get().logout();
        get().openLockModal();
        return;
      }

      // any other error → just logout silently
      get().logout();
    }
  },

  // ⭐ LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ currentUser: null, token: null });
  },

  isAuthenticated: () => !!localStorage.getItem("token"),

  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "admin";
  },
}));
