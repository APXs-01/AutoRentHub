const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'rejected'],
      default: 'open'
    },
    adminResponse: {
      type: String,
      default: ''
    },
    respondedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', ComplaintSchema);


