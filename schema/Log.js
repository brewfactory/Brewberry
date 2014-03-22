/**
 * Mongoose Log model
 *
 * @module Log
 **/

'use strict';

var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Log;

Log = new Schema({

  date: {
    index: true,
    type: Date,
    'default': Date.now
  },

  level: {
    type: String,
    'default': 'info'
  },

  msg: {
    type: String
  },

  add: {}
});


// model
module.exports = mongoose.model('Log', Log);
