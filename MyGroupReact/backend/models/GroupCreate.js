
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GroupCreate = sequelize.define('GroupCreate', {
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
    group_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    group_type: {
      type: DataTypes.STRING(50),
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
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
    tableName: 'group_create',
    timestamps: false
  });

  return GroupCreate;
};
