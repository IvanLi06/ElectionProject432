const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); // Import userController
const { authenticateToken, checkRole } = require('../middleware/authMiddleware'); // Import middleware for token authentication
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               userTypeID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Email already exists
 *       '500':
 *         description: Error registering user
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "jwt.token.here"
 *       '401':
 *         description: Invalid email or password
 *       '500':
 *         description: Error logging in
 */


// Register a new user - only allowed for Admins and Employees
router.post('/register', authenticateToken, checkRole('admin', 'employee'), userController.registerUser);

router.post('/login', authController.login);

module.exports = router;
