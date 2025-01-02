'use strict';
const {readAllMembers} = require('../load_scripts/members');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const membersWithSocieties = await readAllMembers();

    const members = membersWithSocieties.map(([user]) => user);
    const insertedUsers = await queryInterface.bulkInsert('Users', members, { 
      returning: true, 
      ignoreDuplicates: true  
    });

    // Create relationship between user and society
    const userSocieties = insertedUsers.map((insertedUser) => {
      // Find the corresponding society in the membersWithSocieties array
      const memberWithSociety = membersWithSocieties.find(([user]) => user.email === insertedUser.email);

      return {
        userID: insertedUser.id,
        societyID: memberWithSociety ? memberWithSociety[1] : null, // Ensure societyID exists
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }).filter(society => society.societyID !== null); // Filter out null societies

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