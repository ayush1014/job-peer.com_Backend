const Sequelize = require('sequelize');
const db = require('../db_config/db'); // Assume you have a setup for Sequelize

const Notification = db.define('notification', {
  id: {
    type:Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  sender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  receiver: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: false,
  },
  
});

module.exports = Notification;
