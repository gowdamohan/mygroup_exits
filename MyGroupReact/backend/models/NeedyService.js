const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NeedyService = sequelize.define('NeedyService', {
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
    service_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    service_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
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
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'needy_service',
    timestamps: false
  });

  return NeedyService;
};