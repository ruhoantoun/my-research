"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // User thuộc về một Position trong Allcode
            User.belongsTo(models.Allcode, {
                foreignKey: "genderCode",
                targetKey: "keyName",
                as: "genderData",
            });
            User.belongsTo(models.Allcode, {
                foreignKey: "roleCode",
                targetKey: "keyName",
                as: "roleData",
            });
            User.belongsTo(models.Allcode, {
                foreignKey: "positionCode",
                targetKey: "keyName",
                as: "positionData",
            });

            // Thêm quan hệ với Markdown
            User.hasOne(models.Markdown, {
                foreignKey: "userId",
                sourceKey: "id",
                as: "userMarkdown",
            });
        }
    }
    7;
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            address: DataTypes.TEXT,
            phoneNumber: {
                type: DataTypes.STRING(20),
                unique: true,
            },
            genderCode: DataTypes.STRING(50),
            roleCode: DataTypes.STRING(50),
            positionCode: DataTypes.STRING(50),
            image: DataTypes.STRING(255),
            otp: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "Mã OTP dùng cho xác thực đặt lại mật khẩu",
            },
            otpExpiry: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "Thời gian hết hạn của mã OTP",
            },
            otpAttempts: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: "Số lần thử nhập OTP sai",
            },
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
