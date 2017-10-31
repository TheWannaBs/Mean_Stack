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
  /*inventoryTags: {
      type: String,
      default: '',
      trim: true
  },
  inventoryUPC: {
      type: String,
      default: '',
      trim: true
  },
  inventoryQty: {
      type: Number,
      default: '',
      trim: true
  },*/    
  inventory: [{
    tags: { type: String},//String,// default:''},
    upc: { type: String},//String,// default:''},
    qty: { type: Number}//Number//, default: 0}
  }],
  //salutation: {type: String, enum: ['Mr.', 'Mrs.', 'Ms.']},
  created: Date,
  updated: Date
  /* user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
  */
  //reviews: []
});

ClientmanagementSchema.pre('save', function (next) {
  var currentTime = new Date();
  this.updated = currentTime;
  if (!this.created) {
    this.created = currentTime;
  }
  next();
});
mongoose.model('Clientmanagement', ClientmanagementSchema);//module.exports = 
//ClientmanagementSchema.virtual('possibleRoles').get(function () {
//    return possibleRoles;
//});
//var ClientModel = mongoose.model('Clientmanagement', ClientmanagementSchema);
//console.log(ClientModel.schema.path('clientroles').enumValues);
//var temp = new ClientModel();
//console.log(temp.schema.path('salutation').enumValues);
