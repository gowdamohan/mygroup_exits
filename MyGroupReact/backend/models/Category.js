
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'category',
    timestamps: false
  });

  return Category;
};
