// controllers/reviewController.js
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { paginate } = require('../utils/helpers');
const mongoose = require('mongoose');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { vehicleId, bookingId, rating, comment, categories } = req.body;

    // Verify booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    if (booking.bookingStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed bookings'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ 
      userId: req.user.id, 
      bookingId 
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    // Create review
    const review = await Review.create({
      userId: req.user.id,
      vehicleId,
      bookingId,
      rating,
      comment,
      categories
    });

    await review.populate([
      { path: 'userId', select: 'name' },
      { path: 'vehicleId', select: 'brand model vehicleId' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vehicle reviews
// @route   GET /api/reviews/vehicle/:vehicleId
// @access  Public
const getVehicleReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const vehicleId = req.params.vehicleId;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'userId', select: 'name' }
      ],
      sort: { createdAt: -1 }
    };

    const result = await paginate(Review, { vehicleId, isApproved: true }, options);

    // Calculate average ratings
    const ratingStats = await Review.aggregate([
      { $match: { vehicleId: new mongoose.Types.ObjectId(vehicleId), isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: {
              rating: '$rating',
              cleanliness: '$categories.cleanliness',
              comfort: '$categories.comfort',
              performance: '$categories.performance',
              value: '$categories.value'
            }
          }
        }
      }
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratings: []
    };

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user reviews
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { 
          path: 'vehicleId', 
          select: 'brand model vehicleId images' 
        },
        {
          path: 'bookingId',
          select: 'bookingId startDate endDate'
        }
      ],
      sort: { createdAt: -1 }
    };

    const result = await paginate(Review, { userId: req.user.id }, options);

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

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { rating, comment, categories } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment, categories },
      { new: true, runValidators: true }
    ).populate([
      { path: 'userId', select: 'name' },
      { path: 'vehicleId', select: 'brand model vehicleId' }
    ]);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/all
// @access  Private (Admin)
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, isApproved, rating } = req.query;

    let query = {};
    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }
    if (rating) {
      query.rating = parseInt(rating);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'userId', select: 'name email' },
        { path: 'vehicleId', select: 'brand model vehicleId' },
        { path: 'bookingId', select: 'bookingId' }
      ],
      sort: { createdAt: -1 }
    };

    const result = await paginate(Review, query, options);

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

// @desc    Update review approval status (Admin)
// @route   PUT /api/reviews/:id/approval
// @access  Private (Admin)
const updateReviewApproval = async (req, res) => {
  try {
    const { isApproved, adminResponse } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved, adminResponse },
      { new: true, runValidators: true }
    ).populate([
      { path: 'userId', select: 'name email' },
      { path: 'vehicleId', select: 'brand model vehicleId' }
    ]);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review approval status updated',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createReview,
  getVehicleReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewApproval
};