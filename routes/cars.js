const express = require('express')
const router = express.Router()
require('dotenv').config()
const db = require('./db')

router.get('/cars', db.getCars)

router.post('/cars', db.createNewCar)

router.delete('/cars', db.deleteCar)

router.put('/cars', db.updateCarDetails)

module.exports = router
