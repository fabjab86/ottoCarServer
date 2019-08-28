const app = require('./app.js')
const serverPort = process.env.PORT || 5000
require('dotenv').config()

app.listen(serverPort, (err) => {
  if (err) {
    console.log(err)
  }
  console.log(`Live on port ${serverPort}`)
})
