const axios = require('axios')

exports.weather_get_daily = async (req, res, next) => {
  try {
    let rain, temperature, humidity
    const date = new Date()
    const formattedDate = date.getFullYear() + '-' + (('0' + (date.getMonth() + 1)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2))

    await axios.get(`https://api.meteomatics.com/${formattedDate}T00:00:00Z/relative_humidity_max_2m_24h:p,precip_24h:mm,t_2m:C/${req.query.lat},${req.query.long}/json`, {
      auth: {
        username: process.env.METEO_USER,
        password: process.env.METEO_PASSWORD
      }
    }).then(res => {
      humidity = res.data.data[0].coordinates[0].dates[0].value
      rain = res.data.data[1].coordinates[0].dates[0].value
      temperature = res.data.data[2].coordinates[0].dates[0].value
    }).catch(error => {
      console.error(error)
    })

    const response = {
      rain,
      temperature,
      humidity
    }

    return res.status(200).json({
      message: 'Weather fetched',
      status: 200,
      data: response
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Failed',
      status: 500,
      error: err.message
    })
  }
}
