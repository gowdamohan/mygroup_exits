
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./User')(sequelize);
const UserRegistrationForm = require('./UserRegistrationForm')(sequelize);
const Country = require('./Country')(sequelize);
const State = require('./State')(sequelize);
const District = require('./District')(sequelize);
const GroupCreate = require('./GroupCreate')(sequelize);
const Labor = require('./Labor')(sequelize);
const NeedyService = require('./NeedyService')(sequelize);
const Logo = require('./Logo')(sequelize);
const HeaderSlider = require('./HeaderSlider')(sequelize);
const Group = require('./Group')(sequelize);
const Category = require('./Category')(sequelize);
const Education = require('./Education')(sequelize);
const Language = require('./Language')(sequelize);
const Profession = require('./Profession')(sequelize);

// Define associations
User.hasOne(UserRegistrationForm, { foreignKey: 'user_id', as: 'profile' });
UserRegistrationForm.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

UserRegistrationForm.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });
UserRegistrationForm.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
UserRegistrationForm.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

Country.hasMany(State, { foreignKey: 'country_id' });
State.belongsTo(Country, { foreignKey: 'country_id', as: 'Country' });
State.hasMany(District, { foreignKey: 'state_id' });
District.belongsTo(State, { foreignKey: 'state_id', as: 'State' });
District.belongsTo(Country, { foreignKey: 'country_id', as: 'Country' });

GroupCreate.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
GroupCreate.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });
GroupCreate.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
GroupCreate.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

Labor.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Labor.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });
Labor.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
Labor.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

NeedyService.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
NeedyService.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });
NeedyService.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
NeedyService.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

// Category associations
Category.belongsTo(User, { foreignKey: 'group_id', as: 'group' });

// Test database connection and sync models
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models without altering existing tables
    await sequelize.sync({ alter: false, force: false });
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.log('Application will continue without database connection.');
  }
};

testConnection();

module.exports = {
  sequelize,
  User,
  UserRegistrationForm,
  Country,
  State,
  District,
  GroupCreate,
  Labor,
  NeedyService,
  Logo,
  HeaderSlider,
  Group,
  Category,
  Education,
  Language,
  Profession
};
