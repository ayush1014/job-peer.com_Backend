const {DataTypes, Sequelize} = require('sequelize');
const db = require('../db_config/db');
const User = require('./User');
const Jobs = require('./Jobs');
const Conversations = require('./Conversations');
const Messages = require('./Messages');
const UserConversations = require('./UserConversations')

User.hasMany(Jobs, {
    foreignKey: 'username',
    as: 'jobs',
    onDelete: 'CASCADE'
});

Jobs.belongsTo(User, {
    foreignKey: 'username',
    as: 'user'
});

// Assuming you have something like this for defining associations

// // User.js
// User.belongsToMany(Conversations, { through: UserConversations, foreignKey: 'userId', otherKey: 'conversationId' });

// // Conversations.js
// Conversations.belongsToMany(User, { through: UserConversations, foreignKey: 'conversationId', otherKey: 'userId' });

// // UserConversations.js
// // Make sure you've defined both sides of the association back to User and Conversations
// UserConversations.belongsTo(User, { foreignKey: 'userId' });
// UserConversations.belongsTo(Conversations, { foreignKey: 'conversationId' });

// User.hasMany(UserConversations, { foreignKey: 'userId' });
// Conversations.hasMany(UserConversations, { foreignKey: 'conversationId' });


User.belongsToMany(Conversations, { through: UserConversations });
Conversations.belongsToMany(User, { through: UserConversations });
Conversations.hasMany(Messages);

// Messages model
Messages.belongsTo(Conversations);


module.exports = { User, Jobs, Conversations, Messages, UserConversations};
