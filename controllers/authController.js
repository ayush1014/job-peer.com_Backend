const User = require('../models/User');
const bcrypt = require('bcryptjs');
const LeaderBoard = require('../models/LeaderBoard');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require("sequelize");

exports.register = async (req, res) => {
    try {
        const { username, name, email, password, timezone } = req.body;

        // Check if user already exists
        // const existingUser = await User.findOne({ where: { username } });
        // const userTimezoneCheck = await User.findOne(
        //     {where: {
        //         username,
        //         timezone
        //     }}
        // )
        // if (existingUser) {
        //     if (!userTimezoneCheck){
        //         await User.update({ timezone }, { where: { username } });
        //    }
        //     return res.status(409).send('User already exists');
        // }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Create new user
        const newUser = await User.create({ username, name, email, password: hashedPassword, timezone });

        await LeaderBoard.create({
            username: username,
            name: name,
            numberOfJobs: 0,
        });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password, timezone } = req.body;

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

        // Update user's timezone
        if (timezone) {
            await User.update({ timezone }, { where: { username } });
        }

        // Respond with user details (excluding password)
        const userWithoutPassword = { ...user.dataValues, timezone }; // Include updated timezone
        delete userWithoutPassword.password;
        res.status(200).json(userWithoutPassword);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS 
    },
});

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send('User not found.');
    }   
    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Set token validity for 1 hour
    const expireTime = Date.now() + 3600000;    
    await User.update({ resetPasswordToken: resetToken, resetPasswordExpires: expireTime }, { where: { email } });  
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Password Reset',
      text: `Dear User,
    
    We received a request to reset the password for your account. If you did not make this request, please ignore this email.
    
    To reset your password, please click on the following link: ${resetUrl}
    
    This link will expire in 24 hours for security reasons.
    
    Thank you for using our services.
    
    Best Regards,
    Your Company Name`,
      html: `<!DOCTYPE html>
    <html>
    <body>
    <p>Dear User,</p>
    
    <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
    
    <p>To reset your password, please click on the link below:</p>
    
    <p><a href="${resetUrl}">Reset Password</a></p>
    
    <p>This link will expire in 1 hour for security reasons.</p>
    
    <p>Thank you for using our services.</p>
    
    <p>Best Regards,<br>
    Job Peer Team</p>
    </body>
    </html>`,
    };  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Recovery email sent');
      }
    });
}

// Handle incoming request from reset password URL
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log(token, password)
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });
  
    if (!user) {
      return res.status(400).send('Token is invalid or has expired.');
    }
  
    const hashedPassword = bcrypt.hashSync(password, 8);
    await User.update({ password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null }, { where: { email: user.email } });
  
    res.status(200).send('Password has been updated.');
}