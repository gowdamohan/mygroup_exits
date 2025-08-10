
const express = require('express');
const GroupCreate = require('../models/GroupCreate');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all groups
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = { status: 'active' };
    if (search) {
      whereClause.group_name = {
        [require('sequelize').Op.like]: `%${search}%`
      };
    }

    const groups = await GroupCreate.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'first_name', 'last_name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_date', 'DESC']]
    });

    res.json({
      groups: groups.rows,
      totalPages: Math.ceil(groups.count / limit),
      currentPage: parseInt(page),
      total: groups.count
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Server error fetching groups' });
  }
});

// Get group by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const group = await GroupCreate.findOne({
      where: { id, status: 'active' },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'first_name', 'last_name']
      }]
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ message: 'Server error fetching group' });
  }
});

// Create new group (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      group_name,
      group_description,
      group_category_id,
      group_sub_category_id,
      privacy_type
    } = req.body;

    const group = await GroupCreate.create({
      user_id: req.user.id,
      group_name,
      group_description,
      group_category_id,
      group_sub_category_id,
      privacy_type: privacy_type || 'public'
    });

    res.status(201).json({
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Server error creating group' });
  }
});

module.exports = router;
