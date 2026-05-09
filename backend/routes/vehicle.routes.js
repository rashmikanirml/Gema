const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');

// Public routes
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.get('/type/:type', vehicleController.getVehiclesByType);

module.exports = router;
