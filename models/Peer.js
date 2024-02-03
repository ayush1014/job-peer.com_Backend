const { Sequelize, DataTypes} = require ('sequelize');
const db = require('../db_config/db');

const Peers = db.define('Peer',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },

    peer: {
        type: DataTypes.STRING,
        references: {
            model: 'Users',
            key: 'username'
        }
    },

    requestPeer: {
        type: DataTypes.STRING,
        references:{
            model: 'Users',
            key: 'username'
        }
    },

    peerConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

module.exports = Peers;