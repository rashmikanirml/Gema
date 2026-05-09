const express = require('express');
const router = express.Router();
const packageController = require('../controllers/package.controller');

// Public routes
router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/search', packageController.searchPackages);

module.exports = router;
