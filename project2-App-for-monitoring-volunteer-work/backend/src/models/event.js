"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Event.belongsTo(models.Allcode, {
                foreignKey: "typeEventCode",
                targetKey: "keyName",
                as: "eventType",
            });
            Event.belongsTo(models.Allcode, {
                foreignKey: "statusCode",
                targetKey: "keyName",
                as: "status",
            });
            // Thêm quan hệ với Markdown
            Event.hasOne(models.Markdown, {
                foreignKey: "eventId",
                sourceKey: "id",
                as: "eventMarkdown",
            });
        }
    }
    Event.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            typeEventCode: DataTypes.STRING(50),
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            quantityMember: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            cost: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0.0,
            },
            statusCode: DataTypes.STRING(50),
        },
        {
            sequelize,
            modelName: "Event",
        }
    );
    return Event;
};
