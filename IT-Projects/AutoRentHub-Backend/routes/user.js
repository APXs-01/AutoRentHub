// routes/user.js
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboardStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', 
  protect, 
  uploadSingle('avatar'), 
  handleUploadError, 
  updateProfile
);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;