const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cars = require('./routes/cars.js')
const stats = require('./routes/stats.js')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).send('Please go to /cars or /stats to make requests')
})

app.all('/cars', cars)
app.all('/stats', stats)

module.exports = app
