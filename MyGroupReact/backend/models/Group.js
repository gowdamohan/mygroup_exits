
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    background_color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    header_ads1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    header_ads2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    header_ads3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    side_ads: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    main_ads: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    header_ads_url_1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    header_ads_url_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    header_ads_url_3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    side_ads_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    main_ads_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    side_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'group',
    timestamps: false
  });

  return Group;
};
