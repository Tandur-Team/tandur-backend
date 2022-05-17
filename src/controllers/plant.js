const { nanoid } = require('nanoid');

const Plants = require('../models/plant');

// GET ALL PLANTS
exports.plant_get_all = (req, res, next) => {
  return res.status(200).json({
    message: 'Plants fetched',
    data: Plants
  });
};

// GET PLANT DETAIL
exports.plant_get_detail = (req, res, next) => {
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
};