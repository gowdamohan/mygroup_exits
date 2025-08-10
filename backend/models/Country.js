
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Country = sequelize.define('country_tbl', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  country_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  country_code: {
    type: DataTypes.STRING(10)
  },
  flag_image: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Country;
