'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InitiativeResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ballotID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      initiativeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      optionID: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
  async down(queryInterface) {
    await queryInterface.dropTable('InitiativeResults');
  },
};
