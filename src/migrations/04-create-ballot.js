"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Ballots", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            societyID: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Societies",
                    key: "id",
                },
                onDelete: "CASCADE", // When a society is deleted, its ballots will be deleted
                allowNull: false,
            },
            starttime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            endtime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            content: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            locked: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },

            lockedBy: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "Users", // Referencing the Users table
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL", // Sets lockedBy to null if the user is deleted
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Ballots");
    },
};
