const Jobs = require('../models/Jobs');
const User = require('../models/User');
const LeaderBoard = require('../models/LeaderBoard')
const Messages = require('../models/Messages');
const Conversations = require('../models/Conversations');
const UserConversations = require('../models/UserConversations');
const { Sequelize, Op } = require('sequelize');

async function addUserToConversation(userId, conversationId) {
    await UserConversations.create({
        userId,
        conversationId
    });
}

async function removeUserFromConversation(userId, conversationId) {
    await UserConversations.destroy({
        where: { userId, conversationId }
    });
}


async function getOrCreateConversationId(sender, receiver) {
    let conversation = await Conversations.findOne({
        where: {
            [Op.or]: [
                { participantOne: sender, participantTwo: receiver },
                { participantOne: receiver, participantTwo: sender }
            ]
        }
    });

    if (!conversation) {
        conversation = await Conversations.create({ participantOne: sender, participantTwo: receiver });
    }

    return conversation.id;
}


async function getConversationId(req, res){
    const {sender, receiver} = req.query;
    try {
        const conversationId = await getOrCreateConversationId(sender, receiver);
        res.json({ conversationId });
      } catch (error) {
        console.error('Error getting or creating conversation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

async function createMessage({ sender, receiver, text }) {
    try {
      const conversationId = await getOrCreateConversationId(sender, receiver);
      const message = await Messages.create({
        sender,
        receiver,
        text,
        conversationId,
        isRead: false
      });
  
      // Return the message data in a format suitable for the frontend
      return message.get({ plain: true });
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

async function getMessages(req, res) {
    try {
        const { conversationId } = req.params;
        const messages = await Messages.findAll({
            where: { conversationId },
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).send(error.message);
    }
}




// DELETE /api/messages/:id
async function deleteMessage(req, res) {
    try {
        const { id } = req.params;
        const deleted = await Messages.destroy({
            where: { id }
        });
        if (deleted) {
            res.send("Message deleted");
        } else {
            res.status(404).send("Message not found");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// POST /api/messages/:id/read
// async function markMessageAsRead(req, res) {
//     try {
//         const { id } = req.params;
//         const updated = await Messages.update({ isRead: true }, {
//             where: { id }
//         });
//         if (updated[0] > 0) {
//             res.send("Message marked as read");
//         } else {
//             res.status(404).send("Message not found");
//         }
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// }

async function markMessageAsRead(req, res) {
    try {
        const { messageIds } = req.body;
        await Messages.update({ isRead: true }, { where: { id: messageIds } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getUnreadMessageCount(req, res) {
    try {
        const sender = req.params.sender;
        const count = await Messages.count({
            where: {
                sender: sender,
                isRead: false
            }
        });
        res.json({ unreadCount: count });
    } catch (error) {
        console.error('Error getting unread message count:', error);
        res.status(500).send('Server error');
    }
}

async function getUnreadMessageCountBySender(sender) {
    try {
        return await Messages.count({
            where: {
                sender: sender,
                isRead: false
            }
        });
    } catch (error) {
        console.error('Error getting unread message count by sender:', error);
        throw error;
    }
}

module.exports = {
    createMessage,
    getMessages,
    deleteMessage,
    markMessageAsRead,
    addUserToConversation,
    removeUserFromConversation,
    getConversationId,
    getUnreadMessageCount,
    getUnreadMessageCountBySender
};