
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserRegistrationForm = sequelize.define('user_registration_form', {
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
  full_name: {
    type: DataTypes.STRING(255)
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other')
  },
  dob: {
    type: DataTypes.DATE
  },
  mobile: {
    type: DataTypes.STRING(20)
  },
  alternate_mobile: {
    type: DataTypes.STRING(20)
  },
  email_id: {
    type: DataTypes.STRING(255)
  },
  address: {
    type: DataTypes.TEXT
  },
  pincode: {
    type: DataTypes.STRING(10)
  },
  country_id: {
    type: DataTypes.INTEGER
  },
  state_id: {
    type: DataTypes.INTEGER
  },
  district_id: {
    type: DataTypes.INTEGER
  },
  profession_id: {
    type: DataTypes.INTEGER
  },
  education_id: {
    type: DataTypes.INTEGER
  },
  profile_pic: {
    type: DataTypes.STRING(255)
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

module.exports = UserRegistrationForm;
