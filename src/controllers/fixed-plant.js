const FixedPlants = require('../models/fixed-plant')

// GET ALL FIXED PLANTS
exports.fixed_plant_get_all = async (req, res, next) => {
  try {
    const fixedPlant = await FixedPlants.findAll()

    if (fixedPlant) {
      const datas = []

      for (let i = 0; i < fixedPlant.length; i++) {
        const data = {
          plant_name: fixedPlant[i].plant_name,
          image_url: fixedPlant[i].image_url
        }
        datas.push(data)
      }

      return res.status(200).json({
        message: 'Fixed plants fetched',
        status: 200,
        data: datas
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    })
  }
}
