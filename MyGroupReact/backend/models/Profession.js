
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const Profession = sequelize.define('Profession', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profession: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'profession',
    timestamps: false
  });

  return Profession;
};
