
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const Education = sequelize.define('Education', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    education: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'education',
    timestamps: false
  });

  return Education;
};
