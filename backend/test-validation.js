const mongoose = require('mongoose');
const Job = require('./models/Job');
const Reminder = require('./models/Reminder');
const User = require('./models/User');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-tracker');
        console.log('Connected to DB');

        const user = await User.findOne();
        if (!user) {
            console.log('No user found, creating a dummy user...');
            // Optional: create a dummy user if not exists
            return;
        }

        console.log('--- Testing Advanced Job Model ---');
        const jobData = {
            company: 'Advanced Tech Corp',
            title: 'Senior Agent Engineer',
            user: user._id,
            contacts: [
                { name: 'Sarah Recruiter', role: 'Talent Acquisition', email: 'sarah@techcorp.com' }
            ],
            interviewRounds: [
                { roundName: 'Initial Screen', type: 'HR', status: 'Completed', notes: 'Went well!' }
            ],
            tags: ['AI', 'Remote', 'High Pay']
        };

        const job = await Job.create(jobData);
        console.log('✅ Job with advanced fields created:', job._id);

        console.log('--- Testing Advanced Reminder Model ---');
        const reminderData = {
            user: user._id,
            job: job._id,
            title: 'Prep for technical round',
            reminderDate: new Date(Date.now() + 86400000), // Tomorrow
            category: 'Technical Prep',
            tags: ['LeetCode', 'System Design'],
            activityLog: [
                { action: 'Reminder created', newValue: 'Initial setup' }
            ]
        };

        const reminder = await Reminder.create(reminderData);
        console.log('✅ Reminder with advanced fields created:', reminder._id);

        // Cleanup (Optional)
        // await Job.findByIdAndDelete(job._id);
        // await Reminder.findByIdAndDelete(reminder._id);

    } catch (error) {
        console.error('❌ Validation Error Details:');
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`- ${key}: ${error.errors[key].message}`);
            });
        } else {
            console.error(error);
        }
    } finally {
        await mongoose.connection.close();
    }
}

test();
