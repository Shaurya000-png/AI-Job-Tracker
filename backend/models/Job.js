const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    title: {
        type: String,
        required: [true, 'Please provide a job title'],
        trim: true,
        maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    jobType: {
        type: String,
        enum: ['Internship', 'Full-Time', 'Contract', 'Part-Time'],
        default: 'Full-Time'
    },
    status: {
        type: String,
        enum: ['Applied', 'OA', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
        default: 'Applied',
        index: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    location: {
        type: String,
        enum: ['Remote', 'On-site', 'Hybrid'],
        default: 'Remote'
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    nextFollowUpDate: {
        type: Date
    },
    salaryRange: {
        min: {
            type: Number,
            min: 0
        },
        max: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    jobLink: {
        type: String,
        trim: true,
        match: [
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?.*$/,
            'Please provide a valid URL'
        ]
    },
    notes: {
        type: String,
        maxlength: [2000, 'Notes cannot exceed 2000 characters']
    },
    tags: [{
        type: String,
        trim: true
    }],
    resumeVersion: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    activityLog: [{
        action: {
            type: String,
            required: true
        },
        oldValue: String,
        newValue: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Compound indexes for optimized queries
jobSchema.index({ user: 1, status: 1 });
jobSchema.index({ user: 1, company: 1 });
jobSchema.index({ user: 1, applicationDate: -1 });
jobSchema.index({ user: 1, isDeleted: 1 });

// Add activity log entry before updating
jobSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.$set && update.$set.status) {
        // This will be handled in the controller for better access to old values
    }

    next();
});

module.exports = mongoose.model('Job', jobSchema);
