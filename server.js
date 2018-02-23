"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const getmini = require('./api/getmini');
const postnew = require('./api/postnew');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const {method, url, body} = req;
  console.log({method, url, body});
  next();
});

app.use("/public", express.static(process.cwd() + "/public"));

app.use("/mini", getmini);

app.use('/new', postnew);

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.listen(port, () => {
  console.log(`Node.js listening on ${port}...`);
});
