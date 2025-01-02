'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Votes', {
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false,
        primaryKey: true
      },
      ballotID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ballots',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
        primaryKey: true
      },
      hasVoted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      votedTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Votes');
  }
};
