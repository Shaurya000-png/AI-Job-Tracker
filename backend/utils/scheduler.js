const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendReminderEmail, sendFollowUpEmail } = require('./emailService');

// Check for due reminders every hour
const checkReminders = cron.schedule('0 * * * *', async () => {
    try {
        console.log('🔍 Checking for due reminders...');

        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        // Find reminders that are due within the next hour and haven't been notified
        const dueReminders = await Reminder.find({
            reminderDate: { $lte: oneHourFromNow },
            isCompleted: false,
            notificationSent: false,
            isDeleted: false
        }).populate('user', 'name email preferences')
            .populate('job', 'company title status jobLink');

        console.log(`📬 Found ${dueReminders.length} due reminders`);

        for (const reminder of dueReminders) {
            // Check if user has email notifications enabled
            if (reminder.user.preferences?.emailNotifications &&
                reminder.user.preferences?.reminderNotifications) {

                await sendReminderEmail(
                    reminder.user.email,
                    reminder.user.name,
                    reminder
                );
            }

            // Mark notification as sent
            reminder.notificationSent = true;
            reminder.notificationSentAt = new Date();
            await reminder.save();
        }

        console.log('✅ Reminder check completed');
    } catch (error) {
        console.error('❌ Error checking reminders:', error.message);
    }
}, {
    scheduled: false // Don't start automatically
});

// Check for job follow-ups every day at 9 AM
const checkFollowUps = cron.schedule('0 9 * * *', async () => {
    try {
        console.log('🔍 Checking for job follow-ups...');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find jobs with follow-up dates today
        const jobsToFollowUp = await Job.find({
            nextFollowUpDate: {
                $gte: today,
                $lt: tomorrow
            },
            isDeleted: false,
            status: { $nin: ['Rejected', 'Withdrawn', 'Offer'] }
        }).populate('user', 'name email preferences');

        console.log(`📬 Found ${jobsToFollowUp.length} jobs requiring follow-up`);

        for (const job of jobsToFollowUp) {
            // Check if user has email notifications enabled
            if (job.user.preferences?.emailNotifications) {
                await sendFollowUpEmail(
                    job.user.email,
                    job.user.name,
                    job
                );
            }
        }

        console.log('✅ Follow-up check completed');
    } catch (error) {
        console.error('❌ Error checking follow-ups:', error.message);
    }
}, {
    scheduled: false
});

// Start all schedulers
const startSchedulers = () => {
    console.log('🚀 Starting schedulers...');
    checkReminders.start();
    checkFollowUps.start();
    console.log('✅ Schedulers started successfully');
    console.log('   - Reminder check: Every hour');
    console.log('   - Follow-up check: Daily at 9 AM');
};

// Stop all schedulers
const stopSchedulers = () => {
    console.log('🛑 Stopping schedulers...');
    checkReminders.stop();
    checkFollowUps.stop();
    console.log('✅ Schedulers stopped');
};

module.exports = {
    startSchedulers,
    stopSchedulers,
    checkReminders,
    checkFollowUps
};
