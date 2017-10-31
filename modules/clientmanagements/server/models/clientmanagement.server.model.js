'use strict';

/**
 * Module dependencies.
 */
//var mongoose = require('./index');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
//var possibleRoles = ['foster','staff','sponsor','veteran','volunter'];
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
  /*created: {
    type: Date,
    default: Date.now
  },
  //user: {
    //type: Schema.ObjectId,
    //ref: 'user'      
  //}*/
  clientroles: {//type: Schema.ObjectId,    
    //type: String,
    //enum: ['IT','Design','Technology']      
    //enum NN{
    //  test1 = 'IT',
    //  test2 = 'Design',
    //  test3 = 'Technology'
    //},
    type: [{
      type: String,
      default: 'IT',
      enum: ['IT','Design','Technology']
    }],
    //default: 'IT',
    //enum: ['IT','Design','Technology'],
    //enum: ['foster','staff','sponsor','veteran','volunter'],
    //required: 'Title cannot be blank',
    //trim: true
    //type: [{
    //salutation: {
    //  type: String,
    //  enum: ['foster','staff','sponsor','veteran','volunter']//possibleRoles//user,admin
    //  default: '',
    //  required: '',
    //  trim: true,
    //}],
    //},
    //default: ['veteran']
    //required: 'Please provide at least one role'
    //ref: 'clientroles'
    //required: true
  },
  inactive: {
    type: Boolean,
    default: '',
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
module.exports = mongoose.model('Clientmanagement', ClientmanagementSchema);
//ClientmanagementSchema.virtual('possibleRoles').get(function () {
//    return possibleRoles;
//});
//var ClientModel = mongoose.model('Clientmanagement', ClientmanagementSchema);
//console.log(ClientModel.schema.path('clientroles').enumValues);
//var temp = new ClientModel();
//console.log(temp.schema.path('salutation').enumValues);