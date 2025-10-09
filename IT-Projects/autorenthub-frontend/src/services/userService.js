import api from './api';

export const userService = {
  // Get user profile
  getProfile: () => api.get('/users/profile'),

  // Update user profile
  updateProfile: (formData) => api.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Get dashboard statistics
  getDashboardStats: () => api.get('/users/dashboard'),

  // Change password
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
};