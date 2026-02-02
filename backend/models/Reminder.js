const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: false // Can have reminders not tied to specific jobs
    },
    title: {
        type: String,
        required: [true, 'Please provide a reminder title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    reminderDate: {
        type: Date,
        required: [true, 'Please provide a reminder date'],
        index: true
    },
    isCompleted: {
        type: Boolean,
        default: false,
        index: true
    },
    completedAt: {
        type: Date
    },
    notificationSent: {
        type: Boolean,
        default: false
    },
    notificationSentAt: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    category: {
        type: String,
        enum: ['Interview', 'OA', 'Follow-up', 'Networking', 'Technical Prep', 'Other'],
        default: 'Other'
    },
    tags: [{
        type: String,
        trim: true
    }],
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
    }],
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

// Compound indexes for optimized queries
reminderSchema.index({ user: 1, reminderDate: 1 });
reminderSchema.index({ user: 1, isCompleted: 1 });
reminderSchema.index({ user: 1, isDeleted: 1 });
reminderSchema.index({ reminderDate: 1, notificationSent: 1 });

// Virtual for checking if reminder is overdue
reminderSchema.virtual('isOverdue').get(function () {
    return !this.isCompleted && new Date() > this.reminderDate;
});

// Ensure virtuals are included in JSON
reminderSchema.set('toJSON', { virtuals: true });
reminderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reminder', reminderSchema);
