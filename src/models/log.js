'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      // Define composite key association: A Log belongs to a Ballot and a User
      Log.belongsTo(models.Ballot, {
        foreignKey: 'ballotID',
        as: 'ballot',
        onDelete: 'CASCADE'
      });
      Log.belongsTo(models.User, {
        foreignKey: 'userID',
        as: 'user',
        onDelete: 'CASCADE'
      });
    }
  }
  Log.init({
    ballotID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Log',
  });
  return Log;
};
