const { nanoid } = require('nanoid');

const Plants = require('../models/plant');

// GET NEARBY PLANTS
exports.plant_get_nearby = async (req, res, next) => {
  const plants = await Plants.findAll({
    where: {
      zone: req.params.zone
    }
  });

  if (plants.length > 0) {
    return res.status(200).json({
      message: 'Nearby plants fetched',
      status: 200,
      data: plants
    });
  } else {
    return res.status(404).json({
      message: 'Nearby plant not found',
      status: 404
    });
  }
};