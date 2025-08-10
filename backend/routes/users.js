
const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const User = require('../models/User');
const UserRegistrationForm = require('../models/UserRegistrationForm');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userProfile = await UserRegistrationForm.findOne({
      where: { user_id: req.user.id }
    });

    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        phone: req.user.phone
      },
      profile: userProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone,
      full_name,
      gender,
      dob,
      mobile,
      alternate_mobile,
      address,
      pincode,
      country_id,
      state_id,
      district_id,
      profession_id,
      education_id
    } = req.body;

    // Update basic user info
    await req.user.update({
      first_name,
      last_name,
      phone
    });

    // Update or create extended profile
    const [profile] = await UserRegistrationForm.findOrCreate({
      where: { user_id: req.user.id },
      defaults: {
        user_id: req.user.id,
        full_name,
        gender,
        dob,
        mobile,
        alternate_mobile,
        email_id: req.user.email,
        address,
        pincode,
        country_id,
        state_id,
        district_id,
        profession_id,
        education_id
      }
    });

    if (profile) {
      await profile.update({
        full_name,
        gender,
        dob,
        mobile,
        alternate_mobile,
        address,
        pincode,
        country_id,
        state_id,
        district_id,
        profession_id,
        education_id,
        updated_date: new Date()
      });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, req.user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await req.user.update({ password: hashedNewPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'active', 'created_on', 'last_login'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_on', 'DESC']]
    });

    res.json({
      users: users.rows,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page),
      total: users.count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;
