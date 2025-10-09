// controllers/vehicleController.js
const Vehicle = require('../models/Vehicle');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { paginate } = require('../utils/helpers');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      vehicleType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      city,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { vehicleStatus: 'available' };

    if (vehicleType && vehicleType !== 'all') {
      query.vehicleType = vehicleType;
    }

    if (fuelType && fuelType !== 'all') {
      query.fuelType = fuelType;
    }

    if (transmission && transmission !== 'all') {
      query.transmission = transmission;
    }

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (search) {
      query.$or = [
        { model: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { vehicleDescription: new RegExp(search, 'i') }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions
    };

    const result = await paginate(Vehicle, query, options);

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

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: { vehicle }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Private (Admin/Staff)
const createVehicle = async (req, res) => {
  try {
    const vehicleData = { ...req.body };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => uploadToCloudinary(file, 'vehicles'));
      const uploadedImages = await Promise.all(imagePromises);
      vehicleData.images = uploadedImages;
    }

    const vehicle = await Vehicle.create(vehicleData);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: { vehicle }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin/Staff)
const updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    const updateData = { ...req.body };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => uploadToCloudinary(file, 'vehicles'));
      const uploadedImages = await Promise.all(imagePromises);
      
      // If replacing images, delete old ones
      if (req.body.replaceImages === 'true') {
        for (const image of vehicle.images) {
          if (image.publicId) {
            await deleteFromCloudinary(image.publicId);
          }
        }
        updateData.images = uploadedImages;
      } else {
        updateData.images = [...vehicle.images, ...uploadedImages];
      }
    }

    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: { vehicle }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Delete images from cloudinary
    for (const image of vehicle.images) {
      if (image.publicId) {
        await deleteFromCloudinary(image.publicId);
      }
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vehicle status
// @route   PUT /api/vehicles/:id/status
// @access  Private (Admin/Staff)
const updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { vehicleStatus: status },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      message: 'Vehicle status updated successfully',
      data: { vehicle }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vehicle availability
// @route   GET /api/vehicles/:id/availability
// @access  Public
const getVehicleAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const vehicleId = req.params.id;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const Booking = require('../models/Booking');
    
    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      vehicleId,
      bookingStatus: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    const isAvailable = !conflictingBooking;

    res.json({
      success: true,
      data: {
        available: isAvailable,
        conflictingBooking: conflictingBooking || null
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
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
  getVehicleAvailability
};