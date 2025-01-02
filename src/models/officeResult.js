'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OfficeResult extends Model {
    static associate(models) {
      // Define association: A Result belongs to a Ballot
      OfficeResult.belongsTo(models.Ballot, {
        foreignKey: 'ballotID',
        as: 'ballot',
        onDelete: 'CASCADE'
      });
    }
  }
  OfficeResult.init({
    ballotID: DataTypes.INTEGER,
    officeID: DataTypes.INTEGER,
    candidateID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'OfficeResult',
  });
  return OfficeResult;
};
