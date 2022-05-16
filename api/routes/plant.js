const express = require('express');
const router = express.Router();
const Plants = require('../models/plant');
const checkAuth = require('../middleware/check-auth');

// GET ALL PLANTS
router.get('/', checkAuth, (req, res, next) => {
  return res.status(200).json({
    message: 'Plants fetched',
    data: Plants
  });
});

// GET PLANT DETAIL
router.get('/:plantId', checkAuth, (req, res, next) => {
  const plant = Plants.find(plant => plant._id == req.params.plantId);
  if (plant !== undefined) {
    return res.status(200).json({
      message: `Plant found`,
      data: plant
    });
  } else {
    return res.status(404).json({
      message: 'Plant not Found'
    });
  }
});

module.exports = router;