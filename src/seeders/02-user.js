'use strict';
const bcrypt = require('bcrypt'); // Make sure to import bcrypt

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@gmail.com',
        password: passwordHash, // hashed password
        userTypeID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@gmail.com',
        password: passwordHash, // hashed password
        userTypeID: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
