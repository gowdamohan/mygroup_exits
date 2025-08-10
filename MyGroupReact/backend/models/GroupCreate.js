
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GroupCreate = sequelize.define('group_create', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  group_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  group_description: {
    type: DataTypes.TEXT
  },
  group_category_id: {
    type: DataTypes.INTEGER
  },
  group_sub_category_id: {
    type: DataTypes.INTEGER
  },
  group_logo: {
    type: DataTypes.STRING(255)
  },
  group_cover_image: {
    type: DataTypes.STRING(255)
  },
  privacy_type: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'public'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = GroupCreate;
