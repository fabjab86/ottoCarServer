const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const { Client, Pool } = require('pg')
const Joi = require('@hapi/joi')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const PORT = 3030
const connectionString = process.env.CONNECTIONSTRING

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
})

app.get('/', (req, res) => {
  res.status(200).send('Please go to /cars or /stats to make requests')
})

app.get('/cars', (req, res) => {
  client.query('SELECT * FROM cars_stock', (err, result) => {
    if (err) {
      console.log(err)
      if (!err.statusCode) err.statusCode = 500
      res.status(err.statusCode).send({
        status: err.statusCode,
        error: err.message
      })
    } else {
      res.status(200).send({
        status: 'success',
        data: result.rows
      })
    }
  })
})

app.get('/cars/:car_id', (req, res) => {
  const carId = req.param.car_id
  console.log(carId)
  const schema = Joi.object().keys({
    carId: Joi.string().guid().required()
  })

  Joi.validate(carId, schema, (err, carId) => {
    if (err) {
      res.status(422).json({
        status: 'error',
        message: 'Invalid car id'
      })
    } else {
      const queryText = 'SELECT * FROM cars_stock WHERE car_id=' + carId + ';'
      client.query(queryText, (err, result) => {
        if (err) {
          console.log(err)
          if (!err.statusCode) err.statusCode = 500
          res.status(err.statusCode).send({
            status: err.statusCode,
            error: err.message
          })
        } else {
          res.status(200).send({
            status: 'success',
            data: result.rows
          })
        }
      })
    }
  })
})

app.post('/cars', (req, res) => {
  const data = req.body
  const inputData = { make: req.body.make, model: req.body.model, model_year: req.body.model_year }
  const schema = Joi.object().keys({
    make: Joi.string().required(),
    model: Joi.string().required(),
    model_year: Joi.number().min(4).required()
  })

  Joi.validate(data, schema, (err) => {
    if (err) {
      res.status(422).json({
        status: 'error',
        message: 'Invalid input, please check your input and try again'
      })
    } else {
      pool.query('INSERT INTO cars_stock(make, model, model_year)values($1, $2, $3)',
        [inputData.make, inputData.model, inputData.model_year], (err, result) => {
          if (err) {
            console.log(err)
            if (!err.statusCode) err.statusCode = 500
            res.status(err.statusCode).send({
              status: 'failed',
              error: err.message
            })
          } else {
            res.json({
              status: 'success',
              message: 'Car added'
            })
          }
        })
    }
  })
})

const client = new Client({
  connectionString: connectionString
})

client.connect((err) => {
  if (err) throw err
  console.log('Connected!')
})

app.listen(PORT, function () {
  console.log('Server is running on PORT:', PORT)
})
