const { Payment, Booking } = require('../models');
const crypto = require('crypto');

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    // Validate input
    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch booking
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check ownership
    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validate amount matches booking total
    if (amount !== booking.total_amount) {
      return res.status(400).json({
        error: 'Payment amount does not match booking total',
        expectedAmount: booking.total_amount
      });
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create payment
    const payment = await Payment.create({
      booking_id: bookingId,
      amount,
      status: 'pending', // In production, integrate with actual payment gateway
      transaction_id: transactionId,
      payment_method: paymentMethod
    });

    // Simulate payment processing (in production, call payment gateway)
    // For now, mark as completed
    await payment.update({ status: 'completed' });
    await booking.update({ status: 'confirmed' });

    res.status(201).json({
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        bookingId: payment.booking_id,
        amount: payment.amount,
        status: payment.status,
        transactionId: payment.transaction_id,
        paymentMethod: payment.payment_method
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};

// Get payment by booking ID
exports.getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({
      where: { booking_id: bookingId },
      include: [{ model: Booking }]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check ownership
    if (payment.Booking.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [{ model: Booking }]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check ownership
    if (payment.Booking.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

// Get all payments (admin only)
exports.getAllPayments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const payments = await Payment.findAll({
      include: [{ model: Booking }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};
