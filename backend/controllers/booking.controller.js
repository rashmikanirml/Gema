const { Booking, Package, User, Payment } = require('../models');
const { Op } = require('sequelize');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { packageId, checkInDate, checkOutDate, numberOfGuests } = req.body;
    const customerId = req.user.id;

    // Validate input
    if (!packageId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch package
    const pkg = await Package.findByPk(packageId);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Check available slots
    if (pkg.available_slots < numberOfGuests) {
      return res.status(400).json({ error: 'Not enough available slots' });
    }

    // Calculate total amount
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = pkg.price_per_day * days;

    // Create booking
    const booking = await Booking.create({
      customer_id: customerId,
      package_id: packageId,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_guests: numberOfGuests,
      total_amount: totalAmount,
      status: 'pending'
    });

    // Update available slots
    await pkg.update({
      available_slots: pkg.available_slots - numberOfGuests
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        packageId: booking.package_id,
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        numberOfGuests: booking.number_of_guests,
        totalAmount: booking.total_amount,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get my bookings
exports.getMyBookings = async (req, res) => {
  try {
    const customerId = req.user.id;

    const bookings = await Booking.findAll({
      where: { customer_id: customerId },
      include: [
        {
          model: Package,
          include: [
            { model: require('../models').Destination },
            { model: require('../models').Hotel },
            { model: require('../models').Vehicle }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Package,
          include: [
            { model: require('../models').Destination },
            { model: require('../models').Hotel },
            { model: require('../models').Vehicle },
            { model: require('../models').Route }
          ]
        },
        { model: User, as: 'customer', attributes: { exclude: ['password'] } }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check ownership
    if (booking.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [{ model: Package }]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check ownership
    if (booking.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Only allow cancellation if not completed
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel this booking' });
    }

    // Update booking status
    await booking.update({ status: 'cancelled' });

    // Restore available slots
    const pkg = booking.Package;
    if (pkg) {
      await pkg.update({
        available_slots: pkg.available_slots + booking.number_of_guests
      });
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const bookings = await Booking.findAll({
      include: [
        {
          model: Package,
          include: [
            { model: require('../models').Destination },
            { model: require('../models').Hotel }
          ]
        },
        { model: User, as: 'customer' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};
