const { body, validationResult } = require('express-validator');

// Validation rules for creating/updating reminders
exports.reminderValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),

    body('reminderDate')
        .notEmpty()
        .withMessage('Reminder date is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),

    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority must be Low, Medium, or High'),

    body('job')
        .optional()
        .isMongoId()
        .withMessage('Please provide a valid job ID'),

    body('category')
        .optional()
        .isIn(['Interview', 'OA', 'Follow-up', 'Networking', 'Technical Prep', 'Other'])
        .withMessage('Invalid category'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];

// Middleware to check validation results
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};
