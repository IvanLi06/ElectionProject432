const { sendError, sendSuccess } = require('../utils/response');
const userController = require('../controllers/userController');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userController.getAllUsers();
        return sendSuccess(res, 'Users retrieved successfully', users);
    } catch (error) {
        return sendError(res, 'Failed to retrieve users', 500);
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return sendError(res, 'User ID is required', 400);
    }

    try {
        const user = await userController.getUserById(userId);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, 'User retrieved successfully', user);
    } catch (error) {
        return sendError(res, 'Failed to retrieve user', 500);
    }
};

// Register User
const registerUser = async (req, res) => {
    const { firstname, lastname, email, password, userTypeID } = req.body;

    // Input Validation
    if (!firstname || !lastname || !email || !password || !userTypeID) {
        return sendError(res, 400, 'All fields are required: firstname, lastname, email, password, userTypeID.');
    }

    // Validate userTypeID range
    if (typeof userTypeID !== 'number' || userTypeID < 1 || userTypeID > 4) {
        return sendError(res, 400, 'Invalid userTypeID. It must be a number between 1 and 4.');
    }

    // TODO validate password number, uppercase, lowercase, special character 

    // Pass the request to the controller
    try {
        const result = await userController.registerUser({ firstname, lastname, email, password, userTypeID });
        return sendSuccess(res, 201, 'User registered successfully.', result);
    } catch (error) {
        return sendError(res, error.status || 500, error.message || 'Error registering user.');
    }
};



module.exports = {
    getAllUsers,
    getUserById,
    registerUser,
};
