const { Sequelize, DataTypes } = require('sequelize');
const db = require('../db_config/db');

const Peer = db.define('Peer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
        allowNull: false,
    },
    requestedPeer: { 
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'username'
        }
    },
    requestingPeer: { 
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'username'
        }
    },
    peerConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = Peer;
