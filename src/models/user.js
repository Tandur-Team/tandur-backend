const Sequelize = require('sequelize');
const Database = require('../configs/database');

const model = {
  _id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  full_name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  avg_satisfaction_rate: {
    type: Sequelize.DOUBLE
  },
  my_plant_url: {
    type: Sequelize.STRING
  }
}

const options = {
  freezeTableName: true,
  updatedAt: false,
}

const User = Database.db.define('tandur_user', model, options);

module.exports = User;