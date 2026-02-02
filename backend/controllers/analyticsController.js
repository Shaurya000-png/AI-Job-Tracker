const Job = require('../models/Job');
const { successResponse } = require('../utils/response');
const { startOfWeek, startOfMonth, subDays, subWeeks, subMonths, format } = require('date-fns');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Total jobs (excluding deleted)
        const totalJobs = await Job.countDocuments({
            user: userId,
            isDeleted: false
        });

        // Total active jobs (excluding deleted and terminal statuses)
        const activeJobs = await Job.countDocuments({
            user: userId,
            isDeleted: false,
            status: { $in: ['Applied', 'OA', 'Interview'] }
        });

        // Status breakdown
        const statusBreakdown = await Job.aggregate([
            {
                $match: {
                    user: userId,
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Priority distribution
        const priorityDistribution = await Job.aggregate([
            {
                $match: {
                    user: userId,
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Job type distribution
        const jobTypeDistribution = await Job.aggregate([
            {
                $match: {
                    user: userId,
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: '$jobType',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Recent applications (last 7 days)
        const sevenDaysAgo = subDays(new Date(), 7);
        const recentApplications = await Job.countDocuments({
            user: userId,
            isDeleted: false,
            applicationDate: { $gte: sevenDaysAgo }
        });

        // Upcoming follow-ups (next 7 days)
        const sevenDaysFromNow = subDays(new Date(), -7);
        const upcomingFollowUps = await Job.countDocuments({
            user: userId,
            isDeleted: false,
            nextFollowUpDate: {
                $gte: new Date(),
                $lte: sevenDaysFromNow
            }
        });

        // Convert status breakdown array to object for easier frontend access
        const byStatus = statusBreakdown.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        successResponse(res, 200, {
            total: totalJobs,
            active: activeJobs,
            byStatus,
            priorityDistribution: priorityDistribution.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            jobTypeDistribution: jobTypeDistribution.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            recentApplications,
            upcomingFollowUps
        }, 'Dashboard statistics retrieved successfully');

    } catch (error) {
        next(error);
    }
};

// @desc    Get application trends over time
// @route   GET /api/analytics/trends
// @access  Private
const getApplicationTrends = async (req, res, next) => {
    try {
        const { range = 'month' } = req.query; // week or month
        const userId = req.user._id;

        let startDate;
        let groupBy;

        if (range === 'week') {
            // Last 4 weeks
            startDate = subWeeks(new Date(), 4);
            groupBy = {
                week: { $week: '$applicationDate' },
                year: { $year: '$applicationDate' }
            };
        } else {
            // Last 6 months
            startDate = subMonths(new Date(), 6);
            groupBy = {
                month: { $month: '$applicationDate' },
                year: { $year: '$applicationDate' }
            };
        }

        const trends = await Job.aggregate([
            {
                $match: {
                    user: userId,
                    isDeleted: false,
                    applicationDate: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 },
                    statuses: {
                        $push: '$status'
                    }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 }
            }
        ]);

        // Process trends for Recharts
        const chartData = trends.map(trend => {
            let label;
            try {
                if (range === 'week') {
                    label = `Week ${trend._id.week || '?'}, ${trend._id.year || '?'}`;
                } else {
                    const year = trend._id.year || new Date().getFullYear();
                    const month = trend._id.month || 1;
                    const monthName = format(new Date(year, month - 1), 'MMM');
                    label = `${monthName} ${year}`;
                }
            } catch (err) {
                label = 'Unknown Period';
            }

            const statusCounts = trend.statuses.reduce((acc, status) => {
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});

            return {
                date: label, // This matches dataKey="date" in Recharts
                count: trend.count, // This matches dataKey="count" in Recharts
                ...statusCounts
            };
        });

        successResponse(res, 200, {
            range,
            trends: chartData
        }, 'Application trends retrieved successfully');

    } catch (error) {
        next(error);
    }
};

// @desc    Get upcoming follow-ups
// @route   GET /api/analytics/follow-ups
// @access  Private
const getUpcomingFollowUps = async (req, res, next) => {
    try {
        const { days = 7 } = req.query;
        const userId = req.user._id;
        const futureDate = subDays(new Date(), -parseInt(days));

        const followUps = await Job.find({
            user: userId,
            isDeleted: false,
            nextFollowUpDate: {
                $gte: new Date(),
                $lte: futureDate
            }
        })
            .sort('nextFollowUpDate')
            .select('company title status nextFollowUpDate priority');

        successResponse(res, 200, {
            count: followUps.length,
            followUps
        }, 'Upcoming follow-ups retrieved successfully');

    } catch (error) {
        next(error);
    }
};

// @desc    Get activity timeline (recent activities)
// @route   GET /api/analytics/activity
// @access  Private
const getActivityTimeline = async (req, res, next) => {
    try {
        const { limit = 20 } = req.query;
        const userId = req.user._id;

        const jobs = await Job.find({
            user: userId,
            'activityLog.0': { $exists: true } // Has at least one activity
        })
            .select('company title activityLog')
            .sort('-updatedAt')
            .limit(parseInt(limit));

        // Flatten and sort all activities
        const activities = [];
        jobs.forEach(job => {
            job.activityLog.forEach(activity => {
                activities.push({
                    jobId: job._id,
                    company: job.company,
                    title: job.title,
                    action: activity.action,
                    oldValue: activity.oldValue,
                    newValue: activity.newValue,
                    timestamp: activity.timestamp
                });
            });
        });

        // Sort by timestamp descending
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Limit results
        const limitedActivities = activities.slice(0, parseInt(limit));

        successResponse(res, 200, {
            count: limitedActivities.length,
            activities: limitedActivities
        }, 'Activity timeline retrieved successfully');

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getApplicationTrends,
    getUpcomingFollowUps,
    getActivityTimeline
};
