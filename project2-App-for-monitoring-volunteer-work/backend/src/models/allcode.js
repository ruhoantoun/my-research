'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Allcode.hasMany(models.User, {
            foreignKey: 'genderCode',
            sourceKey: 'keyName',
            as: 'genderData'
          });
          Allcode.hasMany(models.User, {
            foreignKey: 'roleCode',
            sourceKey: 'keyName',
            as: 'roleData'
          });
          Allcode.hasMany(models.User, {
            foreignKey: 'positionCode',
            sourceKey: 'keyName',
            as: 'positionData'
          });        // Tên alias phải giống với bên User

    }
  };
  Allcode.init({
    keyName: {
      type: DataTypes.STRING(50),
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    valueEn: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    valueVi: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};