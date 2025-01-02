'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define association here: A User belongs to a UserType
      User.belongsTo(models.UserType, {
        foreignKey: 'userTypeID',  // Foreign key in the User model
        as: 'userType'  // Alias for the association
      });

      // Define many-to-many association: A User belongs to many Societies
      User.belongsToMany(models.Society, {
        through: 'user_society', // Name of the junction table
        foreignKey: 'userID', // Foreign key on the junction table that refers to User
        otherKey: 'societyID', // Foreign key on the junction table that refers to Society
        as: 'societies' // Alias for the association
      });
    }
  }
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Ensures the field is not null
      unique: true // Ensures the email is unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false // Ensures the field is not null
    },
    userTypeID: {  // foreign key column for UserType
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'UserTypes',  // Name of the table that the key references
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};