// src/components/auth/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false, staffOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for auth state to initialize
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 2. Authentication Check
  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authorization Check (Admin)
  if (adminOnly && user.userType !== 'admin') {
    // If not admin, redirect to a safe place (like home or user dashboard)
    const redirectPath = user.userType === 'customer' ? '/userdashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // 4. Authorization Check (Staff)
  if (staffOnly && !['admin', 'staff'].includes(user.userType)) {
    // Redirect non-staff/admin users
    const redirectPath = user.userType === 'customer' ? '/userdashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;