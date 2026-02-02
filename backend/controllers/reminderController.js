const Reminder = require('../models/Reminder');
const Job = require('../models/Job');
const { AppError } = require('../middleware/errorHandler');

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
exports.createReminder = async (req, res, next) => {
    try {
        const { job, title, description, reminderDate, priority } = req.body;

        // Validate reminder date is in the future
        if (new Date(reminderDate) <= new Date()) {
            return next(new AppError('Reminder date must be in the future', 400));
        }

        // If job is provided, verify it exists and belongs to user
        if (job) {
            const jobExists = await Job.findOne({ _id: job, user: req.user.id, isDeleted: false });
            if (!jobExists) {
                return next(new AppError('Job not found', 404));
            }
        }

        const reminder = await Reminder.create({
            user: req.user.id,
            job,
            title,
            description,
            reminderDate,
            priority
        });

        // Populate job details if exists
        await reminder.populate('job', 'company title status');

        const { successResponse } = require('../utils/response');
        successResponse(res, 201, reminder, 'Reminder created successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
exports.getReminders = async (req, res, next) => {
    try {
        const { status, priority, startDate, endDate, jobId } = req.query;

        // Build query
        const query = { user: req.user.id, isDeleted: false };

        // Filter by completion status
        if (status === 'completed') {
            query.isCompleted = true;
        } else if (status === 'pending') {
            query.isCompleted = false;
        } else if (status === 'overdue') {
            query.isCompleted = false;
            query.reminderDate = { $lt: new Date() };
        } else if (status === 'upcoming') {
            query.isCompleted = false;
            query.reminderDate = { $gte: new Date() };
        }

        // Filter by priority
        if (priority) {
            query.priority = priority;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.reminderDate = {};
            if (startDate) query.reminderDate.$gte = new Date(startDate);
            if (endDate) query.reminderDate.$lte = new Date(endDate);
        }

        // Filter by job
        if (jobId) {
            query.job = jobId;
        }

        const reminders = await Reminder.find(query)
            .populate('job', 'company title status')
            .sort({ reminderDate: 1 });

        const { successResponse } = require('../utils/response');
        successResponse(res, 200, reminders, 'Reminders retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
exports.getReminderById = async (req, res, next) => {
    try {
        const reminder = await Reminder.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        }).populate('job', 'company title status jobType location');

        if (!reminder) {
            return next(new AppError('Reminder not found', 404));
        }

        res.status(200).json({
            success: true,
            data: reminder
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
exports.updateReminder = async (req, res, next) => {
    try {
        const { title, description, reminderDate, priority } = req.body;

        let reminder = await Reminder.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!reminder) {
            return next(new AppError('Reminder not found', 404));
        }

        // Validate reminder date if provided
        if (reminderDate && new Date(reminderDate) <= new Date() && !reminder.isCompleted) {
            return next(new AppError('Reminder date must be in the future', 400));
        }

        // Update fields
        if (title) reminder.title = title;
        if (description !== undefined) reminder.description = description;
        if (reminderDate) {
            reminder.reminderDate = reminderDate;
            // Reset notification if date changed
            reminder.notificationSent = false;
            reminder.notificationSentAt = null;
        }
        if (priority) reminder.priority = priority;

        await reminder.save();
        await reminder.populate('job', 'company title status');

        res.status(200).json({
            success: true,
            data: reminder
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark reminder as complete
// @route   PATCH /api/reminders/:id/complete
// @access  Private
exports.markComplete = async (req, res, next) => {
    try {
        const reminder = await Reminder.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!reminder) {
            return next(new AppError('Reminder not found', 404));
        }

        reminder.isCompleted = !reminder.isCompleted;
        reminder.completedAt = reminder.isCompleted ? new Date() : null;

        await reminder.save();
        await reminder.populate('job', 'company title status');

        res.status(200).json({
            success: true,
            data: reminder
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete reminder (soft delete)
// @route   DELETE /api/reminders/:id
// @access  Private
exports.deleteReminder = async (req, res, next) => {
    try {
        const reminder = await Reminder.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!reminder) {
            return next(new AppError('Reminder not found', 404));
        }

        reminder.isDeleted = true;
        await reminder.save();

        const { successResponse } = require('../utils/response');
        successResponse(res, 200, null, 'Reminder deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Get reminder statistics
// @route   GET /api/reminders/stats
// @access  Private
exports.getReminderStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        const [total, completed, pending, overdue, upcoming] = await Promise.all([
            Reminder.countDocuments({ user: userId, isDeleted: false }),
            Reminder.countDocuments({ user: userId, isDeleted: false, isCompleted: true }),
            Reminder.countDocuments({ user: userId, isDeleted: false, isCompleted: false }),
            Reminder.countDocuments({
                user: userId,
                isDeleted: false,
                isCompleted: false,
                reminderDate: { $lt: now }
            }),
            Reminder.countDocuments({
                user: userId,
                isDeleted: false,
                isCompleted: false,
                reminderDate: { $gte: now }
            })
        ]);

        const { successResponse } = require('../utils/response');
        successResponse(res, 200, {
            total,
            completed,
            pending,
            overdue,
            upcoming
        }, 'Reminder statistics retrieved successfully');
    } catch (error) {
        next(error);
    }
};
