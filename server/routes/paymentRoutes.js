const express = require('express');
const router = express.Router();
const { recordPayment, getAllPayments, getPaymentById } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, adminOnly, recordPayment);
router.get('/', protect, adminOnly, getAllPayments);
router.get('/:id', protect, adminOnly, getPaymentById);

module.exports = router;
