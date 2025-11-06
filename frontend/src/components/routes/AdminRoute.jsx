
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const AdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // If user is logged in but not an admin, redirect them to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
