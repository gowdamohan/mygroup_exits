const express = require('express');
const Joi = require('joi');
const { Labor, User, Country, State, District } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all labor profiles
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category = '', location = '', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { status: 'Active' };

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${search}%` } },
        { skills: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Labor.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_date', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    res.json({
      laborProfiles: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProfiles: count
    });
  } catch (error) {
    console.error('Get labor profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get labor profile by ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await Labor.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Labor profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get labor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create labor profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const createSchema = Joi.object({
      name: Joi.string().max(255).required(),
      category: Joi.string().max(100).required(),
      sub_category: Joi.string().max(100).allow(''),
      skills: Joi.string().required(),
      experience_years: Joi.number().integer().min(0).max(50),
      description: Joi.string().max(1000).allow(''),
      hourly_rate: Joi.number().min(0).allow(null),
      daily_rate: Joi.number().min(0).allow(null),
      monthly_rate: Joi.number().min(0).allow(null),
      availability: Joi.string().valid('Available', 'Busy', 'Not Available').default('Available'),
      country_id: Joi.number().integer().required(),
      state_id: Joi.number().integer().required(),
      district_id: Joi.number().integer().required(),
      address: Joi.string().max(500).allow(''),
      pincode: Joi.string().max(10).allow(''),
      contact_phone: Joi.string().max(20).allow(''),
      contact_email: Joi.string().email().allow(''),
      profile_image: Joi.string().allow(''),
      portfolio_images: Joi.array().items(Joi.string()).allow(null)
    });

    const { error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already has a labor profile
    const existingProfile = await Labor.findOne({
      where: { user_id: req.user.userId }
    });

    if (existingProfile) {
      return res.status(400).json({ message: 'You already have a labor profile' });
    }

    const profile = await Labor.create({
      ...req.body,
      user_id: req.user.userId,
      created_date: new Date(),
      status: 'Active'
    });

    const newProfile = await Labor.findByPk(profile.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    res.status(201).json({
      message: 'Labor profile created successfully',
      profile: newProfile
    });
  } catch (error) {
    console.error('Create labor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update labor profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const profile = await Labor.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Labor profile not found' });
    }

    // Check if user owns this profile or is admin
    if (profile.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateSchema = Joi.object({
      name: Joi.string().max(255),
      category: Joi.string().max(100),
      sub_category: Joi.string().max(100).allow(''),
      skills: Joi.string(),
      experience_years: Joi.number().integer().min(0).max(50),
      description: Joi.string().max(1000).allow(''),
      hourly_rate: Joi.number().min(0).allow(null),
      daily_rate: Joi.number().min(0).allow(null),
      monthly_rate: Joi.number().min(0).allow(null),
      availability: Joi.string().valid('Available', 'Busy', 'Not Available'),
      country_id: Joi.number().integer(),
      state_id: Joi.number().integer(),
      district_id: Joi.number().integer(),
      address: Joi.string().max(500).allow(''),
      pincode: Joi.string().max(10).allow(''),
      contact_phone: Joi.string().max(20).allow(''),
      contact_email: Joi.string().email().allow(''),
      profile_image: Joi.string().allow(''),
      portfolio_images: Joi.array().items(Joi.string()).allow(null),
      status: Joi.string().valid('Active', 'Inactive')
    });

    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    await profile.update(req.body);

    const updatedProfile = await Labor.findByPk(profile.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    res.json({
      message: 'Labor profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update labor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete labor profile
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const profile = await Labor.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Labor profile not found' });
    }

    // Check if user owns this profile or is admin
    if (profile.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await profile.destroy();
    res.json({ message: 'Labor profile deleted successfully' });
  } catch (error) {
    console.error('Delete labor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get labor categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Labor.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const uniqueCategories = [...new Set(categories.map(c => c.category))].filter(Boolean);

    res.json({ categories: uniqueCategories });
  } catch (error) {
    console.error('Get labor categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;