'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        EventRegistration.belongsTo(models.Event, {
          foreignKey: 'eventId'
        });
        EventRegistration.belongsTo(models.User, {
          foreignKey: 'userId'
        });
        EventRegistration.belongsTo(models.Allcode, {
          foreignKey: 'statusCostCode',
          targetKey: 'keyName',
          as: 'statusCost'
        });
        EventRegistration.belongsTo(models.Allcode, {
          foreignKey: 'payMethodCode',
          targetKey: 'keyName',
          as: 'payMethod'
        });
      }
  };
  EventRegistration.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    statusCostCode: DataTypes.STRING(50),
    payMethodCode: DataTypes.STRING(50),
        notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },

     // Thêm các trường mới cho điểm danh
    attendanceStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: 'Trạng thái điểm danh: 0 - Chưa điểm danh, 1 - Đã điểm danh'
    },
    attendanceTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: 'Thời gian điểm danh'
    }
  }, {
    sequelize,
    modelName: 'EventRegistration',
    timestamps: false
  });
  return EventRegistration;
};