"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            // Quan hệ với User (người tạo thông báo)
            Notification.belongsTo(models.User, {
                foreignKey: "created_by",
                as: "creator",
            });

            // Quan hệ với bảng notification_recipients
            Notification.hasMany(models.NotificationRecipient, {
                foreignKey: "notification_id",
                as: "recipients",
            });

            // Quan hệ với Event (nếu reference_type là 'event')
            Notification.belongsTo(models.Event, {
                foreignKey: "reference_id",
                constraints: false,
                scope: {
                    reference_type: "event",
                },
                as: "eventReference",
            });

            // Quan hệ với các đối tượng khác (có thể thêm sau)
            // Ví dụ với Blog, HelpRequest, v.v.
        }
    }

    Notification.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.ENUM("event_created", "event_updated", "help_request", "blog_post", "event_summary", "custom"),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            reference_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            reference_type: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            link: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Notification",
            tableName: "notifications",
            timestamps: false, // Vì đã có created_at và không cần updated_at
            indexes: [
                {
                    fields: ["type"],
                },
                {
                    fields: ["created_at"],
                },
            ],
        }
    );

    return Notification;
};
