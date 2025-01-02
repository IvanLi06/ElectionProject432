const { sendError, sendSuccess } = require('../utils/response');
const societyController = require('../controllers/societyController');

exports.getAllSocieties = async (req, res) => {
    try {
        const societies = await societyController.getAllSocieties();
        if (!societies || societies.length === 0) {
            return sendError(res, 'No societies found', 404);
        }
        return sendSuccess(res, 'All societies retrieved successfully', societies);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching societies');
    }
};

exports.getSocietyById = async (req, res) => {
    const { societyId } = req.params;
    try {
        const society = await societyController.getSocietyById(societyId);
        if (!society) {
            return sendError(res, 'Society not found', 404);
        }
        return sendSuccess(res, 'Society retrieved successfully', society);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching society by ID');
    }
};

exports.getSocietiesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const societies = await societyController.getSocietiesByUserId(userId);
        if (!societies || societies.length === 0) {
            return sendError(res, 'No societies found for this user', 404);
        }
        return sendSuccess(res, 'Societies retrieved successfully for the user', societies);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching societies for the user');
    }
};
