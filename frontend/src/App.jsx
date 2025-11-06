
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import ContactPage from '@/pages/ContactPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';
import PrivateRoute from '@/components/routes/PrivateRoute';
import AdminRoute from '@/components/routes/AdminRoute';
import AuthModal from '@/components/AuthModal';
import ReferralRedirect from '@/pages/ReferralRedirect';

// User Pages
import Dashboard from '@/pages/Dashboard';
import Investment from '@/pages/Investment';
import Deposit from '@/pages/Deposit';
import Withdraw from '@/pages/Withdraw';
import Affiliate from '@/pages/Affiliate';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminPlans from '@/pages/admin/AdminPlans';

function App() {
  return (
    <Router>
      <AuthModal />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/ref/:code" element={<ReferralRedirect />} />


        {/* Legacy auth routes redirect to home and open modal */}
        <Route path="/login" element={<Navigate to="/" state={{ openAuth: 'login' }} replace />} />
        <Route path="/signup" element={<Navigate to="/" state={{ openAuth: 'signup' }} replace />} />

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
        </Route>
        
        {/* Redirect any other path to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
