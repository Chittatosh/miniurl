const mongoose = require('mongoose');

/** this project needs a db !! **/
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MLAB_URI, { useMongoClient: true })
  .then(() => console.log('Mongoose connected!'))
  .catch(error => {
    console.error('Catch:', error);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const urlSchema = mongoose.Schema({
  url : {
    type: String, 
    required: true
  }, 
  sid : String
});

module.exports = mongoose.model("Url", urlSchema);