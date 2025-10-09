// routes/payment.js
const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  processRefund,
  getAllPayments,
  generatePaymentReport,
  handleWebhook
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');
const { 
  validatePayment, 
  validateObjectId,
  validatePaginationQuery 
} = require('../middleware/validation');

// Public routes (Webhook)
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

// Protected routes (Customer)
router.post('/create-intent', protect, validatePayment, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/history', protect, validatePaginationQuery, getPaymentHistory);

// Protected routes (Admin)
router.get('/all', protect, admin, validatePaginationQuery, getAllPayments);
router.get('/report', protect, admin, generatePaymentReport);
router.post('/:id/refund', protect, admin, validateObjectId, processRefund);

module.exports = router;