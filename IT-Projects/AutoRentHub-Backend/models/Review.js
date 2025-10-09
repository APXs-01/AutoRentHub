const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: 500
  },
  categories: {
    cleanliness: { type: Number, min: 1, max: 5 },
    comfort: { type: Number, min: 1, max: 5 },
    performance: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  adminResponse: String,
  reviewDate: {
    type: Date,
    default: Date.now
  },
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews for same booking
reviewSchema.index({ userId: 1, bookingId: 1 }, { unique: true });

// Update vehicle rating after review save
reviewSchema.post('save', async function() {
  const Vehicle = mongoose.model('Vehicle');
  const vehicle = await Vehicle.findById(this.vehicleId);
  if (vehicle) {
    await vehicle.updateRating();
  }
});

// Update vehicle rating after review remove
reviewSchema.post('remove', async function() {
  const Vehicle = mongoose.model('Vehicle');
  const vehicle = await Vehicle.findById(this.vehicleId);
  if (vehicle) {
    await vehicle.updateRating();
  }
});

module.exports = mongoose.model('Review', reviewSchema);