const mysql = require("mysql");

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

module.exports = connection;