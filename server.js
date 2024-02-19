
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db_connection = require('./db_config/db');
const routes = require('./routes/router');
const http = require('http');
const User = require('./models/User');
const Jobs = require('./models/Jobs');
const LeaderBoard = require('./models/LeaderBoard')
const Peer = require('./models/Peer')
const Notification = require('./models/Notification')
const Messages = require('./models/Messages');
const Conversations = require('./models/Conversations');
// const UserConversations = require('./models/UserConversations')
const { resetCounts } = require('./controllers/jobLeaderBoardScheduling');
const app = express();
const { init } = require('./socket'); 

// Middleware
app.use(cors({
    //   origin: 'http://localhost:3000',
    // origin:[ "https://www.job-peer.com/", "https://job-peer-com-frontend.vercel.app"],
    origin:"https://www.job-peer.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/jat', routes);

// Testing API
app.get('/', (req, res) => {
    res.json({ message: 'server is up and running AND api is working perfectly' });
});

// Database connection
db_connection.sync().then(() => {
    console.log('database is synced and running fine');
});

const server = http.createServer(app);

// Initialize socket.io with the HTTP server
init(server);

// // Initialize scheduled tasks
resetCounts()
console.log('running job delete automation')

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
