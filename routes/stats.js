const express = require('express')
const router = express.Router()
require('dotenv').config()
const db = require('./db')

router.get('/stats', db.getAllStats)

module.exports = router
