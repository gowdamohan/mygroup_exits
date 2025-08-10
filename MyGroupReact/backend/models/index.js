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

// Define associations
User.hasOne(UserRegistrationForm, { foreignKey: 'user_id', as: 'profile' });
UserRegistrationForm.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

UserRegistrationForm.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });
UserRegistrationForm.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
UserRegistrationForm.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

Country.hasMany(State, { foreignKey: 'country_id' });
State.belongsTo(Country, { foreignKey: 'country_id' });
State.hasMany(District, { foreignKey: 'state_id' });
District.belongsTo(State, { foreignKey: 'state_id' });
District.belongsTo(Country, { foreignKey: 'country_id' });

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

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
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
  NeedyService
};