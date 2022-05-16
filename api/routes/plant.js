const express = require('express');
const router = express.Router();

const PlantController = require('../controllers/plant');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, PlantController.plant_get_all);

router.get('/:plantId', checkAuth, PlantController.plant_get_detail);

module.exports = router;