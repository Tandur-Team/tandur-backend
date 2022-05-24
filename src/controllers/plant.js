const FixedPlants = require('../models/fixed-plant');
const Plants = require('../models/plant');
const Sequelize = require('sequelize');
const axios = require('axios');
const Op = Sequelize.Op;

// GET NEARBY PLANTS
exports.plant_get_nearby = async (req, res, next) => {
  const plants = await Plants.findAll({
    where: {
      zone_local: {
        [Op.like]: `%${req.query.zone_local}%`
      },
      zone_city: req.query.zone_city
    }
  });

  if (plants.length > 0) {
    return res.status(200).json({
      message: 'Nearby plants fetched',
      status: 200,
      data: plants
    });
  } else {
    return res.status(404).json({
      message: 'Nearby plant not found',
      status: 404
    });
  }
};

exports.fixed_plant_detail = async (req, res, next) => {
  try {
    // QUERY FIXED PLANTS
    const fixed_plant = await FixedPlants.findOne({
      where: {
        plant_name: req.params.plantName
      }
    });

    // VARIABLE HARVEST DURATION
    const duration = fixed_plant.harvest_duration;

    // QUERY NEARBY PLANTS
    const user_plant = await Plants.findAll({
      where: {
        zone_local: {
          [Op.like]: `%${req.query.zone_local}%`
        },
        zone_city: req.query.zone_city
      }
    });

    // VARIABLE NEARBY USER PLANT
    const nearby = user_plant.length;

    var d = new Date();

    let weatherResponds;
    var weatherRespondsArr = [];

    // ARRAY FOR SAVING MONTHLY DATA
    var avgTempArr = [];
    var avgHumidityArr = [];
    var avgRainArr = [];

    // MONTHLY LOOP
    for (let i = 0; i < duration; i++) {
      var currentDate = d.getFullYear() + '-' + (("0" + (d.getMonth() + 1)).slice(-2)) + '-' + (("0" + d.getDate()).slice(-2));

      d.setMonth(d.getMonth() + 1);

      var nextDate = d.getFullYear() + '-' + (("0" + (d.getMonth() + 1)).slice(-2)) + '-' + (("0" + d.getDate()).slice(-2));

      // GET HUMIDITY DATA
      await axios
        .get(`https://api.meteomatics.com/${currentDate}T00:00:00Z--${nextDate}T00:00:00Z:PT24H/relative_humidity_max_2m_24h:p/${req.query.lat},${req.query.long}/json`, {
          auth: {
            username: 'tandur_shafiqrozaan',
            password: 'RRnDv2tC81'
          }
        })
        .then(res => {
          weatherResponds = res.data.data[0].coordinates[0].dates;
          weatherRespondsArr.push(weatherResponds);
        })
        .catch(error => {
          console.error(error);
        });

      var avg = 0;
      var total = 0;

      for (let j = 0; j < weatherRespondsArr[i].length; j++) {
        total = total + weatherRespondsArr[i][j].value;
      }

      avg = total / weatherRespondsArr[i].length;

      // PUSH AVERAGE MONTHLY DATA INTO ARRAY
      avgTempArr.push(0);
      avgHumidityArr.push(avg);
      avgRainArr.push(0);
    }

    return res.status(200).json({
      message: 'Recommended Plant Detail',
      status: 200,
      data: {
        location: `${req.query.zone_local}, ${req.query.zone_city}`,
        nearby: nearby,
        harvest_duration: duration,
        image_url: fixed_plant.image_url,
        monthly_data: {
          avg_temp: avgTempArr,
          avg_humidity: avgHumidityArr,
          avg_rain: avgRainArr,
        },
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
};