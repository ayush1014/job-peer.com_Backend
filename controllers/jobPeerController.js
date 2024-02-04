const Sequelize  = require('sequelize');
const Peer =  require('../models/Peer');
const LeaderBoard = require('../models/LeaderBoard');
const User = require('../models/User');

exports.searchUser = async(req, res) =>{
    try{
        let user = req.params.username;
        const userExists = await User.findByPk(user);
        
        if (!userExists){
            return res.status(404).json({ error: 'User not Found!!'});
        }

        //Search functionality
        let peerName = req.params.peerName;
        const peerExists = await User.findByPk(peerName);
        if (!peerExists){
            return res.status(404).json({error: 'peer not found, recheck peer name'});
        }
        const searchPeer = {
            username: peerExists.username,
            name: peerExists.name,
            email: peerExists.email
        }
        res.status(200).json(searchPeer);
    } catch(error){
        console.error('Searching Peer Error: ', error);
    }
}
