const { Sequelize } = require('sequelize')
require('dotenv').config()

exports.db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql'
})
