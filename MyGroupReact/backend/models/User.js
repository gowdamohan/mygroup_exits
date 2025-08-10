
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(254),
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
      type: DataTypes.BOOLEAN,
      allowNull: true
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
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    display_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    profile_img: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'client', 'client_god', 'corporate', 'head_office', 'regional', 'branch', 'labor', 'groups'),
      defaultValue: 'client'
    }
  }, {
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['username']
      }
    ]
  });

  return User;
};
