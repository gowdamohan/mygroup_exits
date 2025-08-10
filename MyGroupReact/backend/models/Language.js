
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const Language = sequelize.define('Language', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    language: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'language',
    timestamps: false
  });

  return Language;
};
