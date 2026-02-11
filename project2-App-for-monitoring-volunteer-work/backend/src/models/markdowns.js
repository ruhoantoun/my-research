'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    static associate(models) {
      // Define associations
      Markdown.belongsTo(models.Event, {  // Thay đổi từ Allcode sang Event
        foreignKey: 'eventId',
        targetKey: 'id',     // Thay đổi từ keyName sang id
        as: 'eventData'
      });
      Markdown.belongsTo(models.User, {  // Thay đổi từ Allcode sang Event
        foreignKey: 'userId',
        targetKey: 'id',     // Thay đổi từ keyName sang id
        as: 'userData'
      });
    }
  }

  Markdown.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,    // Thay đổi từ STRING sang INTEGER
      allowNull: true
    },
    eventId: {
      type: DataTypes.INTEGER,    // Thay đổi từ STRING sang INTEGER
      allowNull: true
    },
    contentHTML: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contentMarkdown: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: DataTypes.STRING(255)
  }, {
    sequelize,
    modelName: 'Markdown',
    tableName: 'markdowns',    // Thêm tên bảng cụ thể
    timestamps: true
  });

  return Markdown;
};