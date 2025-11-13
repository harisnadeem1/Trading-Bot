// src/api/auth.js
import axios from "axios";

// Always read from env (works in dev & production)
const API_URL = import.meta.env.VITE_API_BASE_URL;

// USERS endpoint
const USERS_URL = `${API_URL}/users`;

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${USERS_URL}/login`, { email, password });
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
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
    return {
      success: false,
      message: err.response?.data?.message || "Signup failed",
    };
  }
};
