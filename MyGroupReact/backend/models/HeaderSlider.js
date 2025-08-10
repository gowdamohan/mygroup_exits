
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const HeaderSlider = sequelize.define('HeaderSlider', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'header_slider',
    timestamps: false
  });

  return HeaderSlider;
};
