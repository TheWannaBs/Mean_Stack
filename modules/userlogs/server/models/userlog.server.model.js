'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Userlog Schema
 */
var UserlogSchema = new Schema({
  username: {
    type: String,
    trim: true
  },
  clientName: {
    type: String,
    trim: true
  },
  clientRoles: {
    type: String,
    trim: true
  },
  itemTags: {
    type: String,
    trim: true
  },
  itemUpc: {
    type: String,
    trim: true
  },
  direction: String,
  qty_moved: Number,
  timestamp: Date
});

UserlogSchema.pre('save', function (next) {
  var currentTime = new Date();
  this.timestamp = currentTime;
  next();
});

mongoose.model('Userlog', UserlogSchema);
