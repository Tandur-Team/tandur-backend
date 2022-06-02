const FixedPlants = require('../models/fixed-plant')
const Plants = require('../models/plant')
const Sequelize = require('sequelize')
const axios = require('axios')
const tf = require('@tensorflow/tfjs-node')
const sk = require('scikitjs')
sk.setBackend(tf)
const Op = Sequelize.Op

// QUERY NEARBY PLANT NAME
exports.plant_query_name = async (req, res, next) => {
  try {
    // Grouping Function
    function groupBy (key) {
      return function group (array) {
        return array.reduce((acc, obj) => {
          const property = obj[key]
          acc[property] = acc[property] || []
          acc[property].push(obj)
          return acc
        }, {})
      }
    }

    // Query Nearby
    const plants = await Plants.findAll({
      where: {
        plant_name: {
          [Op.like]: `%${req.query.search}%`
        },
        zone_local: {
          [Op.like]: `%${req.query.zone_local}%`
        },
        zone_city: req.query.zone_city
      }
    })

    // Grouping by plant_name
    const groupByName = groupBy('plant_name')
    const plantNameArr = Object.keys(groupByName(plants))
    const responseArr = []

    // Looping Plant Name
    for (let i = 0; i < plantNameArr.length; i++) {
      // Query Fixed Plant by plant_name
      const fixedPlants = await FixedPlants.findOne({
        where: {
          plant_name: plantNameArr[i]
        }
      })

      const plantDataArr = groupByName(plants)[plantNameArr[i]]
      let nearby = 0
      let totalSatisfactionRate = 0
      let harvestedPlantCount = 0
      let avgSatisfactionRate = 0

      // Looping Plant Data
      for (let j = 0; j < plantDataArr.length; j++) {
        if (plantDataArr[j].plant_name === plantNameArr[i]) {
          nearby++
          if (plants[j].is_harvested === 1) {
            totalSatisfactionRate += plants[j].satisfaction_rate
            harvestedPlantCount++
          }
          avgSatisfactionRate = totalSatisfactionRate / harvestedPlantCount
        }
      }

      const data = {
        plant_name: plantNameArr[i],
        image_url: fixedPlants.image_url,
        nearby,
        avg_satisfaction_rate: avgSatisfactionRate,
        harvest_duration: fixedPlants.harvest_duration
      }

      responseArr.push(data)
    }

    if (plants.length > 0) {
      return res.status(200).json({
        message: 'Query fetched',
        status: 200,
        data: responseArr
      })
    } else {
      return res.status(404).json({
        message: 'Query not found',
        status: 404
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    })
  }
}

// GET NEARBY PLANTS
exports.plant_get_nearby = async (req, res, next) => {
  try {
    const fixedPlants = await FixedPlants.findAll()
    const responseArr = []

    for (let i = 0; i < fixedPlants.length; i++) {
      const plants = await Plants.findAll({
        where: {
          plant_name: fixedPlants[i].plant_name,
          zone_local: {
            [Op.like]: `%${req.query.zone_local}%`
          },
          zone_city: req.query.zone_city
        }
      })

      let totalSatisfactionRate = 0
      let harvestedPlantCount = 0

      for (let j = 0; j < plants.length; j++) {
        if (plants[j].is_harvested === 1) {
          totalSatisfactionRate += plants[j].satisfaction_rate
          harvestedPlantCount++
        }
      }

      const avgSatisfactionRate = totalSatisfactionRate / harvestedPlantCount

      const data = {
        plant_name: fixedPlants[i].plant_name,
        image_url: fixedPlants[i].image_url,
        nearby: plants.length,
        avg_satisfaction_rate: avgSatisfactionRate,
        harvest_duration: fixedPlants[i].harvest_duration
      }

      responseArr.push(data)
    }

    responseArr.sort((a, b) => b.nearby - a.nearby)

    if (responseArr.length > 0) {
      return res.status(200).json({
        message: 'Nearby plants fetched',
        status: 200,
        data: responseArr
      })
    } else {
      return res.status(404).json({
        message: 'Nearby plant not found',
        status: 404
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    })
  }
}

// GET PLANT RECOMMENDATION DETAIL
exports.plant_recommendation_detail = async (req, res, next) => {
  try {
    // QUERY FIXED PLANTS
    const fixedPlant = await FixedPlants.findOne({
      where: {
        plant_name: req.params.plantName
      }
    })

    // QUERY NEARBY PLANTS
    const userPlant = await Plants.findAll({
      where: {
        zone_local: {
          [Op.like]: `%${req.query.zone_local}%`
        },
        zone_city: req.query.zone_city
      }
    })

    // VARIABLE HARVEST DURATION
    const duration = fixedPlant.harvest_duration

    // VARIABLE NEARBY USER PLANT
    const nearby = userPlant.length

    // VARIABLE START AND FINISH DATE
    const date = new Date()
    const startDate = date.getFullYear() + '-' + (('0' + (date.getMonth() + 1)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2))
    const harvestDate = date.getFullYear() + '-' + (('0' + (date.getMonth() + 1 + duration)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2))

    // VARIABLE THIRD PARTY API RESPOND
    let humidityResponds
    let humidityTotal = 0.0
    let rainResponds
    let rainTotal = 0.0
    let tempResponds
    let tempTotal = 0.0

    // ARRAY FOR SAVING MONTHLY DATA
    const avgHumidityArr = []
    const avgRainArr = []
    const avgTempArr = []
    const avgMonthArr = []

    // VARIABLE FOR INDEX
    let index = 0
    let day = 1

    // GET HUMIDITY DATA
    await axios.get(`https://api.meteomatics.com/${startDate}T00:00:00Z--${harvestDate}T00:00:00Z:PT24H/relative_humidity_max_2m_24h:p,precip_24h:mm,t_mean_2m_24h:C/${req.query.lat},${req.query.long}/json`, {
      auth: {
        username: process.env.METEO_USER,
        password: process.env.METEO_PASSWORD
      }
    }).then(res => {
      humidityResponds = res.data.data[0].coordinates[0].dates
      rainResponds = res.data.data[1].coordinates[0].dates
      tempResponds = res.data.data[2].coordinates[0].dates
    }).catch(error => {
      console.error(error)
    })

    // GET HUMIDITY, RAIN, TEMPERATURE AVG DATA
    for (let i = 0; i < humidityResponds.length; i++) {
      humidityTotal = humidityTotal + humidityResponds[i].value
      rainTotal = rainTotal + rainResponds[i].value
      tempTotal = tempTotal + tempResponds[i].value
      const dateState = humidityResponds[i].date.split('T')

      if (dateState[0].slice(-2) === ('0' + date.getDate()).slice(-2)) {
        avgHumidityArr[index - 1] = humidityTotal / day
        avgRainArr[index - 1] = rainTotal / day
        avgTempArr[index - 1] = tempTotal / day
        humidityTotal = 0
        rainTotal = 0
        tempTotal = 0
        day = 0
        index++
      }
      day++
    }

    index = 0

    // GET TEMPERATURE AVG DATA
    for (let i = 0; i < tempResponds.length; i++) {
      tempTotal = tempTotal + tempResponds[i].value
      const dateState = tempResponds[i].date.split('T')

      if (dateState[0].slice(-2) === ('0' + date.getDate()).slice(-2)) {
        avgTempArr[index - 1] = tempTotal / day
        tempTotal = 0
        day = 0
        index++
      }
      day++
    }

    // GET ARRAY AS RESPOND
    for (let i = 0; i < avgHumidityArr.length; i++) {
      const dataMonth = {
        average_humidity: avgHumidityArr[i],
        average_rain: avgRainArr[i],
        average_temp: avgTempArr[i]
      }
      avgMonthArr.push(dataMonth)
    }

    // FIXED DATA
    const fixedData = {
      min_temp: fixedPlant.min_temp,
      max_temp: fixedPlant.max_temp,
      min_humidity: fixedPlant.min_humidity,
      max_humidity: fixedPlant.max_humidity,
      min_rain: fixedPlant.min_rain,
      max_rain: fixedPlant.max_rain
    }

    return res.status(200).json({
      message: 'Recommended Plant Detail',
      status: 200,
      data: {
        plant_name: req.params.plantName,
        image_url: fixedPlant.image_url,
        probability: 90,
        location: `${req.query.zone_local}, ${req.query.zone_city}`,
        nearby,
        duration,
        fixed_data: fixedData,
        monthly_data: avgMonthArr
      }
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    })
  }
}
