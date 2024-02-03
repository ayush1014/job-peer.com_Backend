const {DataTypes, Sequelize} = require('sequelize');
const db = require('../db_config/db');
const User = require('./User');
const LeaderBoard = require('./LeaderBoard');

User.hasOne(LeaderBoard,{
    foreignKey: 'username',
    as: 'numberOfJobs',
    onDelete: 'CASCADE'
});

LeaderBoard.belongsTo(User,{
    foreignKey: 'username',
    as:'user'
});

module.exports = {User, LeaderBoard};