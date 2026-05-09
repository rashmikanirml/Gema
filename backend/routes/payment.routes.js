const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticateToken } = require('../middleware/auth');

// Protected routes
router.post('/', authenticateToken, paymentController.processPayment);
router.get('/booking/:bookingId', authenticateToken, paymentController.getPaymentByBooking);
router.get('/:id', authenticateToken, paymentController.getPaymentById);

// Admin routes
router.get('/admin/all', authenticateToken, paymentController.getAllPayments);

module.exports = router;
