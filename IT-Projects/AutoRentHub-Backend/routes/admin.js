// routes/admin.js
const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  generateSystemReport
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const { 
  validateObjectId,
  validatePaginationQuery 
} = require('../middleware/validation');

// Protected routes (Admin only)
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, validatePaginationQuery, getAllUsers);
router.put('/users/:id/status', protect, admin, validateObjectId, updateUserStatus);
router.delete('/users/:id', protect, admin, validateObjectId, deleteUser);
router.get('/report', protect, admin, generateSystemReport);

module.exports = router;