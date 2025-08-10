
const express = require('express');
const Country = require('../models/Country');
const State = require('../models/State');
const District = require('../models/District');

const router = express.Router();

// Get all countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.findAll({
      where: { status: 'active' },
      order: [['country_name', 'ASC']]
    });
    res.json(countries);
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({ message: 'Server error fetching countries' });
  }
});

// Get states by country
router.get('/states/:countryId', async (req, res) => {
  try {
    const { countryId } = req.params;
    const states = await State.findAll({
      where: { 
        country_id: countryId,
        status: 'active'
      },
      order: [['state_name', 'ASC']]
    });
    res.json(states);
  } catch (error) {
    console.error('Get states error:', error);
    res.status(500).json({ message: 'Server error fetching states' });
  }
});

// Get districts by state
router.get('/districts/:stateId', async (req, res) => {
  try {
    const { stateId } = req.params;
    const districts = await District.findAll({
      where: { 
        state_id: stateId,
        status: 'active'
      },
      order: [['district_name', 'ASC']]
    });
    res.json(districts);
  } catch (error) {
    console.error('Get districts error:', error);
    res.status(500).json({ message: 'Server error fetching districts' });
  }
});

module.exports = router;
