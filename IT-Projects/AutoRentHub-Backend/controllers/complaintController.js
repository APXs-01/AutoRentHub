const Complaint = require('../models/Complaint');

// Create a new complaint (user)
exports.createComplaint = async (req, res, next) => {
  try {
    const { bookingId, subject, message } = req.body;

    if (!bookingId || !subject || !message) {
      return res.status(400).json({ success: false, message: 'bookingId, subject and message are required' });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      booking: bookingId,
      subject,
      message
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// Get current user's complaints
exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('booking')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};

// Admin: get all complaints with filters
exports.getAllComplaints = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};

// Admin: respond/update status
exports.respondToComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const update = {};
    if (status) update.status = status;
    if (typeof adminResponse === 'string') {
      update.adminResponse = adminResponse;
      update.respondedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(id, update, { new: true });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};


