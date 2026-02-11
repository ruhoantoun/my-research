'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HelpRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // You can define associations if needed
      // For example, if assigned_to refers to a user ID:
      // HelpRequest.belongsTo(models.User, { foreignKey: 'assigned_to', as: 'assignedUser' });
    }
  }

  HelpRequest.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    organization: {
      type: DataTypes.STRING(100)
    },
    help_type: {
      type: DataTypes.ENUM('academic', 'financial', 'mental', 'technical', 'facility', 'documents', 'other'),
      allowNull: false
    },
    urgency_level: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false
    },
    available_time: {
      type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'anytime', 'weekend')
    },
    contact_method: {
      type: DataTypes.ENUM('email', 'phone', 'messenger', 'zalo', 'meeting')
    },
    problem_detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attempted_solutions: {
      type: DataTypes.TEXT
    },
    additional_info: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'closed'),
      defaultValue: 'pending'
    },
    assigned_to: {
      type: DataTypes.STRING(100)
    }
  }, {
    sequelize,
    modelName: 'HelpRequest',
    tableName: 'helprequests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['email'] },
      { fields: ['status'] },
      { fields: ['created_at'] }
    ]
  });

  return HelpRequest;
};