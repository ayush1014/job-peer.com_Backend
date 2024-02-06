const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const db_connection = require('./db_config/db')
const app = express();
const routes = require('./routes/router')
const User = require('./models/User');
const Jobs = require('./models/Jobs');
const LeaderBoard = require('./models/LeaderBoard')
const Peer = require('./models/Peer')
const Notification = require('./models/Notification')
const { resetHourlyCounts,resetSixHourCounts, resetDailyCounts, resetMonthlyCounts, resetYearlyCounts } = require('./controllers/jobLeaderBoardScheduling'); 
// const UserManyJobs = require('./models/UserManyJobs');

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Port
const PORT = process.env.PORT || 8000;

// Initialize scheduled tasks
resetHourlyCounts();
resetSixHourCounts();
resetDailyCounts();
resetMonthlyCounts();
resetYearlyCounts();

//Server
app.listen(PORT, (err)=>{
    if(err){
        console.log(`Server not running due to this error: ${err}`)
    }
    console.log(`Server is running on port: ${PORT}`);
})

//testing api
app.get('/', (req, res)=>{
    res.json({
        message: 'server is up and running AND api is working perfectly'
    });
});

//database connection
db_connection.sync()
.then(()=>{
    console.log('database is synced and running fine')
})

//routes
app.use('/jat', routes)