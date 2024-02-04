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

const resetSixHourCounts = () => {
    // Runs at 00:00, 06:00, 12:00, and 18:00
    cron.schedule('0 0,6,12,18 * * *', async () => {
        console.log('Resetting six-hour counts...');
        await LeaderBoard.update({ numberOfJobsSixHours: 0 }, { where: {} });
    });
};

const resetMonthlyCounts = () => {
    // Runs at 00:00 on the first day of every month
    cron.schedule('0 0 1 * *', async () => {
        console.log('Resetting monthly counts...');
        await LeaderBoard.update({ numberOfJobsMonth: 0 }, { where: {} });
    });
};

const resetYearlyCounts = () => {
    // Runs at 00:00 on January 1st of every year
    cron.schedule('0 0 1 1 *', async () => {
        console.log('Resetting yearly counts...');
        await LeaderBoard.update({ numberOfJobsYear: 0 }, { where: {} });
    });
};

module.exports = { resetHourlyCounts, resetDailyCounts, resetSixHourCounts, resetMonthlyCounts, resetYearlyCounts};