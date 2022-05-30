const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const Database = require('./src/configs/database')
const userRoutes = require('./src/routes/user')
const plantRoutes = require('./src/routes/plant')
const fixedPlantRoutes = require('./src/routes/fixed-plant')

try {
  Database.db.authenticate()
  console.log('Database connected')
} catch (err) {
  console.error('Connection error:', err)
}

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Handling CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// Routing
app.use('/user', userRoutes)
app.use('/plant', plantRoutes)
app.use('/fixedplant', fixedPlantRoutes)

// Custom error
app.use((req, res, next) => {
  const error = new Error('Endpoint Not found')
  error.status = 404
  next(error)
})

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
