const express = require('express');
const voteBusinessLogic = require('../business_logic/voteBusinessLogic');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Votes
 *   description: Votes management
 */

/**
 * @swagger
 * /votes/vote:
 *   post:
 *     summary: Submit a user's vote for a ballot
 *     description: Records the user's votes for the specified ballot, including offices and initiatives.
 *     tags:
 *       - Votes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ballotID:
 *                 type: integer
 *                 description: The ID of the ballot being voted on.
 *               userID:
 *                 type: integer
 *                 description: The ID of the user casting the vote.
 *               votes:
 *                 type: object
 *                 properties:
 *                   offices:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: integer
 *                     description: An object where each key is an officeID and the value is an array of candidateIDs.
 *                   initiatives:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: string
 *                     description: An object where each key is an initiativeID and the value is an array of optionIDs.
 *     responses:
 *       200:
 *         description: Votes successfully saved.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: An error occurred while saving the votes.
 */
router.post('/vote', authenticateToken, checkRole(3, 4), voteBusinessLogic.submitVote);


/**
 * @swagger
 * /votes/vote-stats/{ballotID}:
 *   get:
 *     summary: Get the number of people who have voted and not voted in a ballot
 *     description: Returns the number of users who have voted and the number of users who have not voted for the specified ballot.
 *     tags:
 *       - Votes
 *     parameters:
 *       - name: ballotID
 *         in: path
 *         required: true
 *         description: The ID of the ballot to fetch vote stats for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vote stats successfully fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 votedCount:
 *                   type: integer
 *                   description: The number of people who have voted.
 *                 nonVoters:
 *                   type: integer
 *                   description: The number of people who have not voted.
 *       500:
 *         description: An error occurred while fetching vote stats.
 */
router.get('/vote-stats/:ballotID', authenticateToken, checkRole(4), voteBusinessLogic.getVoteStats);

module.exports = router;
