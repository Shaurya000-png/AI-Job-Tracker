const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-tracker');
        console.log('Connected to DB');

        const user = await User.findOne();
        if (!user) {
            console.log('No user found');
            process.exit(1);
        }

        const data = {
            company: 'Complex URL Test',
            title: 'Engineer',
            jobType: 'Full-Time',
            status: 'Applied',
            priority: 'Medium',
            location: 'Remote',
            applicationDate: new Date(),
            jobLink: 'https://www.linkedin.com/jobs/view/1234567890/?refId=abc&trackingId=xyz',
            notes: 'Testing complex URL',
            user: user._id
        };

        console.log('Attempting to create job with data:', data);
        const job = await Job.create(data);
        console.log('Job created successfully:', job._id);

    } catch (error) {
        console.error('Validation Error Details:');
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
