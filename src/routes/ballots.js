const express = require('express');
const ballotBusinessLogic = require('../business_logic/ballotBusinessLogic');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ballots
 *   description: Ballot management
 */

/**
 * @swagger
 * /ballots:
 *   get:
 *     summary: Retrieve a list of ballots
 *     tags: [Ballots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of ballots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ballot'
 */
router.get('/', authenticateToken, checkRole(1), ballotBusinessLogic.getAllBallots); // Use business logic

/**
 * @swagger
 * /ballots/{ballotId}:
 *   get:
 *     summary: Retrieve a ballot by ID
 *     tags: [Ballots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ballotId
 *         in: path
 *         required: true
 *         description: ID of the ballot to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ballot found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ballot'
 *       404:
 *         description: Ballot not found
 */
router.get('/:ballotId', authenticateToken, checkRole(1, 2), ballotBusinessLogic.getBallotById); // Use business logic

/**
 * @swagger
 * /ballots/society/{societyId}:
 *   get:
 *     summary: Retrieve a ballot by society ID
 *     tags: [Ballots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: societyId
 *         in: path
 *         required: true
 *         description: ID of the society to retrieve ballots from
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ballot found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ballot'
 *       404:
 *         description: Ballot not found
 */
router.get('/society/:societyId', authenticateToken, checkRole(1, 2, 3, 4), ballotBusinessLogic.getActiveBallotsBySocietyID); // Use business logic

/**
 * @swagger
 * /ballots/user/{userId}/accessible:
 *   get:
 *     summary: Retrieve active ballots from societies the user belongs to
 *     tags: [Ballots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Active ballots from accessible societies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ballot'
 *       404:
 *         description: No active ballots found for accessible societies
 */
router.get('/user/:userId/accessible', authenticateToken, checkRole(1, 2), ballotBusinessLogic.getActiveBallotsFromAccessibleSocieties); // Use business logic

/**
 * @swagger
 * /ballots/{ballotId}:
 *   delete:
 *     summary: Delete a ballot by ID
 *     tags: [Ballots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ballotId
 *         in: path
 *         required: true
 *         description: ID of the ballot to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ballot successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ballot deleted successfully
 *       404:
 *         description: Ballot not found
 */
router.delete('/:ballotId', authenticateToken, checkRole(1, 2), ballotBusinessLogic.deleteBallotById); // Use business logic

/**
 * @swagger
 * /ballots/{ballotId}/lock:
 *   post:
 *     summary: Lock a ballot for editing
 *     tags: [Ballots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ballotId
 *         in: path
 *         required: true
 *         description: ID of the ballot to lock
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user locking the ballot
 *                 example: 1
 *     responses:
 *       200:
 *         description: Ballot successfully locked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ballot locked successfully
 *       400:
 *         description: Ballot already locked or cannot be locked
 *       401:
 *         description: Unauthorized, user not authenticated
 *       403:
 *         description: Forbidden, user does not have the necessary permissions
 */
router.post('/:ballotId/lock', authenticateToken, checkRole(1, 2), ballotBusinessLogic.lockBallot); // Use business logic

/**
 * @swagger
 * /ballots/{ballotId}/unlock:
 *   post:
 *     summary: Unlock a ballot after editing
 *     tags: [Ballots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ballotId
 *         in: path
 *         required: true
 *         description: ID of the ballot to unlock
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user unlocking the ballot
 *                 example: 1
 *     responses:
 *       200:
 *         description: Ballot successfully unlocked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ballot unlocked successfully
 *       400:
 *         description: Ballot not found or cannot be unlocked
 *       401:
 *         description: Unauthorized, user not authenticated
 *       403:
 *         description: Forbidden, user does not have the necessary permissions
 */
router.post('/:ballotId/unlock', authenticateToken, checkRole(1, 2), ballotBusinessLogic.unlockBallot); // Use business logic

/**
 * @swagger
 * /ballots/{ballotId}/save:
 *   post:
 *     summary: Save changes to a ballot
 *     tags: [Ballots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ballotId
 *         in: path
 *         required: true
 *         description: ID of the ballot to save changes for
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user making the change
 *                 example: 123
 *               changes:
 *                 type: object
 *                 description: Changes to apply to the ballot
 *                 example: { "title": "New Ballot Title", "description": "Updated description" }
 *               exitAfterSave:
 *                 type: boolean
 *                 description: Whether to unlock the ballot after saving changes
 *                 example: true
 *     responses:
 *       200:
 *         description: Changes saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Changes saved and ballot unlocked"
 *       400:
 *         description: Ballot not found or locked by another user
 *       401:
 *         description: Unauthorized, user not authenticated
 *       403:
 *         description: Forbidden, user does not have the necessary permissions
 *       500:
 *         description: Internal server error
 */
router.post('/:ballotId/save', authenticateToken, checkRole(1, 2), ballotBusinessLogic.saveBallotChanges); // Use business logic

/**
 * @swagger
 * /ballots/create:
 *   post:
 *     summary: Create a new draft ballot for a society
 *     description: Initializes a new ballot and associates it with a society and user.
 *     tags:
 *       - Ballots
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               societyId:
 *                 type: integer
 *                 description: ID of the society to associate the ballot with.
 *               userId:
 *                 type: integer
 *                 description: ID of the user creating the ballot.
 *             required:
 *               - societyId
 *               - userId
 *     responses:
 *       201:
 *         description: Successfully created a ballot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ballot:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the created ballot.
 *                     society_id:
 *                       type: integer
 *                       description: The society ID associated with the ballot.
 *                     user_id:
 *                       type: integer
 *                       description: The user ID who created the ballot.
 *                     title:
 *                       type: string
 *                       description: Title of the ballot.
 *                     description:
 *                       type: string
 *                       description: Description of the ballot.
 *                     status:
 *                       type: string
 *                       description: The current status of the ballot (e.g., draft).
 *       500:
 *         description: Internal server error
 */
router.post('/create', authenticateToken, checkRole(1, 2), ballotBusinessLogic.createBallot); // Use business logic

module.exports = router;
