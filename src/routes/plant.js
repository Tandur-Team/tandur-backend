const express = require('express')
const router = express.Router()

const PlantController = require('../controllers/plant')
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, PlantController.plant_get_nearby)
router.get('/search', checkAuth, PlantController.plant_query_name)
router.get('/:plantName', PlantController.plant_recommendation_detail)

module.exports = router
