const Sequelize = require('sequelize');
const db = require('../db_config/db'); // Assume you have a setup for Sequelize

const Notification = db.define('notification', {
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
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Notification;
