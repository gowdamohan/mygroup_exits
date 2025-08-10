
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NeedyService = sequelize.define('NeedyService', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    urgency: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    requester_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    requester_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    requester_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    location: {
      type: DataTypes.STRING(200),
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
    requested_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completed_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'needy_client_services_details',
    timestamps: false,
    hooks: {
      beforeUpdate: (service) => {
        service.updated_at = new Date();
      },
    },
  });

  // Associations
  NeedyService.associate = (models) => {
    NeedyService.belongsTo(models.User, {
      foreignKey: 'assigned_to',
      as: 'assignedUser',
    });
    NeedyService.belongsTo(models.District, {
      foreignKey: 'district_id',
      as: 'district',
    });
    NeedyService.belongsTo(models.State, {
      foreignKey: 'state_id',
      as: 'state',
    });
    NeedyService.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country',
    });
  };

  // Instance methods
  NeedyService.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    
    // Add computed fields
    values.requesterName = values.requester_name;
    values.requesterPhone = values.requester_phone;
    values.requesterEmail = values.requester_email;
    values.requestedDate = values.requested_date;
    values.completedDate = values.completed_date;
    values.createdAt = values.created_at;
    values.updatedAt = values.updated_at;
    
    if (values.assignedUser) {
      values.assignedTo = {
        id: values.assignedUser.id,
        name: values.assignedUser.name,
      };
    }
    
    return values;
  };

  return NeedyService;
};
