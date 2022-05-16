const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/user');

// REGISTER/SIGNUP
exports.user_signup = (req, res, next) => {
  const user = Users.find(user => user.email == req.body.email)
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
};

// LOGIN
exports.user_login = (req, res, next) => {
  const user = Users.find(user => user.email == req.body.email)
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