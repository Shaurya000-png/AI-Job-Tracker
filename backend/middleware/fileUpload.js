const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./errorHandler');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const resumeDir = path.join(uploadDir, 'resumes');

if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resumeDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: userId_timestamp_originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const sanitizedBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${req.user.id}_${uniqueSuffix}_${sanitizedBasename}${ext}`);
    }
});

// File filter - only allow PDF and DOCX
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ];

    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new AppError('Only PDF and DOCX files are allowed', 400), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError('File size exceeds the limit of 5MB', 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new AppError('Unexpected field in file upload', 400));
        }
        return next(new AppError(err.message, 400));
    }
    next(err);
};

module.exports = {
    uploadResume: upload.single('resume'),
    handleMulterError
};
