const app = require('./app.js')
const serverPort = process.env.SERVER_PORT
require('dotenv').config()

app.listen(serverPort, (err) => {
  if (err) {
    console.log(err)
  }
  console.log(`Live on port ${serverPort}`)
})
