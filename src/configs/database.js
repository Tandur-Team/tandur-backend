const { Sequelize } = require('sequelize');
const mysql = require("mysql");

exports.db = new Sequelize('tandur_coba', 'root', '123456', {
  host: '34.101.40.138',
  port: '3306',
  dialect: 'mysql'
});

// CONNECTION CONFIGURATION
var connection = mysql.createConnection({
  host: '34.101.40.138',
  port: '3306',
  database: 'tandur_coba',
  user: 'root',
  password: '123456'
});

// DB CONNECTION
connection.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
});