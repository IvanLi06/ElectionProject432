const {Ballot, sequelize} = require("../models"); // Import Ballot model
const {getSocietiesByUserIdFromDb} = require("./societyController"); // Assuming you have a function to fetch societies by user
const { Op } = require('sequelize');

// Get all ballots
exports.getAllBallots = async () => {
    try {
        return await Ballot.findAll();
    } catch (error) {
        throw new Error("Error fetching all ballots");
    }
};

// Get a ballot by ID
exports.getBallotById = async (ballotId) => {
    try {
        return await Ballot.findByPk(ballotId);
    } catch (error) {
        throw new Error("Error fetching ballot by ID");
    }
};

// Get active ballots by society ID
exports.getActiveBallotsBySocietyID = async (societyId) => {
    console.log("societyId", societyId);
    try {
        const ballots = await Ballot.findAll({
            where: {
                societyID: societyId,
                endtime: {
                    [Op.gte]: new Date(), // Compare endtime with the current date
                },
            },
        });
        console.log("ballots", ballots);
        return (ballots);
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get active ballots from accessible societies for a user
exports.getActiveBallotsFromAccessibleSocieties = async (userId) => {
    try {
        const accessibleSocieties = await getSocietiesByUserIdFromDb(userId);
        const societyIds = accessibleSocieties.map((society) => society.id);

        return await Ballot.findAll({
            where: {
                societyID: {
                    [Op.in]: societyIds,
                },
                endtime: {
                    [Op.gte]: new Date(),
                },
            },
        });
    } catch (error) {
        throw new Error(
            "Error fetching active ballots for accessible societies"
        );
    }
};

// Delete a ballot by ID
exports.deleteBallotById = async (ballotId) => {
    try {
        return await Ballot.destroy({
            where: {id: ballotId},
        });
    } catch (error) {
        throw new Error("Error deleting ballot");
    }
};

// Lock a ballot
exports.lockBallot = async (ballotId, userId) => {
    try {
        const ballot = await Ballot.findOne({
            where: {
                id: ballotId,
                [Op.or]: [{locked: false}, {lockedBy: userId}],
            },
        });

        if (!ballot) {
            throw new Error(
                "This ballot is currently being edited by another user."
            );
        }

        await ballot.update({locked: true, lockedBy: userId});
        return "Ballot locked for editing";
    } catch (error) {
        throw new Error(error.message || "Error locking ballot");
    }
};

// Unlock a ballot
exports.unlockBallot = async (ballotId, userId) => {
    try {
        const ballot = await Ballot.findOne({
            where: {
                id: ballotId,
                locked: true,
                lockedBy: userId,
            },
        });

        if (!ballot) {
            throw new Error("You are not allowed to unlock this ballot");
        }

        await ballot.update({locked: false, lockedBy: null});
        return "Ballot unlocked";
    } catch (error) {
        throw new Error(error.message || "Error unlocking ballot");
    }
};

// Save ballot changes
exports.saveBallotChanges = async (
    ballotId,
    userId,
    changes,
    exitAfterSave
) => {
    try {
        const ballot = await Ballot.findOne({
            where: {id: ballotId, locked: true, lockedBy: userId},
        });

        if (!ballot) {
            throw new Error("Ballot not found or locked by another user.");
        }

        await ballot.update(changes);

        if (exitAfterSave) {
            await ballot.update({locked: false, lockedBy: null});
        }

        return `Changes saved${exitAfterSave ? " and ballot unlocked" : ""}.`;
    } catch (error) {
        throw new Error("Error saving ballot changes");
    }
}

// Create a new ballot
exports.createBallot = async (societyId, userId) => {

    try {
        // Start a database transaction
        const newBallot = await sequelize.transaction(async (transaction) => {
            // Create a new ballot and associate with the societyId and userId
            const ballot = await sequelize.models.Ballot.create({
                societyID: societyId,
                title: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                starttime: new Date(),
                endtime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
                active: false,
                content: {},
                locked: true,
                lockedBy: userId,
            }, { transaction }); 

            return ballot; 
        });

        console.log("New ballot in controller: ", newBallot);
        return newBallot;
    } catch (error) {
        throw new Error("Error creating ballot");
    }
};
