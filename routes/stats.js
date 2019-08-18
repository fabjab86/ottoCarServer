const express = require('express')
const router = express.Router()
require('dotenv').config()

router.get('/stats', (req, res) => {
  res.send({ message: 'you made it' })
})

module.exports = router
