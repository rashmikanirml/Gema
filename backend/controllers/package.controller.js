const { Package, Destination, Hotel, Vehicle, Route } = require('../models');
const { Op } = require('sequelize');

// Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: [
        { model: Destination, as: 'destination' },
        { model: Hotel, as: 'hotel' },
        { model: Vehicle, as: 'vehicle' },
        { model: Route, as: 'route' }
      ],
      order: [['name', 'ASC']]
    });

    res.json({
      total: packages.length,
      packages
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
};

// Get package by ID
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id, {
      include: [
        { model: Destination, as: 'destination' },
        { model: Hotel, as: 'hotel' },
        { model: Vehicle, as: 'vehicle' },
        { model: Route, as: 'route' }
      ]
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(pkg);
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
};

// Search packages with filters (budget, duration, destination)
exports.searchPackages = async (req, res) => {
  try {
    const { budget, duration, destinationId, durationFrom, durationTo } = req.body;

    // Build where conditions
    const whereCondition = {};

    // Budget filter
    if (budget) {
      whereCondition.total_price = { [Op.lte]: budget };
    }

    // Duration filter
    if (duration) {
      whereCondition.duration_days = { [Op.eq]: duration };
    } else if (durationFrom && durationTo) {
      whereCondition.duration_days = {
        [Op.between]: [parseInt(durationFrom), parseInt(durationTo)]
      };
    }

    // Destination filter
    if (destinationId) {
      whereCondition.destination_id = destinationId;
    }

    const packages = await Package.findAll({
      where: whereCondition,
      include: [
        { model: Destination, as: 'destination' },
        { model: Hotel, as: 'hotel' },
        { model: Vehicle, as: 'vehicle' },
        { model: Route, as: 'route' }
      ],
      order: [['total_price', 'ASC']]
    });

    res.json({
      total: packages.length,
      filters: {
        budget,
        duration,
        destinationId,
        durationFrom,
        durationTo
      },
      packages
    });
  } catch (error) {
    console.error('Search packages error:', error);
    res.status(500).json({ error: 'Failed to search packages' });
  }
};
