
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const State = sequelize.define('state_tbl', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    state_name: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'state_tbl'
  });

  return State;
};
