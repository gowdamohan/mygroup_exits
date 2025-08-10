
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const adminRoutes = require('./admin');
const usersRoutes = require('./users');
const groupsRoutes = require('./groups');
const laborRoutes = require('./labor');
const needyRoutes = require('./needy');
const geographicRoutes = require('./geographic');

// Apply routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/labor', laborRoutes);
router.use('/needy', needyRoutes);
router.use('/geographic', geographicRoutes);

// API health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'My Group API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
