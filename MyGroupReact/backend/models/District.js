const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const District = sequelize.define('District', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'state',
        key: 'id'
      }
    }
  }, {
    tableName: 'district',
    timestamps: false
  });

  return District;
};