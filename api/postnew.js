"use strict";

const router = require('express').Router();
const Url = require('./schema');
const shortId = require('short-mongo-id');
const dns = require("dns");
const url = require('url');

router.post("/", (req, res) => {
  let postedUrl = req.body.url;
  Url.findOne({ url: postedUrl }, (err, doc) => {
    if (err) {
      res.send(err.message);
      return;
    }
    if (doc) { // Found
      res.json({
        original_url: doc.url,
        short_url: "https://miniurl.glitch.me/mini/"+doc.sid
      });
    } else {
      let urlObj = url.parse(postedUrl);
      console.log("urlObj", urlObj);
      let lookupUrl = urlObj.protocol ? urlObj.host : urlObj.pathname;
      dns.lookup(lookupUrl, (err, addresses, family) => {
        console.log("addresses", addresses);
        console.log("family", family);
        if (err || !addresses) {
          console.error("err", err);
          res.json({ error: "invalid URL" });
        } else {
          let newUrl = new Url({ url: postedUrl });
          newUrl.sid = shortId(newUrl._id);
          newUrl.save(function(err, savedUrl) {
            if (err) {
              res.send(err.message);
              return;
            }
            res.json({
              original_url: newUrl.url,
              short_url: "https://miniurl.glitch.me/mini/"+savedUrl.sid
            });
            console.log('savedUser: ', savedUrl);
          });
        }
      });
    }
  });
});

module.exports = router;
