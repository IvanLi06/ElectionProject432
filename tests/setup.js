const { sequelize } = require('../src/models');

// Sync the database before running tests
beforeAll(async () => {
    await sequelize.sync({ force: true });
});

// Close the connection after tests
afterAll(async () => {
    await sequelize.close();
});
