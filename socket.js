// // socket.js
// const { Server } = require('socket.io');
// let io;

// function init(httpServer) {
//     io = new Server(httpServer, {
//         cors: {
//             origin: "http://localhost:3000", 
//             // origin:[ "https://job-peer.com/", "https://job-peer-com-frontend.vercel.app"],
//             // origin:"https://www.job-peer.com",
//             methods: ["GET", "POST", "PUT", "DELETE"],
//             credentials: true
//         }
//     });

//     io.on('connection', (socket) => {
//         console.log(`New connection: ${socket.id}`);

//         socket.on('join', (username) => {
//             socket.join(username);
//             console.log(`${username} joined`);
//         });

//         // Example: On receiving a 'message' event from the client, log the message
//         socket.on('message', (msg) => {
//             console.log('Message received:', msg);
//             // You can also broadcast to all clients, excluding the sender
//             socket.broadcast.emit('message', msg);
//         });

//         // Handle disconnection
//         socket.on('disconnect', () => {
//             console.log('User disconnected', socket.id);
//         });
//     });

//     return io;
// }

// function getIO() {
//     if (!io) {
//         throw new Error("Must initialize socket.io first");
//     }
//     return io;
// }

// module.exports = { init, getIO };


// const { Server } = require('socket.io');
// const { createMessage } = require('./controllers/messagesController');

// let io;

// function init(httpServer) {
//     io = new Server(httpServer, {
//         cors: {
//             origin: "http://localhost:3000",
//             // origin:"https://www.job-peer.com",
//             methods: ["GET", "POST", "PUT", "DELETE"],
//             credentials: true
//         }
//     });

//     io.on('connection', (socket) => {
//         console.log(`New connection: ${socket.id}`);
    
//         socket.on('joinConversation', (conversationId) => {
//           socket.join(`conversation_${conversationId}`);
//           console.log(`Joined conversation_${conversationId}`);
//         });
    
//         socket.on('sendMessage', async (data) => {
//           try {
//             const message = await createMessage(data);
//             io.in(`conversation_${message.conversationId}`).emit('newMessage', message);
//           } catch (error) {
//             console.error('Error sending message:', error);
//             // Optionally emit an event to the sender to notify them of the error
//             socket.emit('messageError', { error: 'Message failed to send.' });
//           }
//         });
    
//         socket.on('disconnect', () => {
//           console.log('User disconnected', socket.id);
//         });
//       });

//     return io;
// }

// module.exports = { init };

const { Server } = require('socket.io');
const { createMessage } = require('./controllers/messagesController');
// Import additional controllers if needed

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

