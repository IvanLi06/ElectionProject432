const { beforeEach, afterEach, test, expect } = require('@jest/globals'); 
const { UserType, sequelize } = require('../src/models'); 

describe('UserType model', () => {
    let transaction;

    beforeEach(async () => {
        transaction = await sequelize.transaction(); 
    });

    afterEach(async () => {
        if (transaction) { // Check if transaction exists
            await transaction.rollback(); 
        }
    });

    test('should create a new user type', async () => {
        const userType = await UserType.create({ 
            description: "Admin",
            permissions: { canSeeReports: true }
        }, { transaction });
        
        expect(userType).toHaveProperty('id');
        expect(userType.description).toBe('Admin');
        expect(userType.permissions.canSeeReports).toBe(true);
    });

    test('should not allow null values for required fields', async () => {
        expect.assertions(1);
        try {
            await UserType.create({}, { transaction });
        } catch (e) {
            expect(e.name).toBe('SequelizeValidationError');
        }
    });

});