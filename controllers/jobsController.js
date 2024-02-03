const Jobs = require('../models/Jobs');
const User = require('../models/User');
const LeaderBoard = require('../models/LeaderBoard')
const { Sequelize, Op } = require('sequelize');
// const moment = require('moment');
const moment = require('moment-timezone');


exports.job = async (req, res) => {
    try {
        // Extract the job details and username from the request body
        let username = req.params.username;
        const { job_title, company_name, job_description, job_applied_link, appliedThrough } = req.body;

        // Optional: Check if the user exists
        const userExists = await User.findByPk(username);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new job associated with the username
        const newJob = await Jobs.create({ job_title, company_name, job_description, job_applied_link, username, appliedThrough });

        const leaderBoardJobEntry = await LeaderBoard.findOne({
            where: {
                username
            }
        });
        if (leaderBoardJobEntry) {
            await leaderBoardJobEntry.increment('numberOfJobs');
        }
        else {
            console.log('Leader Board entry not found for the user. Consider adding one')
        }

        res.status(201).json({ message: 'Job saved successfully', job: newJob });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// exports.getUserJobs = async (req, res) => {
//     try {
//         const username = req.params.username;
//         const search = req.query.search; // get the search query from query parameters

//         // Check if the user exists
//         const userExists = await User.findByPk(username);
//         if (!userExists) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const whereClause = {
//             username: username,
//             [Op.or]: [ // Use Sequelize's OR operator
//                 {
//                     job_title: {
//                         [Op.iLike]: `%${search}%` // Use iLike for case-insensitive search
//                     }
//                 },
//                 {
//                     company_name: {
//                         [Op.iLike]: `%${search}%`
//                     }
//                 }
//             ]
//         };

//         // If search is not provided or empty, don't filter by job_title or company_name
//         if (!search) {
//             delete whereClause[Op.or];
//         }

//         // Retrieve all jobs associated with the user
//         const userJobs = await Jobs.findAll({
//             where: { username: username },
//             order: [['id', 'DESC']]
//         });

//         // Return the found jobs
//         res.status(200).json(userJobs);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

exports.getUserJobs = async (req, res) => {
    try {
        const username = req.params.username;
        const search = req.query.search || ''; // Use an empty string as the default search value

        const userExists = await User.findByPk(username);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        let whereClause = { username: username };
        if (search.trim()) {
            whereClause[Op.or] = [
                { job_title: { [Op.like]: `%${search}%` } },
                { company_name: { [Op.like]: `%${search}%` } }
            ];
        }

        const userJobs = await Jobs.findAll({
            where: whereClause,
            order: [['id', 'DESC']]
        });

        res.status(200).json(userJobs);
    } catch (error) {
        console.error('Error fetching user jobs:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

exports.deleteUserJobs = async (req, res) => {
    try {
        let id = req.params.id;
        const jobToDelete = await Jobs.findByPk(id);
        if (!jobToDelete) {
            return res.status(404).send('Job not found');
        }
        const { username } = jobToDelete;
        await Jobs.destroy({ where: { id: id } });
        console.log('Job deleted');

        await LeaderBoard.decrement('numberOfJobs', { 
            where: { 
                username: username 
            } 
        });
        console.log('numberOfJobs decremented successfully for user:', username);
        res.send('Job deleted and numberOfJobs decremented successfully');
    } catch (error) {
        console.error('Error occurred while deleting:', error);
        res.status(500).send('An error occurred');
    }
};

exports.editUserJobs = async (req, res) => {
    try {
        let id = req.params.id;
        await Jobs.update(req.body, {
            where: { id: id }
        })
        res.send('successfully updated')
    }
    catch (error) {
        console.error('Problem occurred while editing', error)
    }
}

exports.jobStatsPie = async (req, res) => {
    try {
        const username = req.params.username;

        // Aggregate job data
        const jobStats = await Jobs.findAll({
            where: { username: username },
            attributes: [
                [Sequelize.literal(`SUM(application_processing)`), 'application_processing'],
                [Sequelize.literal(`SUM(following_up)`), 'following_up'],
                [Sequelize.literal(`SUM(interviewing)`), 'interviewing'],
                [Sequelize.literal(`SUM(rejected)`), 'rejected']
            ],
            raw: true
        });

        res.status(200).json(jobStats[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getJobStatsByTimeFrame = async (req, res) => {
    try {
        const { timeFrame } = req.params;
        const timeZone = decodeURIComponent(req.params.timeZone);
        const username = req.params.username;

        // Check if the timezone is valid
        if (!moment.tz.zone(timeZone)) {
            return res.status(400).json({ error: 'Invalid or unsupported time zone' });
        }

        console.log('Decoded timeZone:', timeZone);

        const getDateRange = (timeFrame) => {
            let start, end = moment().tz(timeZone).endOf('day');
            switch (timeFrame) {
                case 'week':
                    start = moment().tz(timeZone).startOf('isoWeek');
                    break;
                case 'month':
                    start = moment().tz(timeZone).startOf('month');
                    break;
                case '6months':
                    start = moment().tz(timeZone).subtract(6, 'months').startOf('day');
                    break;
                case 'year':
                    start = moment().tz(timeZone).startOf('year');
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid time frame' });
            }
            return { start, end };
        };

        const { start, end } = getDateRange(timeFrame);
        const Sequelize = require('sequelize');
        const Op = Sequelize.Op;

        let groupBy, dateFormat;
        switch (timeFrame) {
            case 'week':
                groupBy = Sequelize.fn('DATE', Sequelize.fn('CONVERT_TZ', Sequelize.col('job_applied_date'), '+00:00', timeZone));
                dateFormat = 'dddd';
                break;

            case 'month':
                groupBy = Sequelize.fn('DATE', Sequelize.col('job_applied_date'));
                dateFormat = 'YYYY-MM-DD';
                break;
            case '6months':
            case 'year':
                groupBy = Sequelize.fn('MONTH', Sequelize.col('job_applied_date'));
                dateFormat = 'MMMM';
                break;
        }
        console.log('Group By:', groupBy, 'Date Format:', dateFormat, 'TimeZone for CONVERT_TZ:', timeZone);



        const jobStats = await Jobs.findAll({
            where: {
                username: username,
                job_applied_date: { [Op.between]: [start.toDate(), end.toDate()] }
            },
            attributes: [
                ['job_applied_date', 'appliedDate'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'jobCount']
            ],
            group: ['job_applied_date'],
            raw: true
        });

        console.log("Raw Stats:", jobStats);

        let aggregatedStats = {};

        jobStats.forEach(stat => {
            try {
                let convertedDate = moment(stat.appliedDate).tz(timeZone);
                let dateLabel = convertedDate.format(dateFormat);

                // Aggregate the job counts
                if (!aggregatedStats[dateLabel]) {
                    aggregatedStats[dateLabel] = { date: dateLabel, jobCount: 0 };
                }
                aggregatedStats[dateLabel].jobCount += stat.jobCount;

            } catch (e) {
                console.error("Date Formatting Error:", e.message, "Raw Date:", stat.appliedDate);
            }
        });

        // Converting the aggregated object back into an array
        const formattedStats = Object.values(aggregatedStats);

        res.json(formattedStats);

        // const formattedStats = jobStats.map(stat => {
        //     try {
        //         let convertedDate = moment(stat.appliedDate).tz(timeZone);
        //         let dateLabel = convertedDate.format(dateFormat);
        //         return {
        //             date: dateLabel,
        //             jobCount: stat.jobCount
        //         };
        //     } catch (e) {
        //         console.error("Date Formatting Error:", e.message, "Raw Date:", stat.appliedDate);
        //         return {
        //             date: 'Error',
        //             jobCount: stat.jobCount
        //         };
        //     }
        // });
        // res.json(formattedStats);
    } catch (error) {
        console.error('Error fetching job stats by timeframe:', error);
        res.status(500).send('Internal Server Error');
    }
};



exports.showJobDetailsSingle = async (req, res) => {
    try {
        const username = req.params.username;
        const id = req.params.id;

        // findByPk expects a primary key as its argument, not an object with a where clause.
        const userExists = await User.findByPk(username);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // findByPk is used to retrieve an entry by its primary key, which should be the id in this case.
        const findSingleJob = await Jobs.findByPk(id);

        // Check if the job exists and is associated with the user.
        if (!findSingleJob || findSingleJob.username !== username) {
            return res.status(404).json({ error: 'Job not found or not associated with the user' });
        }

        // Use res.status(200) instead of res(200) to send the response.
        return res.status(200).json(findSingleJob);
        // This console.log won't run because the return above exits the function.
        // console.log('Job details fetched successfully');
    } catch (error) {
        console.error('error fetching job details:', error);
        // Make sure to send a response back even when there's an error.
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
