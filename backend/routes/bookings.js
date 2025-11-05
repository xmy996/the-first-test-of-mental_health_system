const express = require('express');
const { check, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Consultant = require('../models/Consultant');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all bookings for logged in user
// @route   GET /api/v1/bookings
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Check if user is admin or consultant
    if (req.user.role === 'admin' || req.user.role === 'consultant') {
      // Admin or consultant can see all bookings or their own bookings
      const bookings = req.user.role === 'admin'
        ? await Booking.find().populate('user', 'name email').populate('consultant', 'user')
        : await Booking.find({ consultant: await Consultant.findOne({ user: req.user.id }).select('_id') }).populate('user', 'name email').populate('consultant', 'user');
      
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    }
    
    // Regular user can only see their own bookings
    const bookings = await Booking.find({ user: req.user.id }).populate('consultant', 'user consultationFee');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email').populate('consultant', 'user consultationFee');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Make sure user owns the booking or is admin/consultant
    if (booking.user._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        (req.user.role !== 'consultant' || booking.consultant.user._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
router.post(
  '/',
  [
    check('consultant', 'Consultant ID is required').not().isEmpty(),
    check('consultationType', 'Consultation type is required').not().isEmpty(),
    check('issueType', 'Issue type is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601(),
    check('startTime', 'Start time is required').not().isEmpty(),
    check('endTime', 'End time is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').not().isEmpty(),
    check('amount', 'Amount is required').isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if consultant exists
      const consultant = await Consultant.findById(req.body.consultant);

      if (!consultant) {
        return res.status(404).json({
          success: false,
          error: 'Consultant not found'
        });
      }

      // Check if time slot is available
      const isTimeSlotAvailable = await checkTimeSlotAvailability(
        req.body.consultant,
        req.body.date,
        req.body.startTime,
        req.body.endTime
      );

      if (!isTimeSlotAvailable) {
        return res.status(400).json({
          success: false,
          error: 'The selected time slot is not available'
        });
      }

      // Add user ID to request body
      req.body.user = req.user.id;

      // Create booking
      const booking = await Booking.create(req.body);

      res.status(201).json({
        success: true,
        data: booking
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
);

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private
router.put(
  '/:id/status',
  [
    check('status', 'Status is required').not().isEmpty(),
    check('status', 'Status must be one of: pending, confirmed, cancelled, completed').isIn(['pending', 'confirmed', 'cancelled', 'completed'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      // Make sure user is the booking owner, admin, or the consultant
      if (booking.user.toString() !== req.user.id && 
          req.user.role !== 'admin' && 
          (req.user.role !== 'consultant' || booking.consultant.toString() !== (await Consultant.findOne({ user: req.user.id }).select('_id')).toString())) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this booking'
        });
      }

      // Update booking status
      booking.status = req.body.status;
      
      // If status is cancelled, update payment status to refunded
      if (req.body.status === 'cancelled' && booking.paymentStatus === 'paid') {
        booking.paymentStatus = 'refunded';
      }
      
      await booking.save();

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
);

// @desc    Update booking payment status
// @route   PUT /api/v1/bookings/:id/payment
// @access  Private/Admin
router.put(
  '/:id/payment',
  [
    check('paymentStatus', 'Payment status is required').not().isEmpty(),
    check('paymentStatus', 'Payment status must be one of: pending, paid, refunded').isIn(['pending', 'paid', 'refunded'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      // Make sure user is admin or the booking owner
      if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update payment status'
        });
      }

      // Update payment status
      booking.paymentStatus = req.body.paymentStatus;
      
      // If payment status is paid, update booking status to confirmed
      if (req.body.paymentStatus === 'paid' && booking.status === 'pending') {
        booking.status = 'confirmed';
      }
      
      await booking.save();

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
);

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Make sure user is the booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this booking'
      });
    }

    await booking.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Helper function to check time slot availability
const checkTimeSlotAvailability = async (consultantId, date, startTime, endTime) => {
  try {
    // Parse date
    const bookingDate = new Date(date);
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      consultant: consultantId,
      date: { $gte: bookingDate, $lt: nextDay },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ],
      status: { $nin: ['cancelled'] }
    });

    return overlappingBookings.length === 0;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = router;
