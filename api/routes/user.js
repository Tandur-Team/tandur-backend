const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.get('/', checkAuth, UserController.user_get_all);

router.get('/:userId', checkAuth, UserController.user_get_detail);

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