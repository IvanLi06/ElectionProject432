'use strict';
const {readAllEmployees} = require('../load_scripts/employees');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const employeesWithSocieties = await readAllEmployees();
    
    const employees = employeesWithSocieties.map((row) => row[0]);
    const societies = employeesWithSocieties.map((row) => row[1]);

    await queryInterface.bulkInsert('Users', employees);

    let userSocieties = [];

    for (let i = 0, l = employees.length; i < l; i++) {
      for (let j = 0, ls = societies[i].length; j < ls; j++) {
        userSocieties.push({
          userID: employees[i].id,
          societyID: parseInt(societies[i][j]),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }
    
    // Insert user-society relationships
    if (userSocieties.length > 0) {
      await queryInterface.bulkInsert('user_society', userSocieties);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('user_society', null, {});
  }
};