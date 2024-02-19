const { DataTypes, Sequelize } = require('sequelize');
const db = require('../db_config/db');

const Messages = db.define('messages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'conversations', // This is the table name
      key: 'id',
    },
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Assuming you want the default to be unread
  }
}, {
  timestamps: true, // This enables the automatic setting of createdAt and updatedAt fields
  indexes: [
    {
      fields: ['sender']
    },
    {
      fields: ['receiver']
    }
  ]
});

module.exports = Messages;