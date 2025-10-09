// middleware/validation.js (Modified Code)

const { body, query, param, validationResult } = require('express-validator');
const mongoose = require('mongoose'); // <--- 1. ADD THIS IMPORT

// Validation middleware to check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name should only contain letters and spaces'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('userType')
    .optional()
    .isIn(['customer', 'admin', 'staff'])
    .withMessage('User type must be customer, admin, or staff'),
  validate
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Vehicle validation
const validateVehicle = [
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Vehicle model is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Model must be between 2 and 50 characters'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Brand must be between 2 and 30 characters'),
  body('year')
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),
  body('vehicleType')
    .isIn(['car', 'bike', 'scooter'])
    .withMessage('Vehicle type must be car, bike, or scooter'),
  body('fuelType')
    .isIn(['petrol', 'diesel', 'electric', 'hybrid'])
    .withMessage('Invalid fuel type'),
  body('transmission')
    .isIn(['manual', 'automatic'])
    .withMessage('Transmission must be manual or automatic'),
  body('pricePerDay')
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  body('pricePerHour')
    .isFloat({ min: 0 })
    .withMessage('Price per hour must be a positive number'),
  body('plateNumber')
    .notEmpty()
    .withMessage('Plate number is required')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('Invalid plate number format'),
  body('seatingCapacity')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Seating capacity must be between 1 and 50'),
  validate
];

// Booking validation
const validateBooking = [
  body('vehicleId')
    .isMongoId()
    .withMessage('Invalid vehicle ID'),
  body('startDate')
    .isISO8601()
    .toDate()
    .withMessage('Invalid start date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  body('endDate')
    .isISO8601()
    .toDate()
    .withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('pickupLocation')
    .trim()
    .notEmpty()
    .withMessage('Pickup location is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Pickup location must be between 5 and 100 characters'),
  body('returnLocation')
    .trim()
    .notEmpty()
    .withMessage('Return location is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Return location must be between 5 and 100 characters'),
  body('rentalType')
    .isIn(['hourly', 'daily'])
    .withMessage('Rental type must be hourly or daily'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  validate
];

// Review validation
const validateReview = [
  body('vehicleId')
    .isMongoId()
    .withMessage('Invalid vehicle ID'),
  body('bookingId')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
  body('categories.cleanliness')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Cleanliness rating must be between 1 and 5'),
  body('categories.comfort')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Comfort rating must be between 1 and 5'),
  body('categories.performance')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Performance rating must be between 1 and 5'),
  body('categories.value')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Value rating must be between 1 and 5'),
  validate
];

// Payment validation
const validatePayment = [
  body('bookingId')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('currency')
    .optional()
    .isIn(['usd', 'eur', 'gbp', 'lkr'])
    .withMessage('Invalid currency'),
  validate
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validate
];

// Query parameter validation
const validatePaginationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate
];

// MongoDB ObjectId validation for routes using :id
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate
];

// ************************************************
// FIX: Custom validation for routes using :vehicleId
// ************************************************
const validateVehicleId = (req, res, next) => { // <--- 2. NEW CUSTOM FUNCTION
    const vehicleId = req.params.vehicleId;

    if (!vehicleId) {
        // Fallback check
        return res.status(400).json({ 
            success: false, 
            message: 'Validation failed',
            errors: [{ field: 'vehicleId', message: 'Vehicle ID is missing.' }]
        });
    }
    
    // Use Mongoose's built-in check for maximum reliability
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Validation failed',
            errors: [{ field: 'vehicleId', message: 'Invalid Vehicle ID format.' }] 
        });
    }
    
    // If valid, proceed
    next();
};


module.exports = {
  validate,
  validateUserRegistration,
  validateUserLogin,
  validateVehicle,
  validateBooking,
  validateReview,
  validatePayment,
  validatePasswordChange,
  validatePaginationQuery,
  validateObjectId,
  validateVehicleId // <--- 3. EXPORT THE NEW VALIDATOR
};