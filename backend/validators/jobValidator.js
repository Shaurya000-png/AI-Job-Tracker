const { body, query, validationResult } = require('express-validator');

// Validation rules for creating/updating jobs
const jobValidation = [
    body('company')
        .trim()
        .notEmpty().withMessage('Company name is required')
        .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),

    body('title')
        .trim()
        .notEmpty().withMessage('Job title is required')
        .isLength({ max: 100 }).withMessage('Job title cannot exceed 100 characters'),

    body('jobType')
        .optional({ checkFalsy: true })
        .isIn(['Internship', 'Full-Time', 'Contract', 'Part-Time']).withMessage('Invalid job type'),

    body('status')
        .optional({ checkFalsy: true })
        .isIn(['Applied', 'OA', 'Interview', 'Offer', 'Rejected', 'Withdrawn']).withMessage('Invalid status'),

    body('priority')
        .optional({ checkFalsy: true })
        .isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),

    body('location')
        .optional({ checkFalsy: true })
        .isIn(['Remote', 'On-site', 'Hybrid']).withMessage('Invalid location'),

    body('applicationDate')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Invalid date format'),

    body('nextFollowUpDate')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Invalid date format'),

    body('salaryRange.min')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('Minimum salary must be a number')
        .custom((value) => value >= 0).withMessage('Minimum salary cannot be negative'),

    body('salaryRange.max')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('Maximum salary must be a number')
        .custom((value, { req }) => {
            if (req.body.salaryRange && req.body.salaryRange.min && value < req.body.salaryRange.min) {
                throw new Error('Maximum salary cannot be less than minimum salary');
            }
            return true;
        }),

    body('jobLink')
        .optional({ checkFalsy: true })
        .trim()
        .custom((value) => {
            if (value && !value.startsWith('http')) {
                // Prepend http if missing for validation
                value = 'https://' + value;
            }
            return true;
        }),

    body('notes')
        .optional({ checkFalsy: true })
        .isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),

    body('tags')
        .optional({ checkFalsy: true })
        .isArray().withMessage('Tags must be an array'),

    body('resumeVersion')
        .optional({ checkFalsy: true })
        .trim()
];

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        return res.status(400).json({
            success: false,
            message: errorArray[0].message,
            errors: errorArray
        });
    }
    next();
};

module.exports = {
    jobValidation,
    validate
};
