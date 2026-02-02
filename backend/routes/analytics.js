const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getApplicationTrends,
    getUpcomingFollowUps,
    getActivityTimeline
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/trends', getApplicationTrends);
router.get('/follow-ups', getUpcomingFollowUps);
router.get('/activity', getActivityTimeline);

module.exports = router;
