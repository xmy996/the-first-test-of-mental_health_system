const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/v1/users
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          success: false,
          error: 'User already exists'
        });
      }

      // Create user
      user = new User({
        name,
        email,
        password
      });

      await user.save();

      // Create token
      const token = user.getSignedJwtToken();

      res.status(201).json({
        success: true,
        token
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

// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check for user
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Create token
      const token = user.getSignedJwtToken();

      res.status(200).json({
        success: true,
        token
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

// @desc    Get current logged in user
// @route   GET /api/v1/users/me
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update user details
// @route   PUT /api/v1/users/updatedetails
// @access  Private
router.put(
  '/updatedetails',
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const fieldsToUpdate = {};
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.email) fieldsToUpdate.email = req.body.email;
    if (req.body.phone) fieldsToUpdate.phone = req.body.phone;
    if (req.body.bio) fieldsToUpdate.bio = req.body.bio;
    if (req.body.avatar) fieldsToUpdate.avatar = req.body.avatar;

    try {
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: user
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

// @desc    Update password
// @route   PUT /api/v1/users/updatepassword
// @access  Private
router.put(
  '/updatepassword',
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      // Get user from database
      const user = await User.findById(req.user.id).select('+password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if current password matches
      const isMatch = await user.matchPassword(currentPassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Set new password
      user.password = newPassword;
      await user.save();

      // Create new token
      const token = user.getSignedJwtToken();

      res.status(200).json({
        success: true,
        token
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
