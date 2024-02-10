const { Sequelize, Op } = require('sequelize');
const LeaderBoard = require('../models/LeaderBoard');
const User = require('../models/User');
const Peer = require('../models/Peer');
const Notification = require('../models/Notification')
const { getIO } = require('../socket')



exports.searchUser = async (req, res) => {
    try {
        const peerName = req.params.peerName;
        const excludeUser = req.params.username;

        const matchingUsers = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${peerName}%`,
                    [Op.ne]: excludeUser
                }
            },
            attributes: ['username', 'name', 'email']
        });

        if (matchingUsers.length === 0) {
            return res.status(404).json({ error: 'No matching users found' });
        }

        res.status(200).json(matchingUsers);
    } catch (error) {
        console.error('Searching User Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.PeerFollow = async (req, res) => {
    const io = getIO();
    try {
        const { username, peerName } = req.params;

        // Check if both users exist
        const userExists = await User.findByPk(username);
        const peerExists = await User.findByPk(peerName);

        if (!userExists || !peerExists) {
            return res.status(404).json({ error: 'User or peer not found' });
        }

        // Create or find a peer relationship
        const [peerEntry, created] = await Peer.findOrCreate({
            where: {
                requestedPeer: peerName,
                requestingPeer: username
            },
            defaults: {
                peerConfirmed: false
            }
        });

        if (created) {
            const notificationMessage = `${username} wants to add you as a peer.`;
            // Save notification in the database
            const newNotification = await Notification.create({
                sender: username,
                receiver: peerName,
                message: notificationMessage,
                status: 'unread', // Default status
            });

            const updateNotificationCount = async (username) => {
                const io = getIO();
                const count = await Notification.count({
                    where: { receiver: username, status: 'unread' }
                });

                io.to(username).emit('notificationCountUpdate', { count }); // Emit to a room named after the username
            };

            await updateNotificationCount(peerName);

            io.to(peerName).emit('notification', {
                from: username,
                message: `${username} wants to add you as a peer.`,
                action: 'peerRequest',
                id: newNotification.id
            });
            res.json({ message: "Follow request sent" });
        } else {
            res.json({ message: "Follow request already sent" });
        }
    } catch (error) {
        console.error('Error in PeerFollow:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.CheckRequestSend = async (req, res) => {
    try {
        const username = req.params.username;
        const peerName = req.params.peerName;

        const checkRequest = await Peer.findOne({
            where: {
                requestingPeer: username,
                requestedPeer: peerName
            }
        });

        // Check if the request exists
        if (checkRequest) {
            // If the request exists, send a response indicating the request has been sent
            res.json({ reqSend: true });
        } else {
            // If the request does not exist, send a response indicating no request has been sent
            res.json({ reqSend: false });
        }
    } catch (error) {
        console.log('Error checking request:', error);
        res.status(500).json({ message: 'Error checking request' });
    }
};


exports.ConfirmPeerFollow = async (req, res) => {
    try {
        const { username, peerName } = req.params;

        const [updated] = await Peer.update({ peerConfirmed: true }, {
            where: {
                requestedPeer: peerName,
                requestingPeer: username
            }
        });

        if (updated > 0) {
            res.json({ message: "Follow request confirmed" });
        } else {
            res.status(404).json({ message: "Follow request not found" });
        }
    } catch (error) {
        console.error('Error in ConfirmPeerFollow:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const db = require('../db_config/db'); // Ensure you have a db instance from Sequelize

exports.UnConfirmPeerFollow = async (req, res) => {
    try {
        const { username, peerName } = req.params;
        const unFollowing = await Peer.destroy({
            where: {
                [Op.or]: [
                    { requestedPeer: peerName, requestingPeer: username },
                    { requestingPeer: peerName, requestedPeer: username }
                ]
            }
        });
        res.send('unfollowed successfull')
    } catch (error) {
        console.log('error occurred while unfollowing peer')
    }
}

exports.ShowConfirmedPeer = async (req, res) => {
    try {
        const { username } = req.params;

        // Fetch confirmed peers
        const confirmedPeers = await db.query(`
            SELECT * FROM Peers WHERE
            (requestedPeer = :username OR requestingPeer = :username) AND
            peerConfirmed = true
        `, {
            replacements: { username: username },
            type: db.QueryTypes.SELECT
        });

        // Now, fetch LeaderBoard details separately
        for (const peer of confirmedPeers) {
            // Assuming you want LeaderBoard for both requestedPeer and requestingPeer
            const requestedPeerLeaderBoard = await LeaderBoard.findOne({ where: { username: peer.requestedPeer } });
            const requestingPeerLeaderBoard = await LeaderBoard.findOne({ where: { username: peer.requestingPeer } });

            // Attach LeaderBoard details to the peer object
            peer.requestedPeerLeaderBoard = requestedPeerLeaderBoard;
            peer.requestingPeerLeaderBoard = requestingPeerLeaderBoard;
        }

        return res.json(confirmedPeers);
    } catch (error) {
        console.error('Error fetching confirmed peers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.GetNotifications = async (req, res) => {
    try {
        const username = req.params.username;
        const notifications = await Notification.findAll({
            where: { receiver: username, status: 'unread' },
            order: [['createdAt', 'DESC']]
        });

        const updateNotificationCount = async (username) => {
            const io = getIO();
            const count = await Notification.count({
                where: { receiver: username, status: 'unread' }
            });

            io.to(username).emit('notificationCountUpdate', { count }); // Emit to a room named after the username
        };
        await updateNotificationCount(username);
        res.json(notifications);

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.DeleteNotification = async (req, res) => {
    try {
        const id = req.params.id;
        const notification = await Notification.findByPk(id);
        const deleteNotification = await Notification.destroy({
            where: { id: id }
        });
        const receiverUsername = notification.receiver;
        const updateNotificationCount = async (username) => {
            const io = getIO();
            const count = await Notification.count({
                where: { receiver: username, status: 'unread' }
            });

            io.to(username).emit('notificationCountUpdate', { count }); // Emit to a room named after the username
        };
        await updateNotificationCount(receiverUsername);
    }
    catch (error) {
        console.error('Error deteling Notification');
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


exports.getNotificationCount = async (req, res) => {
    try {
        const username = req.params.username;
        const count = await Notification.count({
            where: { receiver: username }
        });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching notification count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
