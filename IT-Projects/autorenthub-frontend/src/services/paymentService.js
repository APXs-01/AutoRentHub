import api from './api';

const paymentService = {
  // Create payment intent
  createPaymentIntent: async (bookingId, amount) => {
    try {
      const response = await api.post('/payments/create-intent', {
        bookingId,
        amount,
        currency: 'usd'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId) => {
    try {
      const response = await api.post('/payments/confirm', {
        paymentIntentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment history
  getPaymentHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/payments/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default paymentService;
