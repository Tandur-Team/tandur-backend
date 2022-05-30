const express = require('express')
const router = express.Router()

const FixedPlantController = require('../controllers/fixed-plant')

router.get('/', FixedPlantController.fixed_plant_get_all)

module.exports = router
