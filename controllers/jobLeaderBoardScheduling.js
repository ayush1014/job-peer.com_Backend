const cron = require('node-cron');
const LeaderBoard = require('../models/LeaderBoard');
const User = require('../models/User');
const moment = require('moment-timezone');

const resetCounts = async () => {
    // Fetch all users with their timezones
    const users = await User.findAll({
        attributes: ['username', 'timezone'],
    });

    for (let user of users) {
        const timezone = user.timezone || 'UTC'; // Default to UTC if no timezone is set
        const now = moment().tz(timezone);

        // Check and reset counts based on current time in user's timezone

        // Hourly reset
        if (now.minute() === 0) {
            console.log(`Resetting hourly counts for ${user.username}...`);
            await LeaderBoard.update({ numberOfJobsHour: 0 }, { where: { username: user.username } });
        }

        // Daily reset
        if (now.hour() === 0 && now.minute() === 0) {
            console.log(`Resetting daily counts for ${user.username}...`);
            await LeaderBoard.update({ numberOfJobsDay: 0 }, { where: { username: user.username } });
        }

        // Six-hour reset
        if ([0, 6, 12, 18].includes(now.hour()) && now.minute() === 0) {
            console.log(`Resetting six-hour counts for ${user.username}...`);
            await LeaderBoard.update({ numberOfJobsSixHours: 0 }, { where: { username: user.username } });
        }

        // Monthly reset
        if (now.date() === 1 && now.hour() === 0 && now.minute() === 0) {
            console.log(`Resetting monthly counts for ${user.username}...`);
            await LeaderBoard.update({ numberOfJobsMonth: 0 }, { where: { username: user.username } });
        }

        // Yearly reset
        if (now.month() === 0 && now.date() === 1 && now.hour() === 0 && now.minute() === 0) {
            console.log(`Resetting yearly counts for ${user.username}...`);
            await LeaderBoard.update({ numberOfJobsYear: 0 }, { where: { username: user.username } });
        }
    }
};

// Schedule the resetCounts function to run every minute
cron.schedule('* * * * *', resetCounts);

module.exports = { resetCounts };
