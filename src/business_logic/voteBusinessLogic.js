const { sendError, sendSuccess } = require('../utils/response'); // Import the helper functions
const voteController = require("../controllers/voteController");

exports.submitVote = async (req, res) => {
    const {ballotID, userID, votes} = req.body;

    // Check for missing or invalid fields
    if (!ballotID || !userID || (!votes.offices && !votes.initiatives)) {
        return sendError(res, "Invalid request data.", 400);
    }

    try {
        // Fetch the ballot content
        const ballot = await voteController.getBallot(ballotID);
        if (!ballot) {
            return sendError(
                res,
                `Ballot with ID ${ballotID} not found.`,
                404
            );
        }
        console.log("BALLOT:", ballot.content);
        const ballotContent = ballot.content;

        // Validate votes for offices
        if (votes.offices) {
            for (const [officeID, candidateIDs] of Object.entries(
                votes.offices
            )) {
                const office = ballotContent.offices[officeID];
                if (!office) {
                    return sendError(
                        res,
                        `Office ${officeID} not found in ballot.`,
                        400
                    );
                }

                // Validate that the number of votes is less than or equal to allowed votes
                if (candidateIDs.length > office.allowedVotes) {
                    return sendError(
                        res,
                        `Too many votes for office ${officeID}. Maximum allowed is ${office.allowedVotes}.`,
                        400
                    );
                }

                // Validate that all candidateIDs are valid for the office
                for (const candidateID of candidateIDs) {
                    const candidate = office.candidates[candidateID];
                    if (!candidate) {
                        return sendError(
                            res,
                            `Candidate ID ${candidateID} not found for office ${officeID}.`,
                            400
                        );
                    }
                }
            }
        }

        // Validate votes for initiatives
        if (votes.initiatives) {
            for (const [initiativeID, optionIDs] of Object.entries(
                votes.initiatives
            )) {
                const initiative = ballotContent.initiatives[initiativeID];
                if (!initiative) {
                    return sendError(
                        res,
                        `Initiative ${initiativeID} not found in ballot.`,
                        400
                    );
                }

                // Validate that all optionIDs are valid for the initiative
                for (const optionID of optionIDs) {
                    const option = initiative.options[optionID];
                    if (!option) {
                        return sendError(
                            res,
                            `Option ID ${optionID} not found for initiative ${initiativeID}.`,
                            400
                        );
                    }
                }
            }
        }

        // Pass validated data to controller for database operations
        const result = await voteController.saveVote(ballotID, userID, votes);

        return sendSuccess(
            res,
            "Votes successfully saved.",
            result
        );
    } catch (error) {
        console.error("Error in vote service:", error.message);
        return sendError(
            res,
            "An error occurred while saving votes.",
            500
        );
    }
};

exports.getVoteStats = async (req, res) => {
    const {ballotID} = req.params;

    // Validate ballotID
    if (!ballotID) {
        return sendError(res, "Ballot ID is required.", 400);
    }

    try {
        // Get vote stats from the controller
        const stats = await voteController.fetchVoteStats(ballotID);
        return sendSuccess(
            res,
            "Election status retrieved successfully.",
            stats
        );
    } catch (error) {
        console.error("Error fetching vote stats:", error);
        return sendError(
            res,
            "An error occurred while fetching vote stats.",
            500
        );
    }
};
