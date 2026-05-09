const { Destination } = require('../models');

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      total: destinations.length,
      destinations
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
};

// Get destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByPk(id);

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
};
