const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth');

// Protected routes
router.post('/', authenticateToken, bookingController.createBooking);
router.get('/', authenticateToken, bookingController.getMyBookings);
router.get('/:id', authenticateToken, bookingController.getBookingById);
router.put('/:id/cancel', authenticateToken, bookingController.cancelBooking);

// Admin routes
router.get('/admin/all', authenticateToken, bookingController.getAllBookings);

module.exports = router;
