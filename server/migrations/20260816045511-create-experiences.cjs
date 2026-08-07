'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Experiences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date_range: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      company: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      view: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      tech_stack: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Experiences');
  },
};