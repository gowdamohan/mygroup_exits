const express = require('express');
const { Country, State, District } = require('../models');

const router = express.Router();

// Get all countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.findAll({
      where: { status: 'Active' },
      order: [['country_name', 'ASC']]
    });

    res.json({ countries });
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get states by country
router.get('/states/:countryId', async (req, res) => {
  try {
    const states = await State.findAll({
      where: { 
        country_id: req.params.countryId,
        status: 'Active'
      },
      order: [['state_name', 'ASC']]
    });

    res.json({ states });
  } catch (error) {
    console.error('Get states error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get districts by state
router.get('/districts/:stateId', async (req, res) => {
  try {
    const districts = await District.findAll({
      where: { 
        state_id: req.params.stateId,
        status: 'Active'
      },
      order: [['district_name', 'ASC']]
    });

    res.json({ districts });
  } catch (error) {
    console.error('Get districts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all states (for dropdown)
router.get('/states', async (req, res) => {
  try {
    const states = await State.findAll({
      where: { status: 'Active' },
      include: [{ model: Country, attributes: ['country_name'] }],
      order: [['state_name', 'ASC']]
    });

    res.json({ states });
  } catch (error) {
    console.error('Get all states error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all districts (for dropdown)
router.get('/districts', async (req, res) => {
  try {
    const districts = await District.findAll({
      where: { status: 'Active' },
      include: [
        { model: State, attributes: ['state_name'] },
        { model: Country, attributes: ['country_name'] }
      ],
      order: [['district_name', 'ASC']]
    });

    res.json({ districts });
  } catch (error) {
    console.error('Get all districts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;