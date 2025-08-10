
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Labor = sequelize.define('Labor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('skills');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('skills', JSON.stringify(value));
      },
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'district_tbl',
        key: 'id',
      },
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'state_tbl',
        key: 'id',
      },
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'country_tbl',
        key: 'id',
      },
    },
    availability: {
      type: DataTypes.ENUM('available', 'busy', 'unavailable'),
      defaultValue: 'available',
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5,
      },
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    aadhar_front_photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    aadhar_back_photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'labor_profile',
    timestamps: false,
    hooks: {
      beforeUpdate: (labor) => {
        labor.updated_at = new Date();
      },
    },
  });

  // Associations
  Labor.associate = (models) => {
    Labor.belongsTo(models.District, {
      foreignKey: 'district_id',
      as: 'district',
    });
    Labor.belongsTo(models.State, {
      foreignKey: 'state_id',
      as: 'state',
    });
    Labor.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country',
    });
  };

  // Instance methods
  Labor.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    
    // Add computed fields
    values.documents = {
      aadharFront: values.aadhar_front_photo,
      aadharBack: values.aadhar_back_photo,
      photo: values.photo,
    };
    
    values.createdAt = values.created_at;
    values.updatedAt = values.updated_at;
    values.reviewCount = values.review_count;
    
    return values;
  };

  return Labor;
};
