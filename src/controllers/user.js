const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connection = require('../configs/database');
const Users = require('../models/user');
const Plants = require('../models/plant');

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
            my_plant_url: plantUrl
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
            'tandur-secret'
          );
          return res.status(200).json({
            message: 'Auth Success',
            status: 200,
            userId: userData._id,
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
      return res.status(200).json({
        message: 'User Found',
        status: 200,
        data: {
          _id: user[0]._id,
          name: user[0].name,
          email: user[0].email,
          satisfaction_rate: user[0].satisfaction_rate
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
      status: 404,
      error: err.message
    });
  }
};

// ADD MY PLANT
exports.user_add_myplant = (req, res, next) => {
  const user = Users.find(user => user._id == req.params.userId);
  if (user !== undefined) {
    const newPlant = {
      _id: nanoid(16),
      name: req.body.name,
      owner_id: req.params.userId,
      plant_date: req.body.plant_date,
      harvest_date: req.body.harvest_date,
      location: req.body.location,
      rain: req.body.rain,
      temperature: req.body.temperature,
      soil_ph: req.body.soil_ph,
      is_done: false
    };

    user.my_plant.push(newPlant);
    Plants.push(newPlant);

    return res.status(201).json({
      message: 'Plant added',
      data: newPlant
    });
  } else {
    return res.status(404).json({
      message: 'User not Found'
    });
  }
};

// GET ALL MY PLANTS
exports.user_get_all_myplant = (req, res, next) => {
  const user = Users.find(user => user._id == req.params.userId);
  if (user !== undefined) {
    res.status(200).json({
      message: 'My Plants fetched',
      data: user.my_plant
    });
  } else {
    return res.status(404).json({
      message: 'User not Found'
    });
  }
};

// HARVEST MY PLANT
exports.user_harvest_myplant = (req, res, next) => {
  const user = Users.find(user => user._id == req.params.userId);
  if (user !== undefined) {
    const plant = Plants.find(plant => plant._id == req.params.plantId);
    if (plant !== undefined) {
      plant.is_done = true;
      res.status(201).json({
        message: 'My Plant updated (harvest)',
        data: plant
      });
    } else {
      return res.status(404).json({
        message: 'My Plant not Found'
      });
    }
  } else {
    return res.status(404).json({
      message: 'User not Found'
    });
  }
};