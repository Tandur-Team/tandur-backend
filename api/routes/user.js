const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Users = require('../models/user');
const bcrypt = require('bcrypt');

// REGISTER/SIGNUP
router.post('/signup', (req, res, next) => {
  if (Users.find(user => user.email == req.body.email) !== undefined) {
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

// GET ALL USER
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Users fetched',
    data: Users
  });
});

module.exports = router;