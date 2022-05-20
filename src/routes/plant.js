const express = require('express');
const router = express.Router();

const PlantController = require('../controllers/plant');
const checkAuth = require('../middleware/check-auth');

router.get('/:zone', checkAuth, PlantController.plant_get_nearby);

module.exports = router;