'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Clientmanagement Schema
 */
var ClientmanagementSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Clientmanagement name',
    trim: true
  },
  phone: {
    type: String, //just in case there are hyphens or paraenthesis
    default: '',
    required: 'Please fill in Client Phone Number',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill email',
    trim: true
  },
  dogName: {
    type: String,
    default: '',
    required: 'Please fill dogName',
    trim: true
  },
  dogID: {
    type: String,
    default: '',
    required: 'Please fill dogID',
    trim: true
  },
  Inactive: {
    type: Boolean,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Clientmanagement', ClientmanagementSchema);
