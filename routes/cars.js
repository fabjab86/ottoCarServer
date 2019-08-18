const express = require('express')
const router = express.Router()
const { Pool } = require('pg')
const Joi = require('@hapi/joi')
require('dotenv').config()
const {
  internalServerError,
  successStatus,
  failedErrorMessage,
  invalidRequestError,
  successCarAdded,
  successCarDeleted,
  successCarDetailsUpdated
} = require('./helperFunctions')

const {
  updateCarSchema,
  createCarSchema
} = require('./schemaHelpers')
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
})

router.get('/cars', (req, res) => {
  const carId = req.query.carId
  const noQueryFound = Object.keys(req.query).length === 0
  const carIdIsCorrect = carId && carId !== undefined
  if (carIdIsCorrect) {
    const queryText = 'SELECT * FROM cars_stock WHERE car_id=' + carId
    pool.query(queryText, (err, result) => {
      if (err) {
        internalServerError(err, res)
      } else {
        successStatus(res, result)
      }
    })
  } else if (noQueryFound) {
    pool.query('SELECT * FROM cars_stock WHERE deleted=FALSE', (err, result) => {
      if (err) {
        failedErrorMessage(err, res)
      } else {
        successStatus(res, result)
      }
    })
  } else if (carId === undefined) {
    invalidRequestError(res)
  }
})

router.post('/cars', (req, res) => {
  const data = req.body
  const inputData = { make: req.body.make, model: req.body.model, model_year: req.body.model_year }

  Joi.validate(data, createCarSchema, (err) => {
    if (err) {
      invalidRequestError(err)
    } else {
      pool.query('INSERT INTO cars_stock(make, model, model_year)values($1, $2, $3)',
        [inputData.make, inputData.model, inputData.model_year], (err) => {
          if (err) {
            failedErrorMessage(err, res)
          } else {
            successCarAdded(res)
          }
        })
    }
  })
})

router.delete('/cars', (req, res) => {
  const carId = req.query.carId
  const carIdIsCorrect = carId && carId !== undefined
  const noQueryFound = Object.keys(req.query).length === 0
  const queryString = 'UPDATE cars_stock SET deleted=TRUE, date_deleted=current_date WHERE car_id=' + carId
  if (carIdIsCorrect) {
    pool.query(queryString, (err) => {
      if (err) {
        failedErrorMessage(err, res)
      } else {
        successCarDeleted(res)
      }
    })
  } else if (noQueryFound) {
    invalidRequestError(res)
  } else if (carId === undefined) {
    invalidRequestError(res)
  }
})

router.put('/cars', (req, res) => {
  const carId = req.query.carId
  const noQueryFound = Object.keys(req.query).length === 0
  const carIdIsCorrect = carId && carId !== undefined

  const inputData = { make: req.body.make, model: req.body.model, model_year: req.body.model_year, active: req.body.active }
  console.log(inputData)
  if (carIdIsCorrect) {
    Joi.validate(inputData, updateCarSchema, (err) => {
      if (err) {
        failedErrorMessage(err, res)
      } else {
        const queryString = 'UPDATE cars_stock SET make=($1), model=($2), model_year=($3), active=($4) WHERE car_id=' + carId
        pool.query(queryString, [inputData.make, inputData.model, inputData.model_year, inputData.active], (err) => {
          if (err) {
            failedErrorMessage(err, res)
          } else {
            successCarDetailsUpdated(res)
          }
        })
      }
    })
  } else if (noQueryFound) {
    invalidRequestError(res)
  } else if (carId === undefined) {
    invalidRequestError(res)
  }
})

module.exports = router
