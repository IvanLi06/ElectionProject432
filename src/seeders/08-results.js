'use strict';

const { readAllResults } = require('../load_scripts/results');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const results = await readAllResults();
    await queryInterface.bulkInsert('Results', results);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Results', null, {});
  }
};
