const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required']
  },
  returnLocation: {
    type: String,
    required: [true, 'Return location is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  rentalType: {
    type: String,
    enum: ['hourly', 'daily'],
    required: true
  },
  duration: {
    hours: Number,
    days: Number
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deposit: {
    type: Number,
    default: 0
  },
  notes: String,
  cancellationReason: String,
  staffNotes: String,
  actualStartTime: Date,
  actualEndTime: Date,
  extraCharges: {
    fuelCharges: { type: Number, default: 0 },
    damageCharges: { type: Number, default: 0 },
    lateReturnCharges: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `BK${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calculate duration
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  const diffTime = Math.abs(endDate - startDate);
  
  if (this.rentalType === 'hourly') {
    this.duration.hours = Math.ceil(diffTime / (1000 * 60 * 60));
  } else {
    this.duration.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  next();
});

// Validate booking dates
bookingSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  }
  if (this.startDate < new Date()) {
    next(new Error('Start date cannot be in the past'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);