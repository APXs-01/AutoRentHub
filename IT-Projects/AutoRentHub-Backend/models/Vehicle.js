const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    unique: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1990,
    max: new Date().getFullYear() + 1
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'scooter'],
    required: true
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: true
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic'],
    required: true
  },
  seatingCapacity: {
    type: Number,
    required: function() { return this.vehicleType === 'car'; }
  },
  color: String,
  plateNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleDescription: String,
  features: [String],
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: 0
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: 0
  },
  vehicleStatus: {
    type: String,
    enum: ['available', 'booked', 'maintenance', 'out_of_service'],
    default: 'available'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  location: {
    address: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  mileage: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate vehicle ID before saving
vehicleSchema.pre('save', async function(next) {
  if (!this.vehicleId) {
    const count = await mongoose.model('Vehicle').countDocuments();
    const prefix = this.vehicleType === 'car' ? 'CAR' : 'BIKE';
    this.vehicleId = `${prefix}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Update rating method
vehicleSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ vehicleId: this._id });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / reviews.length;
    this.rating.count = reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
  
  await this.save();
};

module.exports = mongoose.model('Vehicle', vehicleSchema);