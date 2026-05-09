const { Hotel, Destination } = require('../models');

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      include: [{ model: Destination }],
      order: [['name', 'ASC']]
    });

    res.json({
      total: hotels.length,
      hotels
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByPk(id, {
      include: [{ model: Destination }]
    });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
};

// Get hotels by destination
exports.getHotelsByDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const hotels = await Hotel.findAll({
      where: { destination_id: destinationId },
      include: [{ model: Destination }],
      order: [['name', 'ASC']]
    });

    res.json({
      total: hotels.length,
      hotels
    });
  } catch (error) {
    console.error('Get hotels by destination error:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};
