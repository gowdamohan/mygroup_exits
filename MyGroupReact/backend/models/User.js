const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'moderator'),
      defaultValue: 'user',
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    activation_selector: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    activation_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    forgotten_password_selector: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    forgotten_password_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    forgotten_password_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    remember_selector: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    remember_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    last_login: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
        user.created_on = Math.floor(Date.now() / 1000);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  // Instance methods
  User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.activation_selector;
    delete values.activation_code;
    delete values.forgotten_password_selector;
    delete values.forgotten_password_code;
    delete values.forgotten_password_time;
    delete values.remember_selector;
    delete values.remember_code;

    // Add computed fields
    values.name = `${values.first_name} ${values.last_name}`;
    values.createdAt = new Date(values.created_on * 1000);
    values.updatedAt = new Date(values.created_on * 1000);
    values.lastLogin = values.last_login ? new Date(values.last_login * 1000) : null;
    values.isActive = values.active;

    return values;
  };

  return User;
};