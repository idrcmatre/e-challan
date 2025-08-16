/**
 * Challan Routes
 * Defines API endpoints for challan (e-ticket) management
 */

const express = require('express');
const {
    getChallans,
    getChallanById,
    createChallan,
    updateChallan,
    deleteChallan,
    getDashboardStats
} = require('../controllers/challanController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Dashboard statistics endpoint - available to all authenticated users
router.get('/stats', protect, getDashboardStats);

// Challan collection routes
router.route('/')
    .get(protect, getChallans) // Get all challans (filtered by user role)
    .post(protect, authorize('officer', 'admin'), createChallan); // Create new challan (officers/admins only)

// Individual challan routes
router.route('/:id')
    .get(protect, getChallanById) // Get specific challan by ID
    .put(protect, updateChallan) // Update challan (with permission checks)
    .delete(protect, authorize('officer', 'admin'), deleteChallan); // Delete challan (officers/admins only)

module.exports = router;