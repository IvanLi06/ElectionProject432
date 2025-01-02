const bcrypt = require('bcrypt');
const { User } = require('../models');

// Get all users
const getAllUsers = async () => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        throw new Error('Failed to retrieve users');
    }
};

// Get user by ID
const getUserById = async (userId) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return null; // Handle not found case in the business logic
        }

        return user;
    } catch (error) {
        throw new Error('Failed to retrieve user');
    }
};

// Register a new user
const registerUser = async ({ firstname, lastname, email, password, userTypeID }) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw { status: 400, message: 'Email already exists.' };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            userTypeID,
        });

        // Return the created user (excluding sensitive data)
        return {
            id: newUser.id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            userTypeID: newUser.userTypeID,
        };
    } catch (error) {
        throw { status: error.status || 500, message: error.message || 'Error creating user.' };
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    registerUser,
};
