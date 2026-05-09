const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// Public routes
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.get('/destination/:destinationId', hotelController.getHotelsByDestination);

module.exports = router;
