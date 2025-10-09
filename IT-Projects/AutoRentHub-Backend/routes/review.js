// routes/review.js (Full Corrected Code)

const express = require('express');
const router = express.Router();
const {
  createReview,
  getVehicleReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewApproval
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');
const { 
  validateReview, 
  validateObjectId,
  validateVehicleId, // <--- NEW IMPORT
  validatePaginationQuery 
} = require('../middleware/validation');

// Public routes
// FIX: Using the reliable custom validateVehicleId function
router.get('/vehicle/:vehicleId', validateVehicleId, validatePaginationQuery, getVehicleReviews);

// Protected routes (Customer)
router.post('/', protect, validateReview, createReview);
router.get('/user', protect, validatePaginationQuery, getUserReviews);
router.put('/:id', protect, validateObjectId, updateReview);
router.delete('/:id', protect, validateObjectId, deleteReview);

// Protected routes (Admin)
router.get('/all', protect, admin, validatePaginationQuery, getAllReviews);
router.put('/:id/approval', protect, admin, validateObjectId, updateReviewApproval);

module.exports = router;