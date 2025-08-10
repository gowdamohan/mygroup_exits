
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const District = sequelize.define('district_tbl', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    district_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'state_tbl',
        key: 'id'
      }
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'country_tbl',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'district_tbl'
  });

  return District;
};
