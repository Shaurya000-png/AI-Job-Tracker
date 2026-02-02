const express = require('express');
const router = express.Router();
const {
    createReminder,
    getReminders,
    getReminderById,
    updateReminder,
    deleteReminder,
    markComplete,
    getReminderStats
} = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');
const { reminderValidation, validate } = require('../validators/reminderValidator');

// All routes are protected
router.use(protect);

// Stats route (must be before /:id routes)
router.get('/stats', getReminderStats);

// CRUD routes
router.route('/')
    .get(getReminders)
    .post(reminderValidation, validate, createReminder);

router.route('/:id')
    .get(getReminderById)
    .put(reminderValidation, validate, updateReminder)
    .delete(deleteReminder);

// Mark complete/incomplete
router.patch('/:id/complete', markComplete);

module.exports = router;
