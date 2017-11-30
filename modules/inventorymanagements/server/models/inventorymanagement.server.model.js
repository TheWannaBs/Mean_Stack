'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Inventorymanagement Schema
 */
var InventorymanagementSchema = new Schema({
  tags: {
    type: String,
    default: '',
    required: 'Please input at least one Inventory Tag',
    trim: true
  },
  upc: {
    type: String,
    default: 'NA',
    required: 'Please input UPC',
    unique: true
  },
  qty: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    default: '',
  },
  inactive: {
    type: Boolean,
    default: false,
  },
  created: Date,
  updated: Date
});

InventorymanagementSchema.pre('save', function (next) {
  var currentTime = new Date();
  this.updated = currentTime;
  if (!this.created) {
    this.created = currentTime;
  }
  next();
});

mongoose.model('Inventorymanagement', InventorymanagementSchema);
