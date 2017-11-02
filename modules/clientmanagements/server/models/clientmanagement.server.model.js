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
    required: 'Please fill Client Name',
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
  clientrolesFoster: {
    type: Boolean,
    default: '',
    trim: true      
  },
  clientrolesStaff: {
    type: Boolean,
    default: '',
    trim: true      
  },
  clientrolesSponsor: {
    type: Boolean,
    default: '',
    trim: true      
  },
  clientrolesVeteran: {
    type: Boolean,
    default: '',
    trim: true      
  },
  clientrolesVolunteer: {
    type: Boolean,
    default: '',
    trim: true      
  },
  inactive: {
    type: Boolean,
    default: '',
    trim: true
  },
  inventory: [{
    tags: String,
    upc: String,
    qty: Number
  }],
  created: Date,
  updated: Date
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