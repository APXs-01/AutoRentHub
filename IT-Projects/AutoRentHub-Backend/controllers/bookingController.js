// controllers/bookingController.js
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { checkBookingOverlap, calculateDuration } = require('../utils/validators');
const { paginate } = require('../utils/helpers');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      rentalType,
      notes
    } = req.body;

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (vehicle.vehicleStatus !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available'
      });
    }

    // Check for booking conflicts
    const hasConflict = await checkBookingOverlap(vehicleId, startDate, endDate);
    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is already booked for this period'
      });
    }

    // Calculate total amount
    const duration = calculateDuration(startDate, endDate, rentalType);
    const rate = rentalType === 'hourly' ? vehicle.pricePerHour : vehicle.pricePerDay;
    const totalAmount = duration * rate;

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      vehicleId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pickupLocation,
      returnLocation,
      rentalType,
      totalAmount,
      notes
    });

    // Populate the booking with user and vehicle details
    await booking.populate(['userId', 'vehicleId']);

    // Update vehicle status to booked
    await Vehicle.findByIdAndUpdate(vehicleId, { vehicleStatus: 'booked' });

    // Send confirmation email
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Booking Confirmation - Auto Rent Hub',
        html: emailTemplates.bookingConfirmation(booking, req.user, vehicle)
      });
    } catch (emailError) {
      console.error('Booking confirmation email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { userId: req.user.id };
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'vehicleId',
      sort: { createdAt: -1 }
    };

    const result = await paginate(Booking, query, options);

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

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phoneNumber')
      .populate('vehicleId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin/staff
    if (booking.userId._id.toString() !== req.user.id && 
        !['admin', 'staff'].includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership or admin/staff privileges
    if (booking.userId.toString() !== req.user.id && 
        !['admin', 'staff'].includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Don't allow updates to confirmed or completed bookings
    if (['completed', 'cancelled'].includes(booking.bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed or cancelled booking'
      });
    }

    const { startDate, endDate, pickupLocation, returnLocation, notes } = req.body;

    // If dates are being changed, check for conflicts
    if (startDate || endDate) {
      const newStartDate = startDate || booking.startDate;
      const newEndDate = endDate || booking.endDate;
      
      const hasConflict = await checkBookingOverlap(booking.vehicleId, newStartDate, newEndDate, booking._id);
      if (hasConflict) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle is already booked for this period'
        });
      }

      // Recalculate total amount
      const duration = calculateDuration(newStartDate, newEndDate, booking.rentalType);
      const vehicle = await Vehicle.findById(booking.vehicleId);
      const rate = booking.rentalType === 'hourly' ? vehicle.pricePerHour : vehicle.pricePerDay;
      req.body.totalAmount = duration * rate;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['userId', 'vehicleId']);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: { booking: updatedBooking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership or admin/staff privileges
    if (booking.userId.toString() !== req.user.id && 
        !['admin', 'staff'].includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.bookingStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = cancellationReason;
    await booking.save();

    // Make vehicle available again
    await Vehicle.findByIdAndUpdate(booking.vehicleId, { vehicleStatus: 'available' });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings (Admin/Staff)
// @route   GET /api/bookings/all
// @access  Private (Admin/Staff)
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, vehicleType, startDate, endDate } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'userId', select: 'name email phoneNumber' },
        { path: 'vehicleId' }
      ],
      sort: { createdAt: -1 }
    };

    const result = await paginate(Booking, query, options);

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

// @desc    Update booking status (Admin/Staff)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin/Staff)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, staffNotes } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        bookingStatus: status,
        staffNotes,
        ...(status === 'active' && { actualStartTime: new Date() }),
        ...(status === 'completed' && { actualEndTime: new Date() })
      },
      { new: true, runValidators: true }
    ).populate(['userId', 'vehicleId']);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update vehicle status based on booking status
    let vehicleStatus = 'available';
    if (status === 'active') {
      vehicleStatus = 'booked';
    } else if (status === 'completed' || status === 'cancelled') {
      vehicleStatus = 'available';
    }

    await Vehicle.findByIdAndUpdate(booking.vehicleId, { vehicleStatus });

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
};