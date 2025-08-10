
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserRegistrationForm = sequelize.define('UserRegistrationForm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'state',
        key: 'id'
      }
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'district',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    occupation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_registration_form',
    timestamps: false
  });

  return UserRegistrationForm;
};
