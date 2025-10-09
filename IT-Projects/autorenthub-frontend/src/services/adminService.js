import api from './api';

export const adminService = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // System Reports
  generateSystemReport: async (params = {}) => {
    const response = await api.get('/admin/report', { params });
    return response.data;
  },

  // Payment Reports
  getAllPayments: async (params = {}) => {
    const response = await api.get('/payments/all', { params });
    return response.data;
  },

  generatePaymentReport: async (params = {}) => {
    const response = await api.get('/payments/report', { params });
    return response.data;
  },

  // Booking Management
  getAllBookings: async (params = {}) => {
    const response = await api.get('/bookings/all/list', { params });
    return response.data;
  },

  updateBookingStatus: async (bookingId, status, staffNotes) => {
    const response = await api.put(`/bookings/${bookingId}/status`, { status, staffNotes });
    return response.data;
  },

  // Vehicle Management
  getAllVehicles: async (params = {}) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    const response = await api.put(`/vehicles/${vehicleId}`, vehicleData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteVehicle: async (vehicleId) => {
    const response = await api.delete(`/vehicles/${vehicleId}`);
    return response.data;
  },

  updateVehicleStatus: async (vehicleId, status) => {
    const response = await api.put(`/vehicles/${vehicleId}/status`, { status });
    return response.data;
  },

  // Review Management
  getAllReviews: async (params = {}) => {
    const response = await api.get('/reviews/all', { params });
    return response.data;
  },

  updateReviewApproval: async (reviewId, isApproved, adminResponse) => {
    const response = await api.put(`/reviews/${reviewId}/approval`, { isApproved, adminResponse });
    return response.data;
  }
};