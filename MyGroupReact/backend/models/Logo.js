
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const Logo = sequelize.define('Logo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'logo',
    timestamps: false
  });

  return Logo;
};
