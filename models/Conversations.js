const {DataTypes, Sequelize} = require('sequelize');
const db = require('../db_config/db');


const Conversations = db.define('conversations', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
  },
  participantOne: {
      type: DataTypes.STRING,
      allowNull: false
  },
  participantTwo: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  timestamps: true
});

  
module.exports = Conversations