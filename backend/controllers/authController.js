const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ValidationError, AuthError } = require('../middleware/errorHandler');
const { successResponse } = require('../utils/response');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        // Send response
        successResponse(res, 201, {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        }, 'User registered successfully');

    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists (include password field)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new AuthError('Invalid credentials');
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new AuthError('Invalid credentials');
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        // Send response
        successResponse(res, 200, {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        }, 'Login successful');

    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new ValidationError('Refresh token is required');
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user with this refresh token
        const user = await User.findOne({
            _id: decoded.id,
            refreshToken
        }).select('+refreshToken');

        if (!user) {
            throw new AuthError('Invalid refresh token');
        }

        // Generate new access token
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        // Update refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        successResponse(res, 200, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }, 'Token refreshed successfully');

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new AuthError('Invalid or expired refresh token'));
        }
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        // Clear refresh token from database
        req.user.refreshToken = undefined;
        await req.user.save();

        successResponse(res, 200, null, 'Logout successful');
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = async (req, res, next) => {
    try {
        successResponse(res, 200, {
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                preferences: req.user.preferences,
                profile: req.user.profile,
                createdAt: req.user.createdAt
            }
        }, 'Profile retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, location, linkedIn, portfolio } = req.body;

        const user = req.user;

        // Update basic fields
        if (name) user.name = name;

        // Update profile fields
        if (phone !== undefined) user.profile.phone = phone;
        if (location !== undefined) user.profile.location = location;
        if (linkedIn !== undefined) user.profile.linkedIn = linkedIn;
        if (portfolio !== undefined) user.profile.portfolio = portfolio;

        await user.save();

        successResponse(res, 200, {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile: user.profile
            }
        }, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
    try {
        const { emailNotifications, reminderNotifications, theme, timezone } = req.body;

        const user = req.user;

        // Update preferences
        if (emailNotifications !== undefined) {
            user.preferences.emailNotifications = emailNotifications;
        }
        if (reminderNotifications !== undefined) {
            user.preferences.reminderNotifications = reminderNotifications;
        }
        if (theme !== undefined) {
            user.preferences.theme = theme;
        }
        if (timezone !== undefined) {
            user.preferences.timezone = timezone;
        }

        await user.save();

        successResponse(res, 200, {
            preferences: user.preferences
        }, 'Preferences updated successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile,
    updatePreferences
};
