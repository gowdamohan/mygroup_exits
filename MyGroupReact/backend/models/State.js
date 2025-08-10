
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const State = sequelize.define('state_tbl', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  country_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'country_tbl',
      key: 'id'
    }
  },
  state_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  state_code: {
    type: DataTypes.STRING(10)
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

module.exports = State;
