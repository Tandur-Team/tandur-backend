const Plants = require('../models/plant');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET NEARBY PLANTS
exports.plant_get_nearby = async (req, res, next) => {
  const plants = await Plants.findAll({
    where: {
      zone_local: {
        [Op.like]: `%${req.query.zone_local}%`
      },
      zone_city: req.query.zone_city
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