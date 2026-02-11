'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventStatistic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        EventStatistic.belongsTo(models.Event, {
          foreignKey: 'eventId'
        });
        EventStatistic.belongsTo(models.Allcode, {
          foreignKey: 'statusCode',
          targetKey: 'keyName',
          as: 'status'
        });
      }
  };
  EventStatistic.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalMembers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalCost: {
      type: DataTypes.DECIMAL(12,2),
      defaultValue: 0.00
    },
    statusCode: DataTypes.STRING(50)
  }, {
    sequelize,
    modelName: 'EventStatistic',
  });
  return EventStatistic;
};