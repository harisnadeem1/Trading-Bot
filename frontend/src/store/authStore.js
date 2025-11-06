// frontend/src/store/authStore.js
import { create } from "zustand";
import { loginUser, signupUser } from "@/api/auth";

export const useAuthStore = create((set, get) => ({
  isAuthModalOpen: false,
  authModalView: "login",
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  openAuthModal: (view = "login") => set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  login: async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success) {
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      set({ currentUser: data, token: data.token, isAuthModalOpen: false });
      return { success: true, user: data };
    }
    return { success: false, message: res.message };
  },

  signup: async (email, password, name) => {
    const res = await signupUser(name, email, password);
    if (res.success) {
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      set({ currentUser: data, token: data.token, isAuthModalOpen: false });
      return { success: true, user: data };
    }
    return { success: false, message: res.message };
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ currentUser: null, token: null });
  },

  // ✅ For your AdminRoute and PrivateRoute
  isAuthenticated: () => !!localStorage.getItem("token"),
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "admin";
  },
}));
