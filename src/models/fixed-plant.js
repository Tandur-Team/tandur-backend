const Sequelize = require('sequelize');
const Database = require('../configs/database');

const model = {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  plant_name: {
    type: Sequelize.STRING
  },
  image_url: {
    type: Sequelize.STRING
  },
  min_temp: {
    type: Sequelize.DOUBLE
  },
  max_temp: {
    type: Sequelize.DOUBLE
  },
  min_humidity: {
    type: Sequelize.DOUBLE
  },
  max_humidity: {
    type: Sequelize.DOUBLE
  },
  min_rain: {
    type: Sequelize.DOUBLE
  },
  max_rain: {
    type: Sequelize.DOUBLE
  },
  harvest_duration: {
    type: Sequelize.INTEGER
  },
}

const options = {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
}


const fixedPlants = Database.db.define('tandur_plant_type', model, options);

module.exports = fixedPlants;