require('./setup'); // This will run the beforeAll and afterAll hooks

const { beforeAll, afterAll, beforeEach, afterEach, test, expect } = require('@jest/globals'); 
const { User, UserType, sequelize } = require('../src/models');

describe('User model', () => {
    let userTypeID;
    let transaction;

    beforeAll(async () => {
        const userType = await UserType.create({
            description: "Admin2",
            permissions: {
                canSeeReports: true,
            }
        });
        userTypeID = userType.id; // Store the generated ID for later use
    });
    
    afterAll(async () => {
        // Clean up Users associated with this UserType
        await User.destroy({ where: { userTypeID } });
        
        // Now clean up the UserType entry
        await UserType.destroy({ where: { id: userTypeID } });
    });    

    beforeEach(async () => {
        transaction = await sequelize.transaction(); // Start a transaction
    });

    afterEach(async () => {
        if (transaction) { // Ensure transaction is defined
            await transaction.rollback(); // Rollback the transaction to revert changes
        }
    });


    test('should create a new user', async () => {
        try {
            const user = await User.create({ 
                firstname: 'Johny', 
                lastname: 'Bravo', 
                email: 'johny@example.com', 
                password: 'password123', 
                userTypeID, // Use the dynamically created userTypeID
                transaction // Ensure to pass the transaction
            });
            expect(user).toHaveProperty('id');
            expect(user.firstname).toBe('Johny');
            expect(user.lastname).toBe('Bravo');
            expect(user.email).toBe('johny@example.com');
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // Re-throw to fail the test
        }
    });
    

    test('should not allow null values for required fields', async () => {
        expect.assertions(1);
        try {
            await User.create({}, { transaction });
        } catch (e) {
            expect(e.name).toBe('SequelizeValidationError');
        }
    });
});
