const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    restoreJob,
    permanentlyDeleteJob,
    bulkUpdateStatus
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { jobValidation, validate } = require('../validators/jobValidator');

// All routes are protected
router.use(protect);

// Bulk operations (must be before /:id routes)
router.post('/bulk-update', bulkUpdateStatus);

// CRUD routes
router.route('/')
    .get(getJobs)
    .post(jobValidation, validate, createJob);

router.route('/:id')
    .get(getJobById)
    .put(jobValidation, validate, updateJob)
    .delete(deleteJob);

// Additional operations
router.post('/:id/restore', restoreJob);
router.delete('/:id/permanent', permanentlyDeleteJob);

module.exports = router;
