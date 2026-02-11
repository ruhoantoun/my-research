"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class NotificationRecipient extends Model {
        static associate(models) {
            // Quan hệ với Notification
            NotificationRecipient.belongsTo(models.Notification, {
                foreignKey: "notification_id",
                as: "notification",
            });

            // Quan hệ với User (người nhận thông báo)
            NotificationRecipient.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "recipient",
            });
        }
    }

    NotificationRecipient.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            notification_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: "notifications",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            is_read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            read_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            assigned_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "NotificationRecipient",
            tableName: "notification_recipients",
            timestamps: false, // Không cần timestamps mặc định
            indexes: [
                {
                    fields: ["user_id", "is_read"],
                },
            ],
        }
    );

    return NotificationRecipient;
};
