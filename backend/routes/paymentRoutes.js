const express = require('express');
const { processPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/process', protect, processPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;