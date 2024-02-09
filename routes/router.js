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
router.get('/peerFollow/:username/:peerName', jobPeerController.PeerFollow);
router.put('/peerFollowed/:username/:peerName', jobPeerController.ConfirmPeerFollow);
router.get('/confirmedPeer/:username', jobPeerController.ShowConfirmedPeer);
router.delete('/peerUnFollow/:username/:peerName', jobPeerController.UnConfirmPeerFollow);
router.get('/checkRequest/:username/:peerName', jobPeerController.CheckRequestSend);
router.get('/notifications/:username', jobPeerController.GetNotifications);
router.delete('/deleteNotification/:id', jobPeerController.DeleteNotification);

module.exports = router;
