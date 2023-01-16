const express = require("express");
const bodyParser = require("body-parser");
const { init } = require('./db')
const routes = require('./routes')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes)

// const uri = "mongodb+srv://db-testing:AiVfNLrbImo9hGRa@testingdb-insynctive.8wsmm93.mongodb.net"

init()

module.exports = app;
