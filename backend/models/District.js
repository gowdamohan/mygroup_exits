
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const District = sequelize.define('district_tbl', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  state_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'state_tbl',
      key: 'id'
    }
  },
  district_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  district_code: {
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

module.exports = District;
