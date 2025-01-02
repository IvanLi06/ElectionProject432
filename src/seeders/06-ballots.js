'use strict';
const { readAllBallots } = require('../load_scripts/ballots');
const { readAllCandidates } = require('../load_scripts/candidates');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const ballots = await readAllBallots();
    await queryInterface.bulkInsert('Ballots', ballots, {});
    await readAllCandidates();
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ballots', null, {});
  }
};
