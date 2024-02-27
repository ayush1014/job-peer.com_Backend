const {DataTypes, Sequelize} = require('sequelize');
const db = require('../db_config/db');

const User = db.define('User',{
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    timezone: {
        type: DataTypes.STRING,
        allowNull: true, // Depending on whether you want this field to be mandatory or not
      },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
      
});


module.exports = User;