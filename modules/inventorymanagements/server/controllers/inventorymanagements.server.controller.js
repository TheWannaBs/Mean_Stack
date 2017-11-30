'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Inventorymanagement = mongoose.model('Inventorymanagement'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Inventorymanagement
 */
exports.create = function(req, res) {
  var inventorymanagement = new Inventorymanagement(req.body);
  inventorymanagement.user = req.user;

  inventorymanagement.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventorymanagement);
    }
  });
};

/**
 * Show the current Inventorymanagement
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var inventorymanagement = req.inventorymanagement ? req.inventorymanagement.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  inventorymanagement.isCurrentUserOwner = req.user && inventorymanagement.user && inventorymanagement.user._id.toString() === req.user._id.toString();

  res.jsonp(inventorymanagement);
};

/**
 * Update a Inventorymanagement
 */
exports.update = function(req, res) {
  var inventorymanagement = req.inventorymanagement;

  inventorymanagement = _.extend(inventorymanagement, req.body);

  inventorymanagement.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventorymanagement);
    }
  });
};

/**
 * Delete an Inventorymanagement
 */
exports.delete = function(req, res) {
  var inventorymanagement = req.inventorymanagement;

  inventorymanagement.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventorymanagement);
    }
  });
};

/**
 * List of Inventorymanagements
 */
exports.list = function(req, res) {
  Inventorymanagement.find().sort('-created').populate('user', 'displayName').exec(function(err, inventorymanagements) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventorymanagements);
    }
  });
};

/**
 * Inventorymanagement middleware
 */
exports.inventorymanagementByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Inventorymanagement is invalid'
    });
  }

  Inventorymanagement.findById(id).populate('user', 'displayName').exec(function (err, inventorymanagement) {
    if (err) {
      return next(err);
    } else if (!inventorymanagement) {
      return res.status(404).send({
        message: 'No Inventorymanagement with that identifier has been found'
      });
    }
    req.inventorymanagement = inventorymanagement;
    next();
  });
};
