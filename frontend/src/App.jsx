import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ single toaster import
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

import LandingPage from "@/pages/LandingPage";
import ContactPage from "@/pages/ContactPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";
import PrivateRoute from "@/components/routes/PrivateRoute";
import AdminRoute from "@/components/routes/AdminRoute";
import AuthModal from "@/components/AuthModal";
import ReferralRedirect from "@/pages/ReferralRedirect";
import ScrollToTop from "@/components/routes/ScrollToTop";
import LockModal from "@/components/LockModal";

// User Pages
import Dashboard from "@/pages/Dashboard";
import Investment from "@/pages/Investment";
import Deposit from "@/pages/Deposit";
import Withdraw from "@/pages/Withdraw";
import Affiliate from "@/pages/Affiliate";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminTransactions from "@/pages/admin/AdminTransactions";
import AdminPlans from "@/pages/admin/AdminPlans";
import AdminExcludedUsers from "@/pages/admin/AdminExcludedUsers";
import AdminUsersLock from "@/pages/admin/AdminUsersLock";


function App() {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    fetchCurrentUser();  // 👈 IMPORTANT
  }, []);

  
  return (
    <Router>
      <ScrollToTop />
      <AuthModal />
      <LockModal />

      {/* ✅ Global Toaster (react-hot-toast) */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0F1014",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "12px 18px",
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#80ee64", secondary: "#0F1014" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#0F1014" },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/ref/:code" element={<ReferralRedirect />} />

        {/* Legacy auth routes redirect to home and open modal */}
        <Route path="/login" element={<Navigate to="/" state={{ openAuth: "login" }} replace />} />
        <Route path="/signup" element={<Navigate to="/" state={{ openAuth: "signup" }} replace />} />

        {/* Private User Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Dashboard />} />
          <Route path="investment" element={<Investment />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="affiliate" element={<Affiliate />} />
        </Route>

        {/* Private Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="excluded-users" element={<AdminExcludedUsers />} />
          <Route path="user-lock" element={<AdminUsersLock />} />
        </Route>

        {/* Redirect all unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
