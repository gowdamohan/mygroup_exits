
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics (Admin only)
router.get('/stats', authMiddleware, adminMiddleware, dashboardController.getStats);

// Get user dashboard data
router.get('/user', authMiddleware, dashboardController.getUserDashboard);

// Get activity feed
router.get('/activity', authMiddleware, dashboardController.getActivityFeed);

module.exports = router;
