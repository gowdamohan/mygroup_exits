
const { User, UserRegistrationForm, GroupCreate, Labor, NeedyService } = require('../models');
const { Op } = require('sequelize');

const dashboardController = {
  // Get dashboard statistics
  getStats: async (req, res) => {
    try {
      const [
        totalUsers,
        totalGroups,
        totalLaborProfiles,
        totalNeedyServices,
        recentUsers,
        recentGroups
      ] = await Promise.all([
        User.count({ where: { active: true } }),
        GroupCreate.count({ where: { status: 'Active' } }),
        Labor.count({ where: { status: 'Active' } }),
        NeedyService.count({ where: { status: 'Active' } }),
        User.findAll({
          where: { active: true },
          order: [['created_on', 'DESC']],
          limit: 5,
          attributes: ['id', 'first_name', 'last_name', 'email', 'created_on']
        }),
        GroupCreate.findAll({
          where: { status: 'Active' },
          order: [['created_date', 'DESC']],
          limit: 5,
          include: [{ model: User, as: 'creator', attributes: ['first_name', 'last_name'] }]
        })
      ]);

      res.json({
        stats: {
          totalUsers,
          totalGroups,
          totalLaborProfiles,
          totalNeedyServices
        },
        recentUsers,
        recentGroups
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get user dashboard data
  getUserDashboard: async (req, res) => {
    try {
      const userId = req.user.userId;

      const [
        userProfile,
        userGroups,
        userLaborProfiles,
        userNeedyServices
      ] = await Promise.all([
        User.findByPk(userId, {
          include: [{ model: UserRegistrationForm, as: 'profile' }]
        }),
        GroupCreate.findAll({
          where: { created_by: userId },
          limit: 5,
          order: [['created_date', 'DESC']]
        }),
        Labor.findAll({
          where: { user_id: userId },
          limit: 3,
          order: [['created_date', 'DESC']]
        }),
        NeedyService.findAll({
          where: { user_id: userId },
          limit: 5,
          order: [['created_date', 'DESC']]
        })
      ]);

      res.json({
        user: userProfile,
        groups: userGroups,
        laborProfiles: userLaborProfiles,
        needyServices: userNeedyServices
      });
    } catch (error) {
      console.error('User dashboard error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get activity feed
  getActivityFeed: async (req, res) => {
    try {
      const { limit = 20 } = req.query;

      // Get recent activities (this is a simplified version)
      const [recentGroups, recentServices, recentLabor] = await Promise.all([
        GroupCreate.findAll({
          where: { status: 'Active' },
          order: [['created_date', 'DESC']],
          limit: Math.floor(limit / 3),
          include: [{ model: User, as: 'creator', attributes: ['first_name', 'last_name'] }]
        }),
        NeedyService.findAll({
          where: { status: 'Active' },
          order: [['created_date', 'DESC']],
          limit: Math.floor(limit / 3),
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }]
        }),
        Labor.findAll({
          where: { status: 'Active' },
          order: [['created_date', 'DESC']],
          limit: Math.floor(limit / 3),
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }]
        })
      ]);

      // Combine and format activities
      const activities = [
        ...recentGroups.map(group => ({
          id: `group-${group.id}`,
          type: 'group',
          title: `New group created: ${group.group_name}`,
          user: group.creator,
          date: group.created_date,
          data: group
        })),
        ...recentServices.map(service => ({
          id: `service-${service.id}`,
          type: 'service',
          title: `New service request: ${service.service_name}`,
          user: service.user,
          date: service.created_date,
          data: service
        })),
        ...recentLabor.map(labor => ({
          id: `labor-${labor.id}`,
          type: 'labor',
          title: `New labor profile: ${labor.name}`,
          user: labor.user,
          date: labor.created_date,
          data: labor
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);

      res.json({ activities });
    } catch (error) {
      console.error('Activity feed error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = dashboardController;
