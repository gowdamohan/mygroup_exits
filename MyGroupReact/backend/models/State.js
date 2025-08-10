
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const State = sequelize.define('State', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'country',
        key: 'id'
      }
    }
  }, {
    tableName: 'state',
    timestamps: false
  });

  return State;
};
