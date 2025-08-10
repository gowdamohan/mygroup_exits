
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip_address: {
    type: DataTypes.STRING(45)
  },
  username: {
    type: DataTypes.STRING(100),
    unique: true
  },
  password: {
    type: DataTypes.STRING(255)
  },
  email: {
    type: DataTypes.STRING(254),
    unique: true,
    allowNull: false
  },
  activation_selector: {
    type: DataTypes.STRING(255)
  },
  activation_code: {
    type: DataTypes.STRING(255)
  },
  forgotten_password_selector: {
    type: DataTypes.STRING(255)
  },
  forgotten_password_code: {
    type: DataTypes.STRING(255)
  },
  forgotten_password_time: {
    type: DataTypes.INTEGER
  },
  remember_selector: {
    type: DataTypes.STRING(255)
  },
  remember_code: {
    type: DataTypes.STRING(255)
  },
  created_on: {
    type: DataTypes.INTEGER
  },
  last_login: {
    type: DataTypes.INTEGER
  },
  active: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  first_name: {
    type: DataTypes.STRING(50)
  },
  last_name: {
    type: DataTypes.STRING(50)
  },
  company: {
    type: DataTypes.STRING(100)
  },
  phone: {
    type: DataTypes.STRING(20)
  }
});

module.exports = User;
