'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Clientmanagements Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/clientmanagements',
      permissions: '*'
    }, {
      resources: '/api/clientmanagements/:clientmanagementId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/clientmanagements',
      permissions: ['get', 'post']
    }, {
      resources: '/api/clientmanagements/:clientmanagementId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/clientmanagements',
      permissions: ['get']
    }, {
      resources: '/api/clientmanagements/:clientmanagementId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Clientmanagements Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Clientmanagement is being processed and the current user created it then allow any manipulation
  if (req.clientmanagement && req.user && req.clientmanagement.user && req.clientmanagement.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
