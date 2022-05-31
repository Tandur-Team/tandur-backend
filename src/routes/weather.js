const express = require('express')
const router = express.Router()

const WeatherController = require('../controllers/weather')
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, WeatherController.weather_get_daily)

module.exports = router
