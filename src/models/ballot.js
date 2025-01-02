'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ballot extends Model {
    static associate(models) {
      // Define association: A Ballot belongs to a Society
      Ballot.belongsTo(models.Society, {
        foreignKey: 'societyID',
        as: 'society',
        onDelete: 'CASCADE' // If a society is deleted, delete its ballots
      });

      // // Define association: A Ballot has many Results
      // Ballot.hasMany(models.Result, {
      //   foreignKey: 'ballotID',
      //   as: 'results',
      //   onDelete: 'CASCADE'
      // });

      // Define association: A Ballot has many Results
      Ballot.hasMany(models.OfficeResult, {
        foreignKey: 'ballotID',
        as: 'officeResults',
        onDelete: 'CASCADE'
      });
      // Define association: A Ballot has many Results
      Ballot.hasMany(models.InitiativeResult, {
        foreignKey: 'ballotID',
        as: 'initiativeResults',
        onDelete: 'CASCADE'
      });

      // Define association: A Ballot has many Logs
      Ballot.hasMany(models.Log, {
        foreignKey: 'ballotID',
        as: 'logs',
        onDelete: 'CASCADE'
      });

      // Define association: A Ballot has many Votes
      Ballot.hasMany(models.Vote, {
        foreignKey: 'ballotID',
        as: 'votes',
        onDelete: 'CASCADE'
      });

      // a ballot is locked by a user
      Ballot.associate = function (models) {
        // A ballot is locked by a user, so we associate it with the User model
        Ballot.belongsTo(models.User, { foreignKey: 'lockedBy', as: 'lockedUser' });
      };
    }
  }
  Ballot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Ensure auto-increment is enabled
    },
    starttime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endtime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false
    },
    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lockedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users', // Assuming your users are in a 'Users' table
        key: 'id',
      },
    },
    societyID: {  // Add societyID as a foreign key
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Societies', // Name of the referenced table
        key: 'id' // Primary key in the referenced table
      },
      onDelete: 'CASCADE' // Delete ballots when the society is deleted
    }
  }, {
    sequelize,
    modelName: 'Ballot',
  });
  return Ballot;
};
