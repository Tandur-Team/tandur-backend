const Sequelize = require('sequelize');
const Database = require('../configs/database');

const model = {
  _id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  satisfaction_rate: {
    type: Sequelize.INTEGER
  },
}

const options = {
  freezeTableName: true,
  updatedAt: false,
}

const User = Database.db.define('tandur_user', model, options);

module.exports = User;