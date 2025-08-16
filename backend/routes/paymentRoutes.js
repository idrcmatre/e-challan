/**
 * Payment Routes
 * Defines API endpoints for payment processing and history
 */

const express = require('express');
const { processPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Payment processing endpoint - processes mock payments for challans
router.post('/process', protect, processPayment);

// Payment history endpoint - retrieves user's payment history
router.get('/history', protect, getPaymentHistory);

module.exports = router;