const { Server } = require('socket.io');
const { createMessage } = require('./controllers/messagesController');
const {getUnreadMessageCountBySender} = require('./controllers/messagesController');
require('dotenv').config();

let io;

function init(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            // origin:"https://www.job-peer.com",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);
        
        // Handling messages
        socket.on('joinConversation', (conversationId) => {
            socket.join(`conversation_${conversationId}`);
            console.log(`Joined conversation_${conversationId}`);
        });

        socket.on('sendMessage', async (data) => {
            try {
              const message = await createMessage(data);
              io.in(`conversation_${message.conversationId}`).emit('newMessage', message);
              // Use receiver to fetch the updated unread count
              console.log('messageData: ', data)
              const unreadCount = await getUnreadMessageCountBySender(data.sender);

                // Emit the updated count to all clients interested in this sender's unread count
                io.emit('unreadCountUpdate', { sender: data.sender, count: unreadCount });
            } catch (error) {
              console.error('Error sending message:', error);
              socket.emit('messageError', { error: 'Message failed to send.' });
            }
          });
          

        // Handling notifications
        socket.on('join', (username) => {
            socket.join(username);
            console.log(`${username} joined for notifications`);
        });

        // Example: Send a notification to a user
        socket.on('sendNotification', (data) => {
            // Assuming data contains a username and the notification details
            io.in(data.username).emit('notification', data.notification);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Must initialize socket.io first");
    }
    return io;
}

module.exports = { init, getIO };

