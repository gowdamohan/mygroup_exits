
const { User, UserRegistrationForm, GroupCreate, Labor, NeedyService, Country, State, District, Logo, HeaderSlider, Group, Category, Education, Language, Profession } = require('../models');
const { Op } = require('sequelize');

const adminController = {
  // Dashboard Statistics
  getDashboardStats: async (req, res) => {
    try {
      const [
        totalUsers,
        activeUsers,
        totalGroups,
        activeGroups,
        totalLabor,
        totalNeedy,
        recentUsers,
        recentGroups
      ] = await Promise.all([
        User.count(),
        User.count({ where: { active: true } }),
        GroupCreate.count(),
        GroupCreate.count({ where: { status: 'active' } }),
        Labor.count(),
        NeedyService.count(),
        User.findAll({
          limit: 5,
          order: [['created_on', 'DESC']],
          include: [{ model: UserRegistrationForm, as: 'profile' }]
        }),
        GroupCreate.findAll({
          limit: 5,
          order: [['created_date', 'DESC']],
          include: [
            { model: User, as: 'creator', attributes: ['first_name', 'last_name'] },
            { model: Country, as: 'country', attributes: ['country_name'] },
            { model: State, as: 'state', attributes: ['state_name'] }
          ]
        })
      ]);

      res.json({
        stats: {
          totalUsers,
          activeUsers,
          totalGroups,
          activeGroups,
          totalLabor,
          totalNeedy,
          inactiveUsers: totalUsers - activeUsers,
          pendingGroups: totalGroups - activeGroups
        },
        recentUsers,
        recentGroups
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // User Management
  getUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, role, status } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      if (role && role !== 'all') {
        whereClause.role = role;
      }

      if (status && status !== 'all') {
        whereClause.active = status === 'active';
      }

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        include: [{ 
          model: UserRegistrationForm, 
          as: 'profile',
          include: [
            { model: Country, as: 'country', attributes: ['country_name'] },
            { model: State, as: 'state', attributes: ['state_name'] },
            { model: District, as: 'district', attributes: ['district_name'] }
          ]
        }],
        limit: parseInt(limit),
        offset,
        order: [['created_on', 'DESC']]
      });

      res.json({
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateUserStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const { active } = req.body;

      await User.update(
        { active },
        { where: { id: userId } }
      );

      res.json({ message: 'User status updated successfully' });
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Group Management
  getGroups: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category, status } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { group_name: { [Op.like]: `%${search}%` } },
          { group_description: { [Op.like]: `%${search}%` } }
        ];
      }

      if (category && category !== 'all') {
        whereClause.group_category = category;
      }

      if (status && status !== 'all') {
        whereClause.status = status;
      }

      const { count, rows: groups } = await GroupCreate.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'creator', attributes: ['first_name', 'last_name'] },
          { model: Country, as: 'country', attributes: ['country_name'] },
          { model: State, as: 'state', attributes: ['state_name'] },
          { model: District, as: 'district', attributes: ['district_name'] }
        ],
        limit: parseInt(limit),
        offset,
        order: [['created_date', 'DESC']]
      });

      const groupsWithCreatorName = groups.map(group => ({
        ...group.toJSON(),
        creator_name: group.creator ? `${group.creator.first_name} ${group.creator.last_name}` : 'Unknown',
        country: group.country?.country_name || '',
        state: group.state?.state_name || '',
        district: group.district?.district_name || ''
      }));

      res.json({
        groups: groupsWithCreatorName,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get groups error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Logo Management
  getLogos: async (req, res) => {
    try {
      const logos = await Logo.findAll({
        order: [['id', 'DESC']]
      });
      res.json({ logos });
    } catch (error) {
      console.error('Get logos error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Header Slider Management
  getHeaderSliders: async (req, res) => {
    try {
      const sliders = await HeaderSlider.findAll({
        order: [['id', 'DESC']]
      });
      res.json({ sliders });
    } catch (error) {
      console.error('Get header sliders error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Categories Management
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        order: [['name', 'ASC']]
      });
      res.json({ categories });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, group_id } = req.body;
      const category = await Category.create({ name, group_id });
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Education Management
  getEducations: async (req, res) => {
    try {
      const educations = await Education.findAll({
        order: [['education', 'ASC']]
      });
      res.json({ educations });
    } catch (error) {
      console.error('Get educations error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Language Management
  getLanguages: async (req, res) => {
    try {
      const languages = await Language.findAll({
        order: [['language', 'ASC']]
      });
      res.json({ languages });
    } catch (error) {
      console.error('Get languages error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Profession Management
  getProfessions: async (req, res) => {
    try {
      const professions = await Profession.findAll({
        order: [['profession', 'ASC']]
      });
      res.json({ professions });
    } catch (error) {
      console.error('Get professions error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Labor Management
  getLabor: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category, status } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { labor_name: { [Op.like]: `%${search}%` } },
          { labor_category: { [Op.like]: `%${search}%` } }
        ];
      }

      if (category && category !== 'all') {
        whereClause.labor_category = category;
      }

      if (status && status !== 'all') {
        whereClause.status = status;
      }

      const { count, rows: labor } = await Labor.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] },
          { model: Country, as: 'country', attributes: ['country_name'] },
          { model: State, as: 'state', attributes: ['state_name'] },
          { model: District, as: 'district', attributes: ['district_name'] }
        ],
        limit: parseInt(limit),
        offset,
        order: [['created_date', 'DESC']]
      });

      res.json({
        labor,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get labor error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Needy Services Management
  getNeedyServices: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category, status } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { service_title: { [Op.like]: `%${search}%` } },
          { service_description: { [Op.like]: `%${search}%` } }
        ];
      }

      if (category && category !== 'all') {
        whereClause.service_category = category;
      }

      if (status && status !== 'all') {
        whereClause.status = status;
      }

      const { count, rows: services } = await NeedyService.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] },
          { model: Country, as: 'country', attributes: ['country_name'] },
          { model: State, as: 'state', attributes: ['state_name'] },
          { model: District, as: 'district', attributes: ['district_name'] }
        ],
        limit: parseInt(limit),
        offset,
        order: [['created_date', 'DESC']]
      });

      res.json({
        services,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get needy services error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Geographic Management
  getCountries: async (req, res) => {
    try {
      const countries = await Country.findAll({
        order: [['country_name', 'ASC']]
      });
      res.json({ countries });
    } catch (error) {
      console.error('Get countries error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getStates: async (req, res) => {
    try {
      const { countryId } = req.query;
      let whereClause = {};
      
      if (countryId) {
        whereClause.country_id = countryId;
      }

      const states = await State.findAll({
        where: whereClause,
        include: [{ model: Country, as: 'Country', attributes: ['country_name'] }],
        order: [['state_name', 'ASC']]
      });
      
      res.json({ states });
    } catch (error) {
      console.error('Get states error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getDistricts: async (req, res) => {
    try {
      const { stateId, countryId } = req.query;
      let whereClause = {};
      
      if (stateId) {
        whereClause.state_id = stateId;
      }
      if (countryId) {
        whereClause.country_id = countryId;
      }

      const districts = await District.findAll({
        where: whereClause,
        include: [
          { model: State, as: 'State', attributes: ['state_name'] },
          { model: Country, as: 'Country', attributes: ['country_name'] }
        ],
        order: [['district_name', 'ASC']]
      });
      
      res.json({ districts });
    } catch (error) {
      console.error('Get districts error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = adminController;
