const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config()
const { Client, Pool } = require('pg');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let PORT = 3030;
let connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

const client = new Client({
    connectionString: connectionString
});

client.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});
