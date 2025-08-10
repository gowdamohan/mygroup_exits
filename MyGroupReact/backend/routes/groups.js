const express = require('express');
const Joi = require('joi');
const { GroupCreate, User, Country, State, District } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all groups
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category = '', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }
    if (search) {
      whereClause.group_name = { [require('sequelize').Op.like]: `%${search}%` };
    }

    const { count, rows } = await GroupCreate.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_date', 'DESC']],
      include: [
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    res.json({
      groups: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalGroups: count
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await GroupCreate.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ group });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new group (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const createSchema = Joi.object({
      group_name: Joi.string().max(255).required(),
      description: Joi.string().allow(''),
      category: Joi.string().max(100).required(),
      sub_category: Joi.string().max(100).allow(''),
      group_type: Joi.string().valid('Public', 'Private').default('Public'),
      country_id: Joi.number().integer().required(),
      state_id: Joi.number().integer().required(),
      district_id: Joi.number().integer().required(),
      address: Joi.string().max(500).allow(''),
      pincode: Joi.string().max(10).allow(''),
      contact_phone: Joi.string().max(20).allow(''),
      contact_email: Joi.string().email().allow(''),
      website: Joi.string().uri().allow(''),
      logo_image: Joi.string().allow(''),
      cover_image: Joi.string().allow('')
    });

    const { error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const group = await GroupCreate.create({
      ...req.body,
      created_by: req.user.userId,
      created_date: new Date(),
      status: 'Active'
    });

    const newGroup = await GroupCreate.findByPk(group.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    res.status(201).json({
      message: 'Group created successfully',
      group: newGroup
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update group (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const group = await GroupCreate.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const updateSchema = Joi.object({
      group_name: Joi.string().max(255),
      description: Joi.string().allow(''),
      category: Joi.string().max(100),
      sub_category: Joi.string().max(100).allow(''),
      group_type: Joi.string().valid('Public', 'Private'),
      country_id: Joi.number().integer(),
      state_id: Joi.number().integer(),
      district_id: Joi.number().integer(),
      address: Joi.string().max(500).allow(''),
      pincode: Joi.string().max(10).allow(''),
      contact_phone: Joi.string().max(20).allow(''),
      contact_email: Joi.string().email().allow(''),
      website: Joi.string().uri().allow(''),
      logo_image: Joi.string().allow(''),
      cover_image: Joi.string().allow(''),
      status: Joi.string().valid('Active', 'Inactive')
    });

    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    await group.update(req.body);

    const updatedGroup = await GroupCreate.findByPk(group.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    res.json({
      message: 'Group updated successfully',
      group: updatedGroup
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete group (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const group = await GroupCreate.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    await group.destroy();
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await GroupCreate.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const uniqueCategories = [...new Set(categories.map(c => c.category))].filter(Boolean);

    res.json({ categories: uniqueCategories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;