"use strict";

const router = require('express').Router();
const Url = require('./schema');
const url = require('url');

router.get("/:sid", (req, res) => {
  Url.findOne({ sid: req.params.sid }, (err, doc) => {
    if (err) {
      res.send(err.message);
      return;
    }
    if (doc) { // Found
      let urlObj = url.parse(doc.url);
      let prefix = urlObj.protocol ? '' : 'http://';
      res.redirect(prefix + doc.url);
    }
  });
});

module.exports = router;
