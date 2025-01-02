const { sendError, sendSuccess } = require('../utils/response');
const ballotController = require('../controllers/ballotController');
const Ajv = require('ajv');
const ajv = new Ajv();

exports.getAllBallots = async (req, res) => {
    try {
        const ballots = await ballotController.getAllBallots();
        if (!ballots || ballots.length === 0) {
            return sendError(res, 'No ballots found', 404);
        }
        return sendSuccess(res, 'All ballots retrieved successfully', ballots);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching ballots');
    }
};

exports.getBallotById = async (req, res) => {
    const { ballotId } = req.params;
    try {
        const ballot = await ballotController.getBallotById(ballotId);
        if (!ballot) {
            return sendError(res, 'Ballot not found', 404);
        }
        return sendSuccess(res, 'Ballot retrieved successfully', ballot);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching ballot by ID');
    }
};

exports.getActiveBallotsBySocietyID = async (req, res) => {
    const { societyId } = req.params;
    try {
        const ballots = await ballotController.getActiveBallotsBySocietyID(societyId);
        if (!ballots || ballots.length === 0) {
            return sendError(res, 'No active ballots found for this society', 404);
        }
        return sendSuccess(res, 'Active ballots retrieved successfully', ballots);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching active ballots');
    }
};

exports.getActiveBallotsFromAccessibleSocieties = async (req, res) => {
    const userId = req.params.userId;
    try {
        const ballots = await ballotController.getActiveBallotsFromAccessibleSocieties(userId);
        if (!ballots || ballots.length === 0) {
            return sendError(res, 'No active ballots found for accessible societies', 404);
        }
        return sendSuccess(res, 'Active ballots from accessible societies retrieved successfully', ballots);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching active ballots');
    }
};

exports.deleteBallotById = async (req, res) => {
    const ballotId = req.params.ballotId;
    try {
        const result = await ballotController.deleteBallotById(ballotId);
        if (result === 0) {
            return sendError(res, 'Ballot not found', 404);
        }
        return sendSuccess(res, 'Ballot deleted successfully');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while deleting ballot');
    }
};

exports.lockBallot = async (req, res) => {
    const { ballotId } = req.params;
    const { userId } = req.body;
    if (!userId) {
        return sendError(res, 'User ID is required to lock a ballot.', 400);
    }
    try {
        const result = await ballotController.lockBallot(ballotId, userId);
        return sendSuccess(res, result);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while locking ballot');
    }
};

exports.unlockBallot = async (req, res) => {
    const { ballotId } = req.params;
    const { userId } = req.body;
    if (!userId) {
        return sendError(res, 'User ID is required to unlock a ballot.', 400);
    }
    try {
        const result = await ballotController.unlockBallot(ballotId, userId);
        return sendSuccess(res, result);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while unlocking ballot');
    }
};






// Schema to validate the entire JSON structure
const requestBodySchema = {
    type: 'object',
    properties: {
        userId: { type: 'integer', minimum: 1 },
        changes: {
            type: 'object',
            properties: {
                title: { type: 'string', minLength: 1 }, // Title must be a non-empty string
                description: { type: 'string', minLength: 1 }, // Description must be a non-empty string
            },
            required: ['title', 'description'], // Ensure both keys are present
            additionalProperties: false, // Disallow additional properties
        },
        exitAfterSave: { type: 'boolean' }, // Ensure it's a boolean
    },
    required: ['userId', 'changes', 'exitAfterSave'], // Top-level keys must be present
    additionalProperties: false, // Disallow extra top-level properties
};

exports.saveBallotChanges = async (req, res) => {
    const { ballotId } = req.params;
    const requestBody = req.body;

    
    
    // // Validate the request body against the schema
    // const validate = ajv.compile(requestBodySchema);
    // if (!validate(requestBody)) {
    //     console.error('Validation errors:', validate.errors);
    //     return sendError(res, 'Invalid data: Request body does not match the expected format.');
    // }

    /**
        Validation errors: [
        {
            keyword: 'additionalProperties',
            dataPath: '.changes',
            schemaPath: '#/properties/changes/additionalProperties',
            params: { additionalProperty: 'id' },
            message: 'should NOT have additional properties'
        }
        ]
     */


    const { userId, changes, exitAfterSave } = requestBody;

    try {
        const result = await ballotController.saveBallotChanges(ballotId, userId, changes, exitAfterSave);
        return sendSuccess(res, result);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while saving ballot changes');
    }
};


exports.createBallot = async (req, res) => {
    const { societyId, userId } = req.body;
    try {
        const newBallot = await ballotController.createBallot(societyId, userId);
        console.log("newBallot", newBallot);
        return sendSuccess(res, 'Ballot created successfully', newBallot);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Failed to create ballot');
    }
};
