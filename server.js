"use strict";

const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const shortId = require('short-mongo-id');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

/** this project needs a db !! **/
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MLAB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(
    `${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`
  );
  next();
});

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

const router = require('./lib/router');
app.use('/api/shorturl', router);

app.listen(port, () => {
  console.log(`Node.js listening on ${port}...`);
});
