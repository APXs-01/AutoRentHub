// routes/booking.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect, staff } = require('../middleware/auth');
const { 
  validateBooking, 
  validateObjectId,
  validatePaginationQuery 
} = require('../middleware/validation');

// Protected routes (Customer)
router.post('/', protect, validateBooking, createBooking);
router.get('/', protect, validatePaginationQuery, getUserBookings);
router.get('/:id', protect, validateObjectId, getBooking);
router.put('/:id', protect, validateObjectId, updateBooking);
router.put('/:id/cancel', protect, validateObjectId, cancelBooking);

// Protected routes (Staff/Admin)
router.get('/all/list', protect, staff, validatePaginationQuery, getAllBookings);
router.put('/:id/status', protect, staff, validateObjectId, updateBookingStatus);

module.exports = router;