const Sequelize = require('sequelize');
const Database = require('../configs/database');

const model = {
    _id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    plant_name: {
        type: Sequelize.STRING
      },
    userId: {
      type: Sequelize.STRING
    },
    zone: {
      type: Sequelize.STRING
    },
    plant_start_date: {
      type: Sequelize.DATE
    },
    plant_harvest_date: {
      type: Sequelize.DATE
    },
    is_harvested: {
      type: Sequelize.TINYINT
    },
    satisfaction_rate: {
      type: Sequelize.INTEGER
    },
  }
  
  const options = {
    freezeTableName: true,
    updatedAt: false,
  }

const plants = Database.db.define('tandur_plant', model, options);

module.exports = plants;