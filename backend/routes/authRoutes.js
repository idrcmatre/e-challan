/**
 * Authentication Routes
 * Defines API endpoints for user authentication and profile management
 */

const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - no authentication required
router.post('/register', registerUser); // Register new user account
router.post('/login', loginUser); // Login existing user

// Protected routes - authentication required
router.get('/profile', protect, getProfile); // Get user profile
router.put('/profile', protect, updateProfile); // Update user profile

module.exports = router;