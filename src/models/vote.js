'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    static associate(models) {
      // Define association: A Vote belongs to a User
      Vote.belongsTo(models.User, {
        foreignKey: 'userID',
        as: 'user',
        onDelete: 'CASCADE'
      });

      // Define association: A Vote belongs to a Ballot
      Vote.belongsTo(models.Ballot, {
        foreignKey: 'ballotID',
        as: 'ballot',
        onDelete: 'CASCADE'
      });
    }
  }
  Vote.init(
    {
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Part of composite primary key
      },
      ballotID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Part of composite primary key
      },
      hasVoted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      votedTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
    sequelize,
    modelName: 'Vote',
  });
  return Vote;
};
