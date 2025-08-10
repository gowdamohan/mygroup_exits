const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { User, UserRegistrationForm, Country, State, District } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        {
          model: UserRegistrationForm,
          as: 'profile',
          include: [
            { model: Country, as: 'country' },
            { model: State, as: 'state' },
            { model: District, as: 'district' }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updateSchema = Joi.object({
      first_name: Joi.string().max(50),
      last_name: Joi.string().max(50),
      phone: Joi.string().max(20),
      address: Joi.string().max(500),
      country_id: Joi.number().integer(),
      state_id: Joi.number().integer(),
      district_id: Joi.number().integer(),
      pincode: Joi.string().max(10),
      date_of_birth: Joi.date(),
      gender: Joi.string().valid('Male', 'Female', 'Other'),
      occupation: Joi.string().max(100),
      education: Joi.string().max(100),
      about: Joi.string().max(1000)
    });

    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic user info
    const { first_name, last_name, phone, ...profileData } = req.body;
    if (first_name || last_name || phone) {
      await user.update({ first_name, last_name, phone });
    }

    // Update or create profile
    let profile = await UserRegistrationForm.findOne({
      where: { user_id: user.id }
    });

    if (profile) {
      await profile.update(profileData);
    } else {
      profile = await UserRegistrationForm.create({
        user_id: user.id,
        ...profileData
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user: await User.findByPk(user.id, {
        include: [{ model: UserRegistrationForm, as: 'profile' }]
      })
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const schema = Joi.object({
      current_password: Joi.string().required(),
      new_password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await user.update({ password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search ? {
      [require('sequelize').Op.or]: [
        { first_name: { [require('sequelize').Op.like]: `%${search}%` } },
        { last_name: { [require('sequelize').Op.like]: `%${search}%` } },
        { email: { [require('sequelize').Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_on', 'DESC']],
      include: [{ model: UserRegistrationForm, as: 'profile' }]
    });

    res.json({
      users: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalUsers: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;