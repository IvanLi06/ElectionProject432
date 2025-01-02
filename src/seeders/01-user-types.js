'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UserTypes', [
      { description: 'admin', permissions: JSON.stringify({ canCreate: true, canEdit: true, canDelete: true, canSeeReports: true }), createdAt: new Date(), updatedAt: new Date() },
      { description: 'employee', permissions: JSON.stringify({ canCreate: true, canEdit: true, canDelete: true }), createdAt: new Date(), updatedAt: new Date() },
      { description: 'member', permissions: JSON.stringify({ canVote: true}), createdAt: new Date(), updatedAt: new Date() },
      { description: 'officer', permissions: JSON.stringify({ canVote: true, canSeeElectionReports: true}), createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserTypes', null, {});
  }
};
