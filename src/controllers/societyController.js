const { Society } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

                          
                                           
// Get all societies
exports.getAllSocieties = async () => {
    try {
        return await Society.findAll();
    } catch (error) {
    }
};

// Get a society by ID
exports.getSocietyById = async (societyId) => {
    try {
        return await Society.findByPk(societyId);
    } catch (error) {
        throw new Error('Error fetching society by ID');
    }
};

// Get societies by user ID
exports.getSocietiesByUserId = async (userId) => {
    try {
        const societieIds = await sequelize.query(
            `SELECT "societyID" FROM "user_society" WHERE "userID" = :userId` , 
            {
                replacements: {userId: parseInt(userId, 10)},
                type: QueryTypes.SELECT
            });

        return societieIds.map(row => row.societyID);; // Returning only the society IDs
    } catch (error) {
        // throw new Error('Error fetching societies by user ID');
        throw new Error(error.message);
    }
};
