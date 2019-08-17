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
  const carId = req.query.carId
  const noQueryFound = Object.keys(req.query).length === 0
  const carIdIsCorrect = carId && carId !== undefined
  if (carIdIsCorrect) {
    const queryText = 'SELECT * FROM cars_stock WHERE car_id=' + carId
    pool.query(queryText, (err, result) => {
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
  } else if (noQueryFound) {
    pool.query('SELECT * FROM cars_stock WHERE deleted=FALSE', (err, result) => {
      if (err) {
        console.log(err)
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).send({
          status: 'failed',
          error: err.message
        })
      } else {
        res.status(200).send({
          status: 'success',
          data: result.rows
        })
      }
    })
  } else if (carId === undefined) {
    res.status(422).json({
      status: 'error',
      message: 'Invalid request'
    })
  }
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
        [inputData.make, inputData.model, inputData.model_year], (err) => {
          if (err) {
            console.log(err)
            if (!err.statusCode) err.statusCode = 500
            res.status(err.statusCode).send({
              status: 'failed',
              error: err.message
            })
          } else {
            res.status(201).send({
              status: 'success',
              message: 'Car added'
            })
          }
        })
    }
  })
})

app.delete('/cars', (req, res) => {
  const carId = req.query.carId
  const carIdIsCorrect = carId && carId !== undefined
  const noQueryFound = Object.keys(req.query).length === 0
  const queryString = 'UPDATE cars_stock SET deleted=TRUE, date_deleted=current_date WHERE car_id=' + carId
  if (carIdIsCorrect) {
    pool.query(queryString, (err) => {
      if (err) {
        console.log(err)
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).send({
          status: 'failed',
          error: err.message
        })
      } else {
        res.status(200).send({
          status: 'success',
          message: 'Car deleted'
        })
      }
    })
  } else if (noQueryFound) {
    res.status(422).send({
      status: 'failed',
      message: 'Car Id must be provided'
    })
  } else if (carId === undefined) {
    res.status(422).json({
      status: 'error',
      message: 'Invalid request'
    })
  }
})

app.put('/cars', (req, res) => {
  const carId = req.query.carId
  const noQueryFound = Object.keys(req.query).length === 0
  const carIdIsCorrect = carId && carId !== undefined

  const inputData = { make: req.body.make, model: req.body.model, model_year: req.body.model_year, active: req.body.active }
  console.log(inputData)
  if (carIdIsCorrect) {
    const schema = Joi.object().keys({
      make: Joi.string().required(),
      model: Joi.string().required(),
      model_year: Joi.number().min(4).required(),
      active: Joi.boolean().required()
    })
    Joi.validate(inputData, schema, (err) => {
      if (err) {
        console.log(err)
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).send({
          status: 'failed schema',
          error: err.message
        })
      } else {
        const queryString = 'UPDATE cars_stock SET make=($1), model=($2), model_year=($3), active=($4) WHERE car_id=' + carId
        pool.query(queryString, [inputData.make, inputData.model, inputData.model_year, inputData.active], (err) => {
          if (err) {
            console.log(err)
            if (!err.statusCode) err.statusCode = 500
            res.status(err.statusCode).send({
              status: 'failed query',
              error: err.message
            })
          } else {
            res.status(201).send({
              status: 'success',
              message: 'Car details updated'
            })
          }
        })
      }
    })
  } else if (noQueryFound) {
    res.status(422).send({
      status: 'failed',
      message: 'Car Id must be provided'
    })
  } else if (carId === undefined) {
    res.status(422).json({
      status: 'error',
      message: 'Invalid request'
    })
  }
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
