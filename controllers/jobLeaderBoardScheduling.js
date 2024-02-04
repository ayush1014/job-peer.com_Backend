const cron = require('node-cron');
const LeaderBoard = require('../models/LeaderBoard');

const resetHourlyCounts = () => {
    cron.schedule('0 * * * *', async () => {
        await LeaderBoard.update({ numberOfJobsHour: 0 }, { where: {} });
    });
};

const resetDailyCounts = () => {
    cron.schedule('0 0 * * *', async () => {
        await LeaderBoard.update({ numberOfJobsDay: 0 }, { where: {} });
    });
};

module.exports = { resetHourlyCounts, resetDailyCounts };