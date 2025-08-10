const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    identity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    activation_code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    forgotten_password_code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    forgotten_password_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remember_code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last_login: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  return User;
};