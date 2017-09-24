const mongoose = require('mongoose');

const urlSchema = mongoose.Schema({
  url : {
    type: String, 
    required: true
  }, 
  sid : String
});

module.exports = mongoose.model("Url", urlSchema);