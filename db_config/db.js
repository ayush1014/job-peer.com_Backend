const {Sequelize} = require('sequelize');
require('dotenv').config();
// console.log('testing database', process.env.DB_NAME);

const db = new Sequelize({
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:process.env.DB_HOST,
    dialect:'mysql',
    port:process.env.DB_PORT
})

module.exports = db;