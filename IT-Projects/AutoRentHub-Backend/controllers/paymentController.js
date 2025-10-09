// controllers/paymentController.js
const stripe = require('../config/stripe');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { paginate } = require('../utils/helpers');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount, currency = 'usd' } = req.body;

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId).populate('userId vehicleId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user.id.toString(),
        bookingReference: booking.bookingId
      }
    });

    // Create payment record
    const payment = await Payment.create({
      paymentId: `PAY_${Date.now()}`,
      bookingId,
      userId: req.user.id,
      amount,
      paymentMethod: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      transactionReference: paymentIntent.id
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update payment status
      const payment = await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        { 
          paymentStatus: 'completed',
          paymentDate: new Date(),
          gatewayResponse: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
          }
        },
        { new: true }
      ).populate('bookingId userId');

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment record not found'
        });
      }

      // Update booking status to confirmed
      await Booking.findByIdAndUpdate(
        payment.bookingId._id,
        { bookingStatus: 'confirmed' }
      );

      // Send payment confirmation email
      try {
        await sendEmail({
          email: payment.userId.email,
          subject: 'Payment Confirmation - Auto Rent Hub',
          html: emailTemplates.paymentConfirmation(payment, payment.bookingId)
        });
      } catch (emailError) {
        console.error('Payment confirmation email failed:', emailError);
      }

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: { payment }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { userId: req.user.id };
    if (status && status !== 'all') {
      query.paymentStatus = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: {
        path: 'bookingId',
        select: 'bookingId startDate endDate totalAmount',
        populate: {
          path: 'vehicleId',
          select: 'brand model vehicleId'
        }
      },
      sort: { createdAt: -1 }
    };

    const result = await paginate(Payment, query, options);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/payments/:id/refund
// @access  Private (Admin)
const processRefund = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed payments'
      });
    }

    const refundAmount = amount || payment.amount;

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(refundAmount * 100) // Convert to cents
    });

    // Update payment record
    payment.paymentStatus = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = reason;
    payment.refundDate = new Date();
    payment.gatewayResponse = { ...payment.gatewayResponse, refund };
    
    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: { payment, refund }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments/all
// @access  Private (Admin)
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentMethod } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.paymentStatus = status;
    }
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        {
          path: 'userId',
          select: 'name email'
        },
        {
          path: 'bookingId',
          select: 'bookingId startDate endDate',
          populate: {
            path: 'vehicleId',
            select: 'brand model vehicleId'
          }
        }
      ],
      sort: { createdAt: -1 }
    };

    const result = await paginate(Payment, query, options);

    // Calculate summary statistics
    const totalRevenue = await Payment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      summary: {
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate payment report
// @route   GET /api/payments/report
// @access  Private (Admin)
const generatePaymentReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let matchStage = { paymentStatus: 'completed' };
    
    if (startDate && endDate) {
      matchStage.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let groupStage = {};
    if (groupBy === 'day') {
      groupStage = {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' },
          day: { $dayOfMonth: '$paymentDate' }
        }
      };
    } else if (groupBy === 'month') {
      groupStage = {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' }
        }
      };
    }

    const report = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          ...groupStage,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
    ]);

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public (Stripe webhook)
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Handle successful payment
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: 'completed' }
      );
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Handle failed payment
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: failedPayment.id },
        { paymentStatus: 'failed' }
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  processRefund,
  getAllPayments,
  generatePaymentReport,
  handleWebhook
};