const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Create new user
        const newUser = await User.create({ username, name, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findByPk(username);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check password
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid Password');
        }

        // Respond with user details (excluding password)
        const userWithoutPassword = { ...user.dataValues };
        delete userWithoutPassword.password;
        res.status(200).json(userWithoutPassword);
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
};