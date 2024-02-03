const {DataTypes, Sequelize} = require('sequelize');
const db = require('../db_config/db');
const User = require('./User');
const Jobs = require('./Jobs');

User.hasMany(Jobs, {
    foreignKey: 'username',
    as: 'jobs'
});

Jobs.belongsTo(User, {
    foreignKey: 'username',
    as: 'user'
});

module.exports = { User, Jobs };
