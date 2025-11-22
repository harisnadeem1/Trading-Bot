// src/api/auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const USERS_URL = `${API_URL}/users`;

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${USERS_URL}/login`, { email, password });
    return { success: true, data: res.data };
  } catch (err) {
    const errData = err.response?.data;

    // 🔥 Detect admin/60-day lock
    if (err.response?.status === 403 && errData?.error === "ACCOUNT_LOCKED") {
      return {
        success: false,
        locked: true,                     // 👈 important
        message: errData.message || "Your access has been locked.",
      };
    }

    return {
      success: false,
      message: errData?.message || "Login failed",
    };
  }
};

export const signupUser = async (full_name, email, password, referralCode = null) => {
  try {
    const res = await axios.post(`${USERS_URL}/register`, {
      full_name,
      email,
      password,
      referred_by: referralCode,
    });
    return { success: true, data: res.data };
  } catch (err) {
    const errData = err.response?.data;
    return {
      success: false,
      message: errData?.message || "Signup failed",
    };
  }
};
