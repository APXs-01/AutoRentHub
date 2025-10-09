const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  respondToComplaint
} = require('../controllers/complaintController');

// User routes
router.post('/', protect, createComplaint);
router.get('/me', protect, getMyComplaints);

// Admin routes
router.get('/', protect, admin, getAllComplaints);
router.put('/:id/respond', protect, admin, respondToComplaint);

module.exports = router;


