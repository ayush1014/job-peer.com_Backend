const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobsController');
const jobPeerController = require('../controllers/jobPeerController');

//Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

//Jobs
router.post('/saveJob/:username', jobController.job);
router.get('/jobs/:username', jobController.getUserJobs);
router.delete('/deleteJobs/:id', jobController.deleteUserJobs);
router.put('/editJobs/:id', jobController.editUserJobs);
router.get('/jobStats/:username', jobController.jobStatsPie);
router.get('/jobStatsByTimeFrame/:username/:timeFrame/:timeZone', jobController.getJobStatsByTimeFrame);
router.get('/jobDetail/:username/:id', jobController.showJobDetailsSingle);
router.get('/searchPeer/:username/:peerName', jobPeerController.searchUser);
module.exports = router;
