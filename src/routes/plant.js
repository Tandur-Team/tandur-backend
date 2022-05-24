const express = require('express');
const router = express.Router();

const PlantController = require('../controllers/plant');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, PlantController.plant_get_nearby);
router.get('/:plantName', PlantController.fixed_plant_detail);

module.exports = router;