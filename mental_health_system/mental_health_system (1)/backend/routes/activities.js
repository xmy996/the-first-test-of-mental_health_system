const express = require('express');
const { check, validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const ActivityRegistration = require('../models/ActivityRegistration');
const Consultant = require('../models/Consultant');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all activities
// @route   GET /api/v1/activities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const activities = await await Activity.find().populate('facilitator', 'user').populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single activity
// @route   GET /api/v1/activities/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('facilitator', 'user').populate('createdBy', 'name');

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new activity
// @route   POST /api/v1/activities
// @access  Private/Admin/Consultant
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('subCategory', 'Sub-category is required').not().isEmpty(),
    check('facilitator', 'Facilitator is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601(),
    check('startTime', 'Start time is required').not().isEmpty(),
    check('endTime', 'End time is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('capacity', 'Capacity is required').isInt({ min: 1 }),
    check('price', 'Price is required').isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user is admin or consultant
      if (req.user.role !== 'admin' && req.user.role !== 'consultant') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to create activities'
        });
      }

      // Check if facilitator exists
      const facilitator = await Consultant.findById(req.body.facilitator);

      if (!facilitator) {
        return res.status(404).json({
          success: false,
          error: 'Facilitator not found'
        });
      }

      // Add createdBy field
      req.body.createdBy = req.user.id;

      // Create activity
      const activity = await Activity.create(req.body);

      res.status(201).json({
        success: true,
        data: activity
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

// @desc    Update activity
// @route   PUT /api/v1/activities/:id
// @access  Private/Admin/Consultant
router.put(
  '/:id',
  [
    check('title', 'Title must be a string').optional().not().isEmpty(),
    check('description', 'Description must be a string').optional().not().isEmpty(),
    check('category', 'Category must be a string').optional().not().isEmpty(),
    check('subCategory', 'Sub-category must be a string').optional().not().isEmpty(),
    check('date', 'Date must be a valid date').optional().isISO8601(),
    check('startTime', 'Start time must be a string').optional().not().isEmpty(),
    check('endTime', 'End time must be a string').optional().not().isEmpty(),
    check('location', 'Location must be a string').optional().not().isEmpty(),
    check('capacity', 'Capacity must be a positive integer').optional().isInt({ min: 1 }),
    check('price', 'Price must be a positive number').optional().isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let activity = await Activity.findById(req.params.id);

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: 'Activity not found'
        });
      }

      // Check if user is admin or activity creator
      if (req.user.role !== 'admin' && activity.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this activity'
        });
      }

      // If updating facilitator, check if new facilitator exists
      if (req.body.facilitator) {
        const facilitator = await Consultant.findById(req.body.facilitator);

        if (!facilitator) {
          return res.status(404).json({
            success: false,
            error: 'Facilitator not found'
          });
        }
      }

      // Update activity
      activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: activity
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

// @desc    Delete activity
// @route   DELETE /api/v1/activities/:id
// @access  Private/Admin/Consultant
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    // Check if user is admin or activity creator
    if (req.user.role !== 'admin' && activity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this activity'
      });
    }

    // Delete activity registrations
    await ActivityRegistration.deleteMany({ activity: req.params.id });

    // Delete activity
    await activity.remove();

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

// @desc    Register for an activity
// @route   POST /api/v1/activities/:id/register
// @access  Private
router.post(
  '/:id/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('participants', 'Number of participants is required').isInt({ min: 1 }),
    check('paymentMethod', 'Payment method is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const activity = await Activity.findById(req.params.id);

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: 'Activity not found'
        });
      }

      // Check if activity is full
      if (activity.currentParticipants + req.body.participants > activity.capacity) {
        return res.status(400).json({
          success: false,
          error: 'Activity is full'
        });
      }

      // Check if user is already registered
      const existingRegistration = await ActivityRegistration.findOne({
        user: req.user.id,
        activity: req.params.id
      });

      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          error: 'You are already registered for this activity'
        });
      }

      // Calculate total amount
      const amount = activity.price * req.body.participants;

      // Create registration
      const registration = await ActivityRegistration.create({
        user: req.user.id,
        activity: req.params.id,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        participants: req.body.participants,
        note: req.body.note,
        paymentMethod: req.body.paymentMethod,
        amount
      });

      // Update activity current participants
      activity.currentParticipants += req.body.participants;
      await activity.save();

      res.status(201).json({
        success: true,
        data: registration
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

// @desc    Get user activity registrations
// @route   GET /api/v1/activities/registrations
// @access  Private
router.get('/registrations', async (req, res) => {
  try {
    const registrations = await ActivityRegistration.find({ user: req.user.id }).populate('activity', 'title date startTime endTime location');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get activity registrations (for activity creator or admin)
// @route   GET /api/v1/activities/:id/registrations
// @access  Private/Admin/Consultant
router.get('/:id/registrations', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    // Check if user is admin or activity creator
    if (req.user.role !== 'admin' && activity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view registrations for this activity'
      });
    }

    const registrations = await ActivityRegistration.find({ activity: req.params.id }).populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Cancel activity registration
// @route   DELETE /api/v1/activities/:id/registrations/:registrationId
// @access  Private
router.delete('/:id/registrations/:registrationId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    const registration = await ActivityRegistration.findById(req.params.registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    // Check if user is the registrant, admin, or activity creator
    if (registration.user.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        activity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this registration'
      });
    }

    // Update activity current participants
    activity.currentParticipants -= registration.participants;
    await activity.save();

    // Delete registration
    await registration.remove();

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

module.exports = router;
