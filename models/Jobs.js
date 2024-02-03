const { DataTypes, Sequelize } = require('sequelize');
const db = require('../db_config/db')

const Jobs = db.define('Jobs', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Users', // This is the table name
            key: 'username',
        }
    },

    job_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    company_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    job_description: {
        type: DataTypes.TEXT,
    },

    job_applied_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },

    job_applied_link: {
        type: DataTypes.TEXT,
    },
    appliedThrough: {
        type: DataTypes.STRING,
    },

    application_processing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Setting default value to false
    },
    following_up: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Setting default value to false
    },
    interviewing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Setting default value to false
    },
    rejected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Setting default value to false
    }
});

module.exports = Jobs;