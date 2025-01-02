const {Vote, OfficeResult, InitiativeResult, User, Ballot} = require("../models");
const { sequelize } = require('../models');

// Fetch the ballot content by its ID
exports.getBallot = async (ballotID) => {
    try {
        const ballot = await Ballot.findByPk(ballotID);
        return ballot;
    } catch (error) {
        throw new Error("Error fetching ballot: " + error.message);
    }
};

// Save a user's vote for a ballot
exports.saveVote = async (ballotID, userID, votes) => {
    try {
        // Save the vote for each office
        if (votes.offices) {
            for (const [officeID, candidateIDs] of Object.entries(
                votes.offices
            )) {
                // Store the result in the OfficeResult model
                for (const candidateID of candidateIDs) {
                    await OfficeResult.create({
                        ballotID,
                        officeID,
                        candidateID,
                    });
                }
            }
        }

        // Save the vote for each initiative
        if (votes.initiatives) {
            for (const [initiativeID, optionIDs] of Object.entries(
                votes.initiatives
            )) {
                // Store the result in the InitiativeResult model
                for (const optionID of optionIDs) {
                    await InitiativeResult.create({
                        ballotID,
                        initiativeID,
                        optionID,
                    });
                }
            }
        }

        // Store the user vote status
        await Vote.create({
            ballotID,
            userID,
            hasVoted: true,
            votedTime: new Date(),
        });

        return {success: true}; // Return a success message or any relevant data
    } catch (error) {
        throw new Error("Error saving vote: " + error.message);
    }
};

// Fetch vote statistics (number of voters, non-voters)
exports.fetchVoteStats = async (ballotID) => {
    try {
        const results = await sequelize.query(
            'SELECT * FROM get_voting_status(:ballotID)',
            {
                replacements: { ballotID },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Initialize counts and categorize users
        let votedCount = 0;
        let nonVotersCount = 0;
        const voters = [];
        const nonVoters = [];

        results.forEach(user => {
            console.log("user", user);
            if (user.hasvoted) {
                votedCount++;
                voters.push({
                    userID: user.userid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    votedTime: user.votedtime,
                });
            } else {
                nonVotersCount++;
                nonVoters.push({
                    userID: user.userid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                });
            }
        });

        return {
            votedCount,
            nonVotersCount,
            voters,
            nonVoters,
        };
    } catch (error) {
        throw new Error("Error fetching vote stats: " + error.message);
    }
};
