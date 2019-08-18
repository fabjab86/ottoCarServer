const app = require('./app.js')
const serverPort = (process.env.SERVER_PORT || 5000)
require('dotenv').config()
const pgp = require('pg-promise')()

const connectionString = process.env.CONNECTIONSTRING

const db = pgp(connectionString)

db.connect()
  .then((obj) => {
    console.log('Connected')
    obj.done()
  })
  .catch((error) => {
    console.log('ERROR:', error.message)
  })

app.listen(serverPort, (err) => {
  if (err) {
    console.log(err)
  }
  console.log(`Live on port ${serverPort}`)
})
