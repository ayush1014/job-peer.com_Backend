const {Sequelize, Op}  = require('sequelize');
const LeaderBoard = require('../models/LeaderBoard');
const User = require('../models/User');
const Peer = require('../models/Peer');

exports.searchUser = async (req, res) => {
    try {
        const peerName = req.params.peerName;
        const matchingUsers = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${peerName}%` 
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
            res.json({ message: "Follow request sent" });
        } else {
            res.json({ message: "Follow request already sent" });
        }
    } catch (error) {
        console.error('Error in PeerFollow:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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

exports.ShowConfirmedPeer = async (req, res)=>{
    try{
        const username = req.params;

        const checkUser = await User.findOne(username);
        if(!checkUser){
            return res.status(404).json({ error: 'User not found' });
        }

        const confirmedUsers = await Peer.findAll({
            where: {
                peerConfirmed : true
            }
        })
        return res.status(200).json(confirmedUsers);

    }catch(error){
        console.error('error searching user: ', error)
    }
}