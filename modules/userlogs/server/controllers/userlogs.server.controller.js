'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Userlog = mongoose.model('Userlog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Userlog
 */
exports.create = function(req, res) {
  var userlog = new Userlog(req.body);
  userlog.user = req.user;

  userlog.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userlog);
    }
  });
};

/**
 * Show the current Userlog
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var userlog = req.userlog ? req.userlog.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userlog.isCurrentUserOwner = req.user && userlog.user && userlog.user._id.toString() === req.user._id.toString();

  res.jsonp(userlog);
};

/**
 * List of Userlogs
 */
exports.list = function(req, res) {
  Userlog.find().sort('-created').populate('user', 'displayName').exec(function(err, userlogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userlogs);
    }
  });
};

/**
 * Userlog middleware
 */
exports.userlogByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Userlog is invalid'
    });
  }

  Userlog.findById(id).populate('user', 'displayName').exec(function (err, userlog) {
    if (err) {
      return next(err);
    } else if (!userlog) {
      return res.status(404).send({
        message: 'No Userlog with that identifier has been found'
      });
    }
    req.userlog = userlog;
    next();
  });
};
