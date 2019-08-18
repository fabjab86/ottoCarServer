const app = require('./app.js')
const serverPort = (process.env.SERVER_PORT || 5000)
const { Client } = require('pg')
require('dotenv').config()

const connectionString = process.env.CONNECTIONSTRING

const client = new Client({
  connectionString: connectionString
})

client.connect((err) => {
  if (err) throw err
  console.log('Connected!')
})

app.listen(serverPort, (err) => {
  if (err) {
    console.log(err)
  }
  console.log(`Live on port ${serverPort}`)
})
