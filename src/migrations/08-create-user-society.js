'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_society', {
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the Users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      societyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Societies', // Name of the Societies table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_society');
  }
};
