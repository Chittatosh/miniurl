"use strict";

const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bases = require("bases");
const cors = require("cors");
const dns = require("dns");
const url = require('url');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

/** this project needs a db !! **/
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MLAB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
const urlSchema = mongoose.Schema({ url: String });
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
const Url = mongoose.model("Url", urlSchema);

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  console.log(
    `${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`
  );
  next();
});

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", function(req, res) {
  let postedUrl = req.body.url;
  let urlObj = url.parse(postedUrl);
  let lookupUrl = urlObj.protocol ? urlObj.host : urlObj.pathname;
  dns.lookup(lookupUrl, function(err, addresses, family) {
    if (err) {
      console.error(err);
      res.json({ error: "invalid URL" });
    }
    else {
      Url.find(function(err, urlArr) {
        if (err) return console.error(err);
        let index = urlArr.findIndex(obj => obj.url === postedUrl);
        if (index != -1)
          res.json({
            original_url: urlArr[index].url,
            short_url: `https://miniurl.glitch.me/${bases.toBase58(index)}`
          });
        else {
          let newUrl = new Url({ url: postedUrl });
          newUrl.save(function(err, newUrl) {
            if (err) return console.error(err);
          });
          res.json({
            original_url: newUrl.url,
            short_url: `https://miniurl.glitch.me/${bases.toBase58(urlArr.length)}`
          });
        }
      });
    }
  });
});

app.get("/favicon.ico", function(req, res) {
  res.sendFile("/public/favicon.ico");
});

app.get("/:base58", function(req, res) {
  let index = bases.fromBase58(req.params.base58);
  Url.find(function(err, urlArr) {
    if (err) return console.error(err);
    let dbUrl = urlArr[index].url;
    let urlObj = url.parse(dbUrl);
    let prefix = urlObj.protocol ? '' : 'http://';
    res.redirect(prefix + dbUrl);
  });
});

app.listen(port, function() {
  console.log(`Node.js listening on ${port}...`);
});
