// src/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout'; 

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import BookingDetailPage from './pages/BookingDetailPage';
import UpdateBookingPage from './pages/UpdateBookingPage'; // ✅ 1. Import the new page
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/common/LoadingSpinner';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const AppRoutes = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
        
        {/* Protected Customer Routes */}
        <Route path="/booking/:vehicleId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/my-bookings/:bookingId" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
        
        {/* ✅ 2. Add the new route for the update page */}
        <Route path="/my-bookings/:bookingId/edit" element={<ProtectedRoute><UpdateBookingPage /></ProtectedRoute>} />
        
        <Route path="/payment/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />
      </Route>

      {/* Dashboards */}
      <Route path="/userdashboard/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/admindashboard/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;