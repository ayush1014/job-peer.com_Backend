const { DataTypes, Sequelize } = require('sequelize');
const db = require('../db_config/db')

const LeaderBoard = db.define('leaderBoard',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
        allowNull:false
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Users', // This is the table name
            key: 'username',
        }
    },

    numberOfJobs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
});

module.exports = LeaderBoard;