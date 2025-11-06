// src/api/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
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
    const res = await axios.post(`${API_URL}/register`, {
      full_name,
      email,
      password,
      referred_by: referralCode, // send it
    });
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Signup failed",
    };
  }
};

