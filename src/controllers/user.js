const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connection = require('../configs/database');
const Users = require('../models/user');
const Plants = require('../models/plant');

// REGISTER/SIGNUP
exports.user_signup = (req, res, next) => {
  const queryCheckUser = 'SELECT * FROM tandur_coba.tandur_user WHERE email = ?'
  connection.query(queryCheckUser, req.body.email, (err, rows, field) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed',
        error: err
      });
    }
    if (rows.length > 0) {
      return res.status(409).json({
        message: 'Email already exists'
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const data = {
            _id: nanoid(16),
            name: req.body.name,
            email: req.body.email,
            password: hash,
            satisfaction_rate: 0
          };

          const queryRegister = 'INSERT INTO tandur_user SET ?';

          connection.query(queryRegister, data, (err, rows, field) => {
            if (err) {
              return res.status(500).json({
                message: 'Failed',
                error: err
              });
            }
            return res.status(201).json({
              message: 'User created',
              data: data
            });
          });
        }
      });
    }
  });
};

// LOGIN
exports.user_login = (req, res, next) => {
  const queryCheckUser = 'SELECT * FROM tandur_coba.tandur_user WHERE email = ?'
  connection.query(queryCheckUser, req.body.email, (err, rows, field) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed',
        error: err
      });
    }

    if (rows.length < 1) {
      return res.status(401).json({
        message: 'Email not Found'
      });
    } else {
      const userData = rows[0];
      bcrypt.compare(req.body.password, userData.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth Failed'
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: userData.email,
              userId: userData._id
            },
            process.env.JWT_KEY,
            {

            }
          );
          return res.status(200).json({
            message: 'Auth Success',
            userId: userData._id,
            token: token
          });
        }
        return res.status(401).json({
          message: 'Auth Failed: Password is Incorrect'
        });
      });
    }
  });
};

// GET ALL USERS
exports.user_get_all = (req, res, next) => {
  res.status(200).json({
    message: 'Users fetched',
    data: Users
  });
};

// GET USER BY ID (USER DETAIL)
exports.user_get_detail = (req, res, next) => {
  const user = Users.find(user => user._id == req.params.userId)
  if (user !== undefined) {
    return res.status(200).json({
      message: 'User Found',
      data: user
    });
  } else {
    return res.status(404).json({
      message: 'User not Found'
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