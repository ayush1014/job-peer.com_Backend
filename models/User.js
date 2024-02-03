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
    }
    
});


module.exports = User;