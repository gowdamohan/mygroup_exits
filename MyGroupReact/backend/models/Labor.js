const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Labor = sequelize.define('Labor', {
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
    labor_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    labor_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    experience_years: {
      type: DataTypes.INTEGER,
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    availability: {
      type: DataTypes.ENUM('available', 'busy', 'unavailable'),
      allowNull: false,
      defaultValue: 'available'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'labor',
    timestamps: false
  });

  return Labor;
};