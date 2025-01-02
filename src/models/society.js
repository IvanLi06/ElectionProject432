'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Society extends Model {
    static associate(models) {
      // Define many-to-many association: A Society belongs to many Users
      Society.belongsToMany(models.User, {
        through: 'user_society', // Name of the junction table
        foreignKey: 'societyID', // Foreign key on the junction table that refers to Society
        otherKey: 'userID', // Foreign key on the junction table that refers to User
        as: 'users' // Alias for the association
      });

      // Define association: A Society has many Ballots
      Society.hasMany(models.Ballot, {
        foreignKey: 'societyID',
        as: 'ballots',
        onDelete: 'CASCADE' // If a society is deleted, delete its ballots
      });
    }
  }
  Society.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    abbrev: {
      type: DataTypes.STRING,
      allowNull: false
    },
    research_area: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Society',
  });
  return Society;
};
