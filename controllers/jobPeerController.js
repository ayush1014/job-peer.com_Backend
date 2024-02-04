const {Sequelize, Op}  = require('sequelize');

const Peer =  require('../models/Peer');
const LeaderBoard = require('../models/LeaderBoard');
const User = require('../models/User');

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