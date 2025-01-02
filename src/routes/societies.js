const express = require('express');
const societyBusinessLogic = require('../business_logic/societyBusinessLogic');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Societies
 *   description: Society management
 */

/**
 * @swagger
 * /societies:
 *   get:
 *     summary: Retrieve a list of societies
 *     tags: [Societies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of societies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Society'
 */
router.get('/', authenticateToken, checkRole(1, 2), societyBusinessLogic.getAllSocieties); // Use business logic

/**
 * @swagger
 * /societies/{societyId}:
 *   get:
 *     summary: Retrieve a society
 *     tags: [Societies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: societyId
 *         in: path
 *         required: true
 *         description: ID of society
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Society found
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Society'
 *       404:
 *         description: Society not found
 */
router.get('/:societyId', authenticateToken, checkRole(1, 2), societyBusinessLogic.getSocietyById); // Use business logic

/**
 * @swagger
 * /societies/user/{userId}:
 *   get:
 *     summary: Retrieve a user's society/societies IDs
 *     tags: [Societies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve the societies from
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of societies IDs where the user belongs to
 *         schema:
 *              type: array
 *              items:
 *                  type: integer
 *       404:
 *         description: Societies not found
 */
router.get('/user/:userId', authenticateToken, checkRole(1, 2, 3, 4), societyBusinessLogic.getSocietiesByUserId); // Use business logic

module.exports = router;
