
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Admin dashboard stats based on user role
router.get('/dashboard-stats', authMiddleware, async (req, res) => {
  try {
    const { group_id, username } = req.user;
    let stats = {};

    if (group_id === 0) {
      // Super Admin stats
      stats = {
        totalGroups: 12,
        totalUsers: 1234,
        activeCategories: 8,
        totalAds: 45,
        recentActivities: [
          'New user registered',
          'Group created',
          'Advertisement approved'
        ]
      };
    } else {
      switch (username) {
        case 'mymedia':
          stats = {
            mediaClients: 89,
            godClients: 23,
            activeChannels: 15,
            totalContent: 456
          };
          break;
        case 'myneedy':
          stats = {
            needyClients: 156,
            activeServices: 34,
            completedOrders: 89,
            pendingRequests: 12
          };
          break;
        case 'myunions':
          stats = {
            memberApplications: 67,
            directorApplications: 12,
            staffApplications: 8,
            totalMembers: 234
          };
          break;
        default:
          stats = {
            groupMembers: 45,
            activeAds: 8,
            totalRevenue: 1234
          };
      }
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get menu items based on user role
router.get('/menu-items', authMiddleware, async (req, res) => {
  try {
    const { group_id, username } = req.user;
    let menuItems = ['dashboard'];

    if (group_id === 0) {
      // Super Admin menu
      menuItems = [
        'dashboard',
        'profile',
        'content',
        'create-category',
        'my-ads',
        'corporate-login'
      ];
    } else {
      // Group-specific menus
      menuItems = ['dashboard', 'advertisement'];
      
      if (username === 'mymedia') {
        menuItems.push('media-clients', 'god-clients');
      } else if (username === 'myneedy') {
        menuItems.push('needy-clients');
      } else if (username === 'myunions') {
        menuItems.push('union-applications', 'database');
      }
    }

    res.json({ menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

module.exports = router;
