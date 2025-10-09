import { api } from './api';

export const vehicleService = {
  // Get all vehicles with filters
  getVehicles: async (params = {}) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },

  // Get single vehicle
  getVehicle: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  // Create vehicle (admin/staff)
  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update vehicle (admin/staff)
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete vehicle (admin)
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  // Update vehicle status (admin/staff)
  updateVehicleStatus: async (id, status) => {
    const response = await api.put(`/vehicles/${id}/status`, { status });
    return response.data;
  },

  // Check vehicle availability
  checkAvailability: async (id, startDate, endDate) => {
    const response = await api.get(`/vehicles/${id}/availability`, {
      params: { startDate, endDate }
    });
    return response.data;
  }
};
