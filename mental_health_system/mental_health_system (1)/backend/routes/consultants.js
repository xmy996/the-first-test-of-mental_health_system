const express = require('express');
const { check, validationResult } = require('express-validator');
const Consultant = require('../models/Consultant');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all consultants
// @route   GET /api/v1/consultants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const consultants = await Consultant.find().populate('user', 'name email avatar');

    res.status(200).json({
      success: true,
      count: consultants.length,
      data: consultants
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single consultant
// @route   GET /api/v1/consultants/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const consultant = await Consultant.findById(req.params.id).populate('user', 'name email avatar');

    if (!consultant) {
      return res.status(404).json({
        success: false,
        error: 'Consultant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: consultant
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new consultant profile
// @route   POST /api/v1/consultants
// @access  Private
router.post(
  '/',
  [
    check('specialty', 'Specialty is required').isArray({ min: 1 }),
    check('education', 'Education background is required').not().isEmpty(),
    check('experience', 'Years of experience is required').isInt({ min: 0 }),
    check('certification', 'Certifications are required').isArray({ min: 1 }),
    check('introduction', 'Introduction is required').not().isEmpty(),
    check('consultationFee', 'Consultation fee is required').isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user already has a consultant profile
      let consultant = await Consultant.findOne({ user: req.user.id });

      if (consultant) {
        return res.status(400).json({
          success: false,
          error: 'User already has a consultant profile'
        });
      }

      // Add user ID to request body
      req.body.user = req.user.id;

      // Create consultant profile
      consultant = await Consultant.create(req.body);

      // Update user role to consultant
      await User.findByIdAndUpdate(req.user.id, { role: 'consultant' });

      res.status(201).json({
        success: true,
        data: consultant
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

// @desc    Update consultant profile
// @route   PUT /api/v1/consultants
// @access  Private
router.put(
  '/',
  [
    check('specialty', 'Specialty must be an array').optional().isArray(),
    check('experience', 'Years of experience must be a positive number').optional().isInt({ min: 0 }),
    check('certification', 'Certifications must be an array').optional().isArray(),
    check('consultationFee', 'Consultation fee must be a positive number').optional().isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let consultant = await Consultant.findOne({ user: req.user.id });

      if (!consultant) {
        return res.status(404).json({
          success: false,
          error: 'Consultant profile not found'
        });
      }

      // Update consultant profile
      consultant = await Consultant.findOne.findByIdAndUpdate(consultant._id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: consultant
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

// @desc    Delete consultant profile
// @route   DELETE /api/v1/consultants
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const consultant = await Consultant.findOne.findOne({ user: req.user.id });

    if (!consultant) {
      return res.status(404).json({
        success: false,
        error: 'Consultant profile not found'
      });
    }

    await consultant.remove();

    // Update user role back to user
    await User.findByIdAndUpdate(req.user.id, { role: 'user' });

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

// @desc    Get consultant availability
// @route   GET /api/v1/consultants/:id/availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const consultant = await Consultant.findById(req.params.id);

    if (!consultant) {
      return res.status(404).json({
        success: false,
        error: 'Consultant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: consultant.availability
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update consultant availability
// @route   PUT /api/v1/consultants/availability
// @access  Private
router.put(
  '/availability',
  [
    check('availability', 'Availability is required').isArray({ min: 1 }),
    check('availability.*.day', 'Day is required').not().isEmpty(),
    check('availability.*.timeSlots', 'Time slots are required').isArray({ min: 1 }),
    check('availability.*.timeSlots.*.startTime', 'Start time is required').not().isEmpty(),
    check('availability.*.timeSlots.*.endTime', 'End time is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let consultant = await Consultant.findOne({ user: req.user.id });

      if (!consultant) {
        return res.status(404).json({
          success: false,
          error: 'Consultant profile not found'
        });
      }

      // Update availability
      consultant.availability = req.body.availability;
      await consultant.save();

      res.status(200).json({
        success: true,
        data: consultant.availability
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

module.exports = router;
