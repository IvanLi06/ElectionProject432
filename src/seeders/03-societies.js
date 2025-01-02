'use strict';
const {readAllSocieties} = require('../load_scripts/societies');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const societies = await readAllSocieties();
    await queryInterface.bulkInsert('Societies', societies, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Societies', null, {});
  }
};
