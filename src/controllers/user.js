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
            token: token,
            full_name: userData.full_name
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

    const data = {
      _id: nanoid(32),
      plant_name: req.body.plant_name,
      user_id: req.params.userId,
      zone_local: req.body.zone_local,
      zone_city: req.body.zone_city,
      plant_start_date: start_date,
      plant_harvest_date: harvest_date,
      is_harvested: 0,
      satisfaction_rate: 0,
      image_url: fixed_plant[0].image_url,
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