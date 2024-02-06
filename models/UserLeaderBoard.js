// const {DataTypes, Sequelize} = require('sequelize');
// const db = require('../db_config/db');
// const User = require('./User');
// const LeaderBoard = require('./LeaderBoard');
// const Peer = require('./Peer');

// User.hasOne(LeaderBoard, { foreignKey: 'username' , onDelete: 'CASCADE'});
// LeaderBoard.belongsTo(User, { foreignKey: 'username' });

// User.hasMany(Peer, { foreignKey: 'requestingPeer', as: 'RequestingPeers' });
// User.hasMany(Peer, { foreignKey: 'requestedPeer', as: 'RequestedPeers' });
// Peer.belongsTo(User, { foreignKey: 'requestingPeer', as: 'RequestingUser' });
// Peer.belongsTo(User, { foreignKey: 'requestedPeer', as: 'RequestedUser' });

// module.exports = {User, LeaderBoard, Peer};