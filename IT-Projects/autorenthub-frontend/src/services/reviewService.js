import api from './api';

export const reviewService = {
  /**
   * Create a new review.
   * @param {object} reviewData - The data for the new review.
   * @returns {Promise<object>}
   */
  createReview: (reviewData) => api.post('/reviews', reviewData),

  /**
   * Get reviews for a specific vehicle.
   * @param {string} vehicleId - The ID of the vehicle.
   * @param {object} params - Optional query parameters.
   * @returns {Promise<object>}
   */
  getVehicleReviews: async (vehicleId, params = {}) => {
    const response = await api.get(`/reviews/vehicle/${vehicleId}`, { params });
    return response.data; // Return the nested data object from the axios response
  },

  /**
   * Get all reviews written by the current user.
   * @param {object} params - Optional query parameters.
   * @returns {Promise<object>}
   */
  getUserReviews: (params = {}) => api.get('/reviews/user', { params }),

  /**
   * Update an existing review.
   * @param {string} reviewId - The ID of the review to update.
   * @param {object} reviewData - The updated review data.
   * @returns {Promise<object>}
   */
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),

  /**
   * Delete a review.
   * @param {string} reviewId - The ID of the review to delete.
   * @returns {Promise<object>}
   */
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};