const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile,
    updatePreferences
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
    registerValidation,
    loginValidation,
    validate
} = require('../validators/authValidator');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(protect);
router.post('/logout', logout);
router.get('/me', getProfile);
router.put('/profile', updateProfile);
router.put('/preferences', updatePreferences);

module.exports = router;
