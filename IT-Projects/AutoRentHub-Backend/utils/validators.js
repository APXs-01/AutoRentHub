// utils/validators.js
const mongoose = require('mongoose');

// Check if date is in future
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

// Check if end date is after start date
const isEndAfterStart = (startDate, endDate) => {
  return new Date(endDate) > new Date(startDate);
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

// Validate vehicle plate number
const isValidPlateNumber = (plateNumber) => {
  const plateRegex = /^[A-Z0-9-]+$/;
  return plateRegex.test(plateNumber);
};

// Calculate booking duration
const calculateDuration = (startDate, endDate, type = 'days') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  
  if (type === 'hours') {
    return Math.ceil(diffTime / (1000 * 60 * 60));
  }
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check booking overlap
const checkBookingOverlap = async (vehicleId, startDate, endDate, excludeBookingId = null) => {
  const Booking = require('../models/Booking');
  
  const query = {
    vehicleId,
    bookingStatus: { $in: ['confirmed', 'active'] },
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  const overlappingBooking = await Booking.findOne(query);
  return !!overlappingBooking;
};

module.exports = {
  isFutureDate,
  isEndAfterStart,
  isValidObjectId,
  isValidEmail,
  isValidPhone,
  isValidPlateNumber,
  calculateDuration,
  checkBookingOverlap
};