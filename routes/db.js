const pgp = require('pg-promise')()
const Joi = require('@hapi/joi')

const connectionString = process.env.CONNECTIONSTRING
const db = pgp(connectionString)
const helperFunctions = require('./helpers/helperFunctions')
const schemaHelpers = require('./helpers/schemaHelpers')

db.connect()
  .then((obj) => {
    console.log('Connected')
    obj.done()
  })
  .catch((error) => {
    console.log('ERROR:', error.message)
  })

const getAllStats = (req, res, next) => {
  db.tx(transaction => {
    return transaction.batch([
      transaction.any('SELECT active FROM cars_stock'),
      transaction.any('SELECT request_type FROM http_requests')
    ])
  }).then(result => {
    helperFunctions.allStats(result, res)
  })
    .catch(err => {
      console.log(err)
      helperFunctions.failedErrorMessage(err, res)
    })
}

const getCars = (req, res, next) => {
  const carId = req.query.carId
  const noQueryFound = Object.keys(req.query).length === 0
  const carIdIsCorrect = carId && carId !== undefined
  if (carIdIsCorrect) {
    db.tx(transaction => {
      return transaction.batch([
        transaction.any('SELECT * FROM cars_stock WHERE deleted=FALSE AND car_id=' + carId),
        transaction.any('INSERT INTO http_requests(request_type, request_object)values($1, $2)',
          [req.method, JSON.stringify(req, helperFunctions.censor(req))])
      ])
    }).then(result => helperFunctions.successStatus(res, result))
      .catch(err => helperFunctions.internalServerError(err, res))
  } else if (noQueryFound) {
    db.tx(transaction => {
      return transaction.batch([
        transaction.any('SELECT * FROM cars_stock WHERE deleted= $1', [false]),
        transaction.any('INSERT INTO http_requests(request_type, request_object)values($1, $2)',
          [req.method, JSON.stringify(req, helperFunctions.censor(req))])
      ])
    }).then(result => helperFunctions.successStatus(res, result))
      .catch(err => helperFunctions.internalServerError(err, res))
  } else if (carId === undefined) {
    helperFunctions.invalidRequestError(res)
  }
}

const createNewCar = (req, res, next) => {
  const data = req.body
  const inputData = { make: req.body.make, model: req.body.model, model_year: req.body.model_year }
  Joi.validate(data, schemaHelpers.createCarSchema, (err) => {
    if (err) {
      console.log(err)
      helperFunctions.invalidRequestError(res)
    } else {
      db.tx(transaction => {
        return transaction.batch([
          transaction.any('INSERT INTO cars_stock(make, model, model_year)values($1, $2, $3)',
            [inputData.make, inputData.model, inputData.model_year]),
          transaction.any('INSERT INTO http_requests(request_type, request_object)values($1, $2)',
            [req.method, JSON.stringify(req, helperFunctions.censor(req))])
        ])
      }).then(result => helperFunctions.successCarAdded(res, result))
        .catch(err => helperFunctions.internalServerError(err, res))
    }
  })
}

const deleteCar = (req, res, next) => {
  const carId = req.query.carId
  const carIdIsCorrect = carId && carId !== undefined
  const noQueryFound = Object.keys(req.query).length === 0

  if (carIdIsCorrect) {
    db.tx(transaction => {
      return transaction.batch([
        transaction.any('UPDATE cars_stock SET deleted=TRUE, date_deleted=current_date WHERE car_id=' + carId),
        transaction.any('INSERT INTO http_requests(request_type, request_object)values($1, $2)',
          [req.method, JSON.stringify(req, helperFunctions.censor(req))])
      ])
    }).then(result => helperFunctions.successCarDeleted(res))
      .catch(err => helperFunctions.failedErrorMessage(err, res))
  } else if (noQueryFound) {
    helperFunctions.invalidRequestError(res)
  } else if (carId === undefined) {
    helperFunctions.invalidRequestError(res)
  }
}

const updateCarDetails = (req, res, next) => {
  const carId = req.query.carId
  const noQueryFound = Object.keys(req.query).length === 0
  const carIdIsCorrect = carId && carId !== undefined
  const inputData = {
    make: req.body.make,
    model: req.body.model,
    model_year: req.body.model_year,
    active: req.body.active }

  if (carIdIsCorrect) {
    Joi.validate(inputData, schemaHelpers.updateCarSchema, (err) => {
      if (err) {
        helperFunctions.failedErrorMessage(err, res)
      } else {
        db.tx(transaction => {
          return transaction.batch([
            transaction.any('UPDATE cars_stock SET make=($1), model=($2), model_year=($3), active=($4) WHERE car_id=' + carId,
              [inputData.make, inputData.model, inputData.model_year, inputData.active]),
            transaction.any('INSERT INTO http_requests(request_type, request_object)values($1, $2)',
              [req.method, JSON.stringify(req, helperFunctions.censor(req))])
          ])
        }).then(result => helperFunctions.successCarDetailsUpdated(res))
          .catch(err => helperFunctions.failedErrorMessage(err, res))
      }
    })
  } else if (noQueryFound) {
    helperFunctions.invalidRequestError(res)
  } else if (carId === undefined) {
    helperFunctions.invalidRequestError(res)
  }
}

module.exports = {
  getAllStats: getAllStats,
  createNewCar: createNewCar,
  getCars: getCars,
  deleteCar: deleteCar,
  updateCarDetails: updateCarDetails
}
