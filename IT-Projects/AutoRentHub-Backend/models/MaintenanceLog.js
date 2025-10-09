const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  maintenanceId: {
    type: String,
    unique: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  maintenanceType: {
    type: String,
    enum: ['routine', 'repair', 'inspection', 'cleaning', 'emergency'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  maintenanceDate: {
    type: Date,
    required: true
  },
  completedDate: Date,
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  performedBy: {
    type: String,
    required: true
  },
  nextMaintenanceDate: Date,
  notes: String,
  partsReplaced: [{
    partName: String,
    cost: Number,
    supplier: String
  }],
  images: [{
    url: String,
    publicId: String,
    description: String
  }]
}, {
  timestamps: true
});

// Generate maintenance ID
maintenanceLogSchema.pre('save', async function(next) {
  if (!this.maintenanceId) {
    const count = await mongoose.model('MaintenanceLog').countDocuments();
    this.maintenanceId = `MNT${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);