'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A UserType can have many Users
      UserType.hasMany(models.User, {
        foreignKey: 'userTypeID',  // The field in User model
        as: 'users'  // Alias for reverse association
      });
    }
  }
  UserType.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserType',
  });
  return UserType;
};