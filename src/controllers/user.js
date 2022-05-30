const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Users = require('../models/user');
const Plants = require('../models/plant');
const FixedPlants = require('../models/fixed-plant');

// REGISTER/SIGNUP
exports.user_signup = async (req, res, next) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email
      }
    });

    if (user.length > 0) {
      return res.status(409).json({
        message: 'Email already exists',
        status: 409
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed',
            status: 500,
            error: err
          });
        } else {
          const userId = nanoid(32);
          const plantUrl = `localhost:8080/${userId}/plant`;
          const data = {
            _id: userId,
            full_name: req.body.full_name,
            email: req.body.email,
            password: hash,
            avg_satisfaction_rate: 0.0,
            my_plant_url: plantUrl,
            created_at: new Date()
          }
          const user = await Users.create(data);
          return res.status(201).json({
            message: 'User created',
            status: 201,
            data: {
              _id: user._id,
              full_name: user.full_name,
              email: user.email
            }
          });
        }
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
};

// LOGIN
exports.user_login = async (req, res, next) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email
      }
    });

    if (user.length < 1) {
      return res.status(401).json({
        message: 'Email not Found',
        status: 401
      });
    } else {
      const userData = user[0];
      bcrypt.compare(req.body.password, userData.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth Failed',
            status: 401
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: userData.email,
              userId: userData._id
            },
            process.env.JWT_KEY
          );
          return res.status(200).json({
            message: 'Auth Success',
            status: 200,
            user_id: userData._id,
            token: token
          });
        }
        return res.status(401).json({
          message: 'Auth Failed: Password is Incorrect',
          status: 401
        });
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
};

// GET ALL USERS
exports.user_get_all = async (req, res, next) => {
  try {
    const user = await Users.findAll();

    if (user) {
      return res.status(200).json({
        message: 'Users fetched',
        status: 200,
        data: user
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
};

// GET USER BY ID (USER DETAIL)
exports.user_get_detail = async (req, res, next) => {
  try {
    const user = await Users.findAll({
      where: {
        _id: req.params.userId
      }
    });

    if (user.length > 0) {
      const plantUrl = `localhost:8080/${user[0]._id}/plant`;

      return res.status(200).json({
        message: 'User Found',
        status: 200,
        data: {
          _id: user[0]._id,
          full_name: user[0].full_name,
          email: user[0].email,
          avg_satisfaction_rate: user[0].avg_satisfaction_rate,
          my_plant_url: plantUrl
        }
      });
    } else {
      return res.status(404).json({
        message: 'User not Found',
        status: 404
      });
    }

  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
};

// ADD MY PLANT
exports.user_add_myplant = async (req, res, next) => {
  try {
    const duration = 3;

    const date = new Date();
    const start_date = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1)).slice(-2)) + '-' + (("0" + date.getDate()).slice(-2));
    const harvest_date = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1 + duration)).slice(-2)) + '-' + (("0" + date.getDate()).slice(-2));

    const fixed_plant = await FixedPlants.findAll({
      where: {
        plant_name: req.body.plant_name
      }
    });

    // convert JSON to String
    const stringMonthlyData = JSON.stringify(req.body.monthly_data)

    const data = {
      _id: nanoid(32),
      plant_name: req.body.plant_name,
      user_id: req.params.userId,
      lat: req.body.lat,
      long: req.body.long,
      zone_local: req.body.zone_local,
      zone_city: req.body.zone_city,
      plant_start_date: start_date,
      plant_harvest_date: harvest_date,
      probability: 0,
      is_harvested: 0,
      satisfaction_rate: 0,
      image_url: fixed_plant[0].image_url,
      monthly_data: stringMonthlyData,
      created_at: new Date()
    }

    const plant = await Plants.create(data);

    return res.status(201).json({
      message: 'Plant added',
      status: 201,
      data: plant
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
};

// GET ALL MY PLANTS
exports.user_get_all_myplant = async (req, res, next) => {
  try {
    const plant = await Plants.findAll({
      where: {
        user_id: req.params.userId
      }
    });

    if (plant) {
      return res.status(200).json({
        message: 'Plants fetched',
        status: 200,
        data: plant
      });
    }

  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
};

// GET MY PLANT DETAIL
exports.user_get_myplant_detail = async (req, res, next) => {
  try {
    const plant = await Plants.findOne({
      where: {
        _id: req.params.plantId
      }
    });

    const fixedPlant = await FixedPlants.findOne({
      where: {
        plant_name: plant.plant_name
      }
    });

    const fixedData = {
      min_temp: fixedPlant.min_temp,
      max_temp: fixedPlant.max_temp,
      min_humidity: fixedPlant.min_humidity,
      max_humidity: fixedPlant.max_humidity,
      min_rain: fixedPlant.min_rain,
      max_rain: fixedPlant.max_rain,
    }

    // convert String to JSON
    const parsedMonthlyData = JSON.parse(plant.monthly_data);

    const responseData = {
      _id: plant._id,
      plant_name: plant.plant_name,
      user_id: plant.user_id,
      lat: plant.lat,
      long: plant.long,
      zone_local: plant.zone_local,
      zone_city: plant.zone_city,
      plant_start_date: plant.plant_start_date,
      plant_harvest_date: plant.plant_harvest_date,
      probability: plant.probability,
      is_harvested: plant.is_harvested,
      satisfaction_rate: plant.satisfaction_rate,
      image_url: plant.image_url,
      fixedData: fixedData,
      monthly_data: parsedMonthlyData,
      created_at: plant.created_at
    }

    if (plant) {
      return res.status(200).json({
        message: 'Plant detail fetched',
        status: 200,
        data: responseData
      });
    } else {
      return res.status(404).json({
        message: 'Plant not found',
        status: 404,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
}

// HARVEST MY PLANT
exports.user_harvest_myplant = async (req, res, next) => {
  try {
    const data = {
      is_harvested: 1,
      satisfaction_rate: req.body.satisfaction_rate
    }

    await Plants.update(data, {
      where: {
        _id: req.params.plantId
      }
    });

    const plant = await Plants.findAll({
      where: {
        _id: req.params.plantId
      }
    });

    return res.status(200).json({
      message: 'Plants Updated',
      status: 200,
      data: plant[0]
    });

  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    });
  }
};