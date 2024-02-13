// socket.js
const { Server } = require('socket.io');
let io;

function init(httpServer) {
    io = new Server(httpServer, {
        cors: {
            // origin: "http://localhost:3000", 
            // origin:[ "https://job-peer.com/", "https://job-peer-com-frontend.vercel.app"],
            origin:"https://www.job-peer.com/",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);

        socket.on('join', (username) => {
            socket.join(username);
            console.log(`${username} joined`);
        });

        // Example: On receiving a 'message' event from the client, log the message
        socket.on('message', (msg) => {
            console.log('Message received:', msg);
            // You can also broadcast to all clients, excluding the sender
            socket.broadcast.emit('message', msg);
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
