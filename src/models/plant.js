require('dotenv').config()
const Sequelize = require('sequelize')
const Database = require('../configs/database')

const model = {
  _id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  plant_name: {
    type: Sequelize.STRING
  },
  user_id: {
    type: Sequelize.STRING
  },
  lat: {
    type: Sequelize.DOUBLE
  },
  long: {
    type: Sequelize.DOUBLE
  },
  zone_local: {
    type: Sequelize.STRING
  },
  zone_city: {
    type: Sequelize.STRING
  },
  plant_start_date: {
    type: Sequelize.DATE
  },
  plant_harvest_date: {
    type: Sequelize.DATE
  },
  probability: {
    type: Sequelize.INTEGER
  },
  is_harvested: {
    type: Sequelize.TINYINT
  },
  satisfaction_rate: {
    type: Sequelize.INTEGER
  },
  image_url: {
    type: Sequelize.STRING
  },
  monthly_data: {
    type: Sequelize.STRING
  },
  created_at: {
    type: Sequelize.DATE
  }
}

const options = {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false
}

const plants = Database.db.define(process.env.DB_TABLE_PLANT, model, options)

module.exports = plants
