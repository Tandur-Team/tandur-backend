const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Users = require('../models/user');
const Plants = require('../models/plant');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

// REGISTER/SIGNUP
router.post('/signup', (req, res, next) => {
  const user = Users.find(user => user.email == req.body.email);
  if (user !== undefined) {
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
        const newUser = {
          _id: nanoid(16),
          name: req.body.name,
          email: req.body.email,
          password: hash,
          my_plant: [],
          satisfaction_rate: 0
        };

        Users.push(newUser);

        return res.status(201).json({
          message: 'User created',
          data: newUser
        });
      }
    });
  }
});

// LOGIN
router.post('/login', (req, res, next) => {
  const user = Users.find(user => user.email == req.body.email);
  if (user !== undefined) {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: 'Auth Failed'
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id
          },
          process.env.JWT_KEY,
          {

          }
        );
        return res.status(200).json({
          message: 'Auth Success',
          token: token
        });
      }
      return res.status(401).json({
        message: 'Auth Failed: Password is Incorrect!'
      });
    });
  } else {
    return res.status(401).json({
      message: 'Auth Failed: Email is Incorrect'
    });
  }
});

// GET ALL USER
router.get('/', checkAuth, (req, res, next) => {
  res.status(200).json({
    message: 'Users fetched',
    data: Users
  });
});

// GET USER BY ID (USER DETAIL)
router.get('/:userId', checkAuth, (req, res, next) => {
  const user = Users.find(user => user._id == req.params.userId);
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
});

// ADD MY PLANT
router.post('/:userId/plant', checkAuth, (req, res, next) => {
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
});

// GET ALL MY PLANT
router.get('/:userId/plant', checkAuth, (req, res, next) => {
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
});

// HARVEST MY PLANT
router.patch('/:userId/plant/:plantId', checkAuth, (req, res, next) => {
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
});

module.exports = router;