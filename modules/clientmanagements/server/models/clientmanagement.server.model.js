'use strict';
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
    trim: true
  },
  dogID: {
    type: String,
    default: '',
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
    trim: true
  },
  branchString: {
    type: String,
    default: '',
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
