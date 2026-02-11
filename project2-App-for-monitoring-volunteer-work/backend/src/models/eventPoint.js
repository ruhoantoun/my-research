'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventPoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        EventPoint.belongsTo(models.User, {
          foreignKey: 'userId'
        });
        EventPoint.belongsTo(models.Event, {
          foreignKey: 'eventId'
        });
        EventPoint.belongsTo(models.Allcode, {
          foreignKey: 'typeEventCode',
          targetKey: 'keyName',
          as: 'eventType'
        });
      }
  };
  EventPoint.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    typeEventCode: DataTypes.STRING(50),
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'EventPoint',
  });
  return EventPoint;
};