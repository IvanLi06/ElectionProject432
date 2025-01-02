'use strict';
const { readAllVotes } = require('../load_scripts/votes');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const votes = await readAllVotes();

    if (!Array.isArray(votes) || votes.length === 0) {
        console.error('No votes to insert or not an array:', votes);
        return; // Exit if there are no valid votes
    }

    // Check existing votes to prevent duplicates
    for (const vote of votes) {
        const existingVote = await queryInterface.sequelize.query(
            `SELECT * FROM "Votes" WHERE "userID" = :userID AND "ballotID" = :ballotID`,
            {
                replacements: { userID: vote.userID, ballotID: vote.ballotID },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        if (existingVote.length === 0) {
            await queryInterface.bulkInsert('Votes', [vote], {});
        } else {
            console.log(`Vote for userID ${vote.userID} and ballotID ${vote.ballotID} already exists, skipping.`);
        }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Votes', null, {});
  }
};