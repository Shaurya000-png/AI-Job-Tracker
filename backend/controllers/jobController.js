const Job = require('../models/Job');
const { ValidationError, NotFoundError } = require('../middleware/errorHandler');
const { successResponse, paginatedResponse } = require('../utils/response');

// @desc    Create a new job application
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res, next) => {
    try {
        const jobData = {
            ...req.body,
            user: req.user._id
        };

        const job = await Job.create(jobData);

        // Add creation activity log
        job.activityLog.push({
            action: 'Job application created',
            newValue: `${job.company} - ${job.title}`,
            timestamp: new Date()
        });
        await job.save();

        successResponse(res, 201, { job }, 'Job application created successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Get all job applications with filters, search, and pagination
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res, next) => {
    try {
        const {
            status,
            priority,
            jobType,
            location,
            company,
            search,
            sort = '-applicationDate',
            page = 1,
            limit = 10,
            includeDeleted = 'false'
        } = req.query;

        // Build query
        const query = { user: req.user._id };

        // Filter by deleted status
        query.isDeleted = includeDeleted === 'true' ? true : false;

        // Apply filters
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (jobType) query.jobType = jobType;
        if (location) query.location = location;
        if (company) query.company = new RegExp(company, 'i'); // Case-insensitive search

        // Search across multiple fields
        if (search) {
            query.$or = [
                { company: new RegExp(search, 'i') },
                { title: new RegExp(search, 'i') },
                { notes: new RegExp(search, 'i') },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const jobs = await Job.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        // Get total count
        const totalItems = await Job.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limitNum);

        // Pagination metadata
        const pagination = {
            page: pageNum,
            limit: limitNum,
            totalPages,
            totalItems,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        };

        paginatedResponse(res, 200, { jobs }, pagination, 'Jobs retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!job) {
            throw new NotFoundError('Job not found');
        }

        successResponse(res, 200, { job }, 'Job retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Update job application
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!job) {
            throw new NotFoundError('Job not found');
        }

        // Track status changes in activity log
        if (req.body.status && req.body.status !== job.status) {
            job.activityLog.push({
                action: 'Status changed',
                oldValue: job.status,
                newValue: req.body.status,
                timestamp: new Date()
            });
        }

        // Track other significant changes
        if (req.body.company && req.body.company !== job.company) {
            job.activityLog.push({
                action: 'Company changed',
                oldValue: job.company,
                newValue: req.body.company,
                timestamp: new Date()
            });
        }

        // Update job fields
        Object.keys(req.body).forEach(key => {
            if (key !== 'user' && key !== 'activityLog') {
                job[key] = req.body[key];
            }
        });

        await job.save();

        successResponse(res, 200, { job }, 'Job updated successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Soft delete job application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!job) {
            throw new NotFoundError('Job not found');
        }

        job.isDeleted = true;
        job.activityLog.push({
            action: 'Job deleted',
            timestamp: new Date()
        });
        await job.save();

        successResponse(res, 200, { job }, 'Job deleted successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Restore soft-deleted job
// @route   POST /api/jobs/:id/restore
// @access  Private
const restoreJob = async (req, res, next) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
            isDeleted: true
        });

        if (!job) {
            throw new NotFoundError('Deleted job not found');
        }

        job.isDeleted = false;
        job.activityLog.push({
            action: 'Job restored',
            timestamp: new Date()
        });
        await job.save();

        successResponse(res, 200, { job }, 'Job restored successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Permanently delete job
// @route   DELETE /api/jobs/:id/permanent
// @access  Private
const permanentlyDeleteJob = async (req, res, next) => {
    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!job) {
            throw new NotFoundError('Job not found');
        }

        successResponse(res, 200, null, 'Job permanently deleted');
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk update job status
// @route   POST /api/jobs/bulk-update
// @access  Private
const bulkUpdateStatus = async (req, res, next) => {
    try {
        const { jobIds, status } = req.body;

        if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
            throw new ValidationError('Please provide an array of job IDs');
        }

        if (!status) {
            throw new ValidationError('Please provide a status');
        }

        // Update all jobs
        const result = await Job.updateMany(
            {
                _id: { $in: jobIds },
                user: req.user._id,
                isDeleted: false
            },
            {
                $set: { status },
                $push: {
                    activityLog: {
                        action: 'Bulk status update',
                        newValue: status,
                        timestamp: new Date()
                    }
                }
            }
        );

        successResponse(res, 200, {
            modifiedCount: result.modifiedCount
        }, `${result.modifiedCount} jobs updated successfully`);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    restoreJob,
    permanentlyDeleteJob,
    bulkUpdateStatus
};
