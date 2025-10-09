// controllers/userController.js
const User = require('../models/User');
const Booking = require('../models/Booking');
const { uploadToCloudinary } = require('../config/cloudinary');
const { paginate } = require('../utils/helpers');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, profile } = req.body;

    // Handle avatar upload if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'avatars');
      req.body.profile = { ...profile, avatar: uploadResult.url };
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phoneNumber,
        profile: { ...req.user.profile, ...req.body.profile }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$bookingStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find({ userId: req.user.id })
      .populate('vehicleId', 'brand model vehicleId images')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total spent
    const totalSpent = await Booking.aggregate([
      { $match: { userId: req.user._id, bookingStatus: { $in: ['completed', 'confirmed', 'active'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const stats = {
      bookings: bookingStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      totalSpent: totalSpent[0]?.total || 0,
      totalBookings: bookingStats.reduce((acc, stat) => acc + stat.count, 0)
    };

    res.json({
      success: true,
      data: {
        stats,
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats
};