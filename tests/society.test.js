require('./setup'); // This will run the beforeAll and afterAll hooks

const { beforeEach, afterEach, test, expect } = require('@jest/globals'); 
const { Society, sequelize } = require('../src/models'); 

describe('Society model', () => {
    let transaction;

    beforeEach(async () => {
        transaction = await sequelize.transaction(); 
    });

    afterEach(async () => {
        if (transaction){
            await transaction.rollback(); 
        }
    });

    test('should create a new society', async () => {
        const society = await Society.create({ 
            name: 'Environmental Club',
            description: 'A club focused on environmental awareness.',
            abbrev: "EC",
            research_area: "Environment",
            createdAt: new Date(),
            updatedAt: new Date()
        }, { transaction });
        
        expect(society).toHaveProperty('id');
        expect(society.name).toBe('Environmental Club');
        expect(society.abbrev).toBe('EC');
        expect(society.description).toBe('A club focused on environmental awareness.');
        expect(society.research_area).toBe('Environment');
    });

    test('should not allow null values for required fields', async () => {
        expect.assertions(1);
        try {
            await Society.create({}, { transaction });
        } catch (e) {
            expect(e.name).toBe('SequelizeValidationError');
        }
    });

});
