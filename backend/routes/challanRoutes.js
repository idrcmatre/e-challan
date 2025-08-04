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

router.get('/stats', protect, getDashboardStats);
router.route('/')
    .get(protect, getChallans)
    .post(protect, authorize('officer', 'admin'), createChallan);

router.route('/:id')
    .get(protect, getChallanById)
    .put(protect, updateChallan)
    .delete(protect, authorize('officer', 'admin'), deleteChallan);

module.exports = router;