const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobsController');
const jobPeerController = require('../controllers/jobPeerController');
const messagesController = require('../controllers/messagesController')

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
router.get('/notifications/count/:username', jobPeerController.getNotificationCount);
router.get('/leaderboardUser/:username', jobPeerController.getUserLeaderboardDetails);
router.get('/peerCount/:username', jobPeerController.getPeerCount);


//messages routers
router.post('/messages', messagesController.createMessage);
router.get('/messages/:conversationId', messagesController.getMessages);
router.delete('/messages/:id', messagesController.deleteMessage);
router.post('/messages/markAsReadBulk', messagesController.markMessageAsRead);
router.post('/conversations/:conversationId/users', messagesController.addUserToConversation);
router.delete('/conversations/:conversationId/users/:userId', messagesController.removeUserFromConversation);
router.get('/conversations/getOrCreate', messagesController.getConversationId);
router.get('/unreadMessagesCount/:sender', messagesController.getUnreadMessageCount);

//forget-password routes
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
