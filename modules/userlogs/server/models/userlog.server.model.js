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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  client: {
    name: {
      type: String,
      trim: true
    },
    roles: {
      type: String,
      trim: true
    }
  },
  item: {
    tags: {
      type: String,
      trim: true
    },
    upc: {
      type: String,
      trim: true
    },
  },
  move_from_inventory: Boolean,
  qty_moved: Number,
  time: Date
});

UserlogSchema.pre('save', function (next) {
  var currentTime = new Date();
  this.time = currentTime;
  next();
});

mongoose.model('Userlog', UserlogSchema);
