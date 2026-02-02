const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { protect } = require('../middleware/auth');
const { uploadResume, handleMulterError } = require('../middleware/fileUpload');
const { AppError } = require('../middleware/errorHandler');

// All routes are protected
router.use(protect);

// @desc    Upload resume file
// @route   POST /api/upload/resume
// @access  Private
router.post('/resume', uploadResume, handleMulterError, async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('Please upload a file', 400));
        }

        res.status(200).json({
            success: true,
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                path: req.file.path,
                uploadedAt: new Date()
            },
            message: 'File uploaded successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get list of uploaded resumes
// @route   GET /api/upload/resumes
// @access  Private
router.get('/resumes', async (req, res, next) => {
    try {
        const resumeDir = path.join(process.env.UPLOAD_PATH || './uploads', 'resumes');
        const files = await fs.readdir(resumeDir);

        // Filter files belonging to the current user
        const userFiles = files.filter(file => file.startsWith(req.user.id + '_'));

        // Get file details
        const fileDetails = await Promise.all(
            userFiles.map(async (filename) => {
                const filePath = path.join(resumeDir, filename);
                const stats = await fs.stat(filePath);

                // Extract original name from filename
                const parts = filename.split('_');
                const originalName = parts.slice(2).join('_');

                return {
                    filename,
                    originalName,
                    size: stats.size,
                    uploadedAt: stats.birthtime,
                    path: `/uploads/resumes/${filename}`
                };
            })
        );

        // Sort by upload date (newest first)
        fileDetails.sort((a, b) => b.uploadedAt - a.uploadedAt);

        res.status(200).json({
            success: true,
            count: fileDetails.length,
            data: fileDetails
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete resume file
// @route   DELETE /api/upload/resume/:filename
// @access  Private
router.delete('/resume/:filename', async (req, res, next) => {
    try {
        const { filename } = req.params;

        // Verify file belongs to user
        if (!filename.startsWith(req.user.id + '_')) {
            return next(new AppError('Unauthorized to delete this file', 403));
        }

        const resumeDir = path.join(process.env.UPLOAD_PATH || './uploads', 'resumes');
        const filePath = path.join(resumeDir, filename);

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch (err) {
            return next(new AppError('File not found', 404));
        }

        // Delete file
        await fs.unlink(filePath);

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Download resume file
// @route   GET /api/upload/resume/:filename
// @access  Private
router.get('/resume/:filename', async (req, res, next) => {
    try {
        const { filename } = req.params;

        // Verify file belongs to user
        if (!filename.startsWith(req.user.id + '_')) {
            return next(new AppError('Unauthorized to access this file', 403));
        }

        const resumeDir = path.join(process.env.UPLOAD_PATH || './uploads', 'resumes');
        const filePath = path.join(resumeDir, filename);

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch (err) {
            return next(new AppError('File not found', 404));
        }

        // Send file
        res.download(filePath);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
