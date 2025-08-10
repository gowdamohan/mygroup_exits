const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Import admin controller
const adminController = require('../controllers/adminController');

// Dashboard
router.get('/dashboard/stats', authMiddleware, adminMiddleware, adminController.getDashboardStats);

// User Management
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.patch('/users/:userId/toggle-status', authMiddleware, adminMiddleware, adminController.updateUserStatus);

// Group Management
router.get('/groups', authMiddleware, adminMiddleware, adminController.getGroups);

// Labor Management
router.get('/labor', authMiddleware, adminMiddleware, adminController.getLabor);

// Needy Services Management
router.get('/needy', authMiddleware, adminMiddleware, adminController.getNeedyServices);

// Geographic Management
router.get('/countries', authMiddleware, adminMiddleware, adminController.getCountries);
router.get('/states', authMiddleware, adminMiddleware, adminController.getStates);
router.get('/districts', authMiddleware, adminMiddleware, adminController.getDistricts);


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
        'corporate-login',
        'users',
        'groups',
        'labor',
        'needy',
        'countries',
        'states',
        'districts'
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