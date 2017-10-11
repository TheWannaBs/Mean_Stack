'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Clientmanagement = mongoose.model('Clientmanagement'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Clientmanagement
 */
exports.create = function(req, res) {
  var clientmanagement = new Clientmanagement(req.body);
  clientmanagement.user = req.user;

  clientmanagement.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clientmanagement);
    }
  });
};

/**
 * Show the current Clientmanagement
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var clientmanagement = req.clientmanagement ? req.clientmanagement.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  clientmanagement.isCurrentUserOwner = req.user && clientmanagement.user && clientmanagement.user._id.toString() === req.user._id.toString();

  res.jsonp(clientmanagement);
};

/**
 * Update a Clientmanagement
 */
exports.update = function(req, res) {
  var clientmanagement = req.clientmanagement;

  clientmanagement = _.extend(clientmanagement, req.body);

  clientmanagement.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clientmanagement);
    }
  });
};

/**
 * Delete an Clientmanagement
 */
exports.delete = function(req, res) {
  var clientmanagement = req.clientmanagement;

  clientmanagement.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clientmanagement);
    }
  });
};

/**
 * List of Clientmanagements
 */
exports.list = function(req, res) {
  Clientmanagement.find().sort('-created').populate('user', 'displayName').exec(function(err, clientmanagements) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clientmanagements);
    }
  });
};

/**
 * Clientmanagement middleware
 */
exports.clientmanagementByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Clientmanagement is invalid'
    });
  }

  Clientmanagement.findById(id).populate('user', 'displayName').exec(function (err, clientmanagement) {
    if (err) {
      return next(err);
    } else if (!clientmanagement) {
      return res.status(404).send({
        message: 'No Clientmanagement with that identifier has been found'
      });
    }
    req.clientmanagement = clientmanagement;
    next();
  });
};
