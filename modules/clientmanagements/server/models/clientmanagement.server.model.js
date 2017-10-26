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
    required: 'Please fill in client name',
    trim: true
  },
  phone: {
    type: String, //just in case there are hyphens or paraenthesis
    default: '',
    required: 'Please fill in client phone number',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill in email',
    trim: true
  },
  dogName: {
    type: String,
    default: '',
    required: 'Please fill in dog name',
    trim: true
  },
  dogID: {
    type: String,
    default: '',
    required: 'Please fill in Dog ID',
    trim: true
  },
  inactive: {
    type: Boolean,
    default: '',
    trim: true
  },
  airForce: {
    type: Boolean,
    default: '',
    trim: true
  },
  marines: {
    type: Boolean,
    default: '',
    trim: true
  },
  navy: {
    type: Boolean,
    default: '',
    trim: true
  },
  army: {
    type: Boolean,
    default: '',
    trim: true
  },
  coastGuard: {
    type: Boolean,
    default: '',
    trim: true
  },
  nationalGuard: {
    type: Boolean,
    default: '',
    trim: true
  },
  rank: {
    type: String,
    default: '',
    required: 'Please fill in a rank',
    trim: true
  },
  created: Date,
  updated: Date
 /* user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
  */
});

ClientmanagementSchema.pre('save', function (next) {
  var currentTime = new Date();
  this.updated = currentTime;
  if (!this.created) {
    this.created = currentTime;
  }
  next();
});

mongoose.model('Clientmanagement', ClientmanagementSchema);
