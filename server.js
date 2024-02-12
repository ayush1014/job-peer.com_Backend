// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser')
// const db_connection = require('./db_config/db')
// const app = express();
// const routes = require('./routes/router')
// const User = require('./models/User');
// const Jobs = require('./models/Jobs');
// const LeaderBoard = require('./models/LeaderBoard')
// const Peer = require('./models/Peer')
// const Notification = require('./models/Notification')
// const { resetCounts } = require('./controllers/jobLeaderBoardScheduling');
// const http = require('http'); // Import HTTP module
// const { init } = require('./socket');

// // const UserManyJobs = require('./models/UserManyJobs');

// //middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// init(server)

// const server = http.createServer(app);
// // const io = new Server(server);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000", // Allow your frontend origin
//         methods: ["GET", "POST", "PUT", "DELETE"], // Methods allowed
//         credentials: true
//     }
// });
// const corsOptions = {
//     origin: 'http://localhost:3000', // or the specific origin you want to allow
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // to allow session cookies from the browser to pass through
//     allowedHeaders: 'Content-Type, Accept',
// };

// app.use(cors(corsOptions));

// //Port
// const PORT = process.env.PORT || 8000;

// // Initialize scheduled tasks
// resetCounts()
// console.log('running job delete automation')

// // Server listens on HTTP server, not the Express app directly
// server.listen(PORT, () => {
//     console.log(`Server is running on port: ${PORT}`);
// });


// // //Server
// // app.listen(PORT, (err) => {
// //     if (err) {
// //         console.log(`Server not running due to this error: ${err}`)
// //     }
// //     console.log(`Server is running on port: ${PORT}`);
// // })

// //testing api
// app.get('/', (req, res) => {
//     res.json({
//         message: 'server is up and running AND api is working perfectly'
//     });
// });

// //database connection
// db_connection.sync()
//     .then(() => {
//         console.log('database is synced and running fine')
//     })

// //routes
// app.use('/jat', routes)
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
const { resetCounts } = require('./controllers/jobLeaderBoardScheduling');
const app = express();
const { init } = require('./socket'); // Ensure this path is correct

// Middleware
app.use(cors({
    //   origin: 'http://localhost:3000',
    origin: 'job-peer-com-frontend.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
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
