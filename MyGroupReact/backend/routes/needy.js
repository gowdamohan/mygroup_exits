const express = require('express');
const Joi = require('joi');
const { NeedyService, User, Country, State, District } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all needy services
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category = '', location = '', search = '', status = 'Active' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (category) {
      whereClause.service_category = category;
    }
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { service_name: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await NeedyService.findAndCountAll({
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
      services: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalServices: count
    });
  } catch (error) {
    console.error('Get needy services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get needy service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await NeedyService.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    console.error('Get needy service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create needy service request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const createSchema = Joi.object({
      service_name: Joi.string().max(255).required(),
      service_category: Joi.string().max(100).required(),
      sub_category: Joi.string().max(100).allow(''),
      description: Joi.string().max(1000).required(),
      urgency_level: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
      budget_range: Joi.string().max(100).allow(''),
      required_by_date: Joi.date().allow(null),
      country_id: Joi.number().integer().required(),
      state_id: Joi.number().integer().required(),
      district_id: Joi.number().integer().required(),
      address: Joi.string().max(500).allow(''),
      pincode: Joi.string().max(10).allow(''),
      contact_person: Joi.string().max(255).required(),
      contact_phone: Joi.string().max(20).required(),
      contact_email: Joi.string().email().allow(''),
      additional_notes: Joi.string().max(1000).allow(''),
      service_images: Joi.array().items(Joi.string()).allow(null)
    });

    const { error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const service = await NeedyService.create({
      ...req.body,
      user_id: req.user.userId,
      created_date: new Date(),
      status: 'Active'
    });

    const newService = await NeedyService.findByPk(service.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    res.status(201).json({
      message: 'Service request created successfully',
      service: newService
    });
  } catch (error) {
    console.error('Create needy service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update needy service
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await NeedyService.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user owns this service or is admin
    if (service.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateSchema = Joi.object({
      service_name: Joi.string().max(255),
      service_category: Joi.string().max(100),
      sub_category: Joi.string().max(100).allow(''),
      description: Joi.string().max(1000),
      urgency_level: Joi.string().valid('Low', 'Medium', 'High', 'Critical'),
      budget_range: Joi.string().max(100).allow(''),
      required_by_date: Joi.date().allow(null),
      country_id: Joi.number().integer(),
      state_id: Joi.number().integer(),
      district_id: Joi.number().integer(),
      address: Joi.string().max(500).allow(''),
      pincode: Joi.string().max(10).allow(''),
      contact_person: Joi.string().max(255),
      contact_phone: Joi.string().max(20),
      contact_email: Joi.string().email().allow(''),
      additional_notes: Joi.string().max(1000).allow(''),
      service_images: Joi.array().items(Joi.string()).allow(null),
      status: Joi.string().valid('Active', 'Completed', 'Cancelled')
    });

    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    await service.update(req.body);

    const updatedService = await NeedyService.findByPk(service.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: District, as: 'district' }
      ]
    });

    res.json({
      message: 'Service updated successfully',
      service: updatedService
    });
  } catch (error) {
    console.error('Update needy service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete needy service
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await NeedyService.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user owns this service or is admin
    if (service.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete needy service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await NeedyService.findAll({
      attributes: ['service_category'],
      group: ['service_category'],
      raw: true
    });

    const uniqueCategories = [...new Set(categories.map(c => c.service_category))].filter(Boolean);

    res.json({ categories: uniqueCategories });
  } catch (error) {
    console.error('Get service categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;