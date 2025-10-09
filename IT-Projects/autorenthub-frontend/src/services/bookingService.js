import api from './api';

export const bookingService = {
  // Create a new booking (Used by BookingForm)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    // NOTE: The BookingForm expects response.data to contain the created booking.
    return response.data;
  },

  // 🔑 RENAMED/FIXED: Renamed to align with error. The MyBookings page likely calls 'getBooking'
  // If your API uses an ID, keep the implementation, but rename the export function.
  getBooking: async (bookingId) => {
    // NOTE: Assuming this is meant to fetch one specific booking (e.g., for 'View Details')
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Get all bookings for the currently logged-in user (Used by MyBookings page)
  getUserBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  // Update a booking
  updateBooking: async (bookingId, updateData) => {
    const response = await api.put(`/bookings/${bookingId}`, updateData);
    return response.data;
  },

  // Cancel a booking
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  // 🔑 ADDED: Check vehicle availability (Used by BookingForm, resolves "Failed to check availability")
  checkAvailability: async (vehicleId, startDate, endDate) => {
    try {
      // This matches the standard REST pattern for checking a resource's availability
      const response = await api.get(`/vehicles/${vehicleId}/availability`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
        // Re-throw or return an object that can be handled by BookingForm's try/catch
        // For debugging, console.error is useful.
        console.error('API Error during checkAvailability:', error);
        throw error; 
    }
  }
};