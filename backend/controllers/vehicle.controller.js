const { Vehicle } = require('../models');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { is_available: true },
      order: [['name', 'ASC']]
    });

    res.json({
      total: vehicles.length,
      vehicles
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
};

// Get vehicles by type
exports.getVehiclesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const vehicles = await Vehicle.findAll({
      where: { type, is_available: true },
      order: [['name', 'ASC']]
    });

    res.json({
      total: vehicles.length,
      vehicles
    });
  } catch (error) {
    console.error('Get vehicles by type error:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};
