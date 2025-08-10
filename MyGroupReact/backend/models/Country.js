
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sortname: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    phonecode: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'country',
    timestamps: false
  });

  return Country;
};
