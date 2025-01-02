'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InitiativeResult extends Model {
    static associate(models) {
      InitiativeResult.belongsTo(models.Ballot, {
        foreignKey: 'ballotID',
        as: 'ballot',
        onDelete: 'CASCADE',
      });
    }
  }
  InitiativeResult.init(
    {
      ballotID: DataTypes.INTEGER,
      initiativeID: DataTypes.INTEGER,
      optionID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'InitiativeResult',
    }
  );
  return InitiativeResult;
};
