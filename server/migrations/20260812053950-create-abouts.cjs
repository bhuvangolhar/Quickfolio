'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Abouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      section: {
        type: Sequelize.STRING(100),
        defaultValue: '01 - ABOUT',
      },
      heading: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      subtitle: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      code_filename: {
        type: Sequelize.STRING(100),
        defaultValue: 'config.json',
      },
      code_content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      stat1_value: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      stat1_label: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      stat2_value: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      stat2_label: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      stat3_value: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      stat3_label: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      stat4_value: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      stat4_label: {
        type: Sequelize.STRING(100),
        allowNull: true,
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
    await queryInterface.dropTable('Abouts');
  },
};