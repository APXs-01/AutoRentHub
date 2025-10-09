// routes/vehicle.js
const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
  getVehicleAvailability
} = require('../controllers/vehicleController');
const { protect, staff, admin } = require('../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');
const { 
  validateVehicle, 
  validateObjectId,
  validatePaginationQuery 
} = require('../middleware/validation');

// Public routes
router.get('/', validatePaginationQuery, getVehicles);
router.get('/:id', validateObjectId, getVehicle);
router.get('/:id/availability', validateObjectId, getVehicleAvailability);

// Protected routes (Staff/Admin)
router.post('/', 
  protect, 
  staff, 
  uploadMultiple('images', 5), 
  handleUploadError, 
  validateVehicle, 
  createVehicle
);
router.put('/:id', 
  protect, 
  staff, 
  validateObjectId,
  uploadMultiple('images', 5), 
  handleUploadError, 
  updateVehicle
);
router.put('/:id/status', protect, staff, validateObjectId, updateVehicleStatus);
router.delete('/:id', protect, admin, validateObjectId, deleteVehicle);

module.exports = router;