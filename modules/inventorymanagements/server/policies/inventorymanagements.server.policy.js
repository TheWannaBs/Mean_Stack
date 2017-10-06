'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Inventorymanagements Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/inventorymanagements',
      permissions: '*'
    }, {
      resources: '/api/inventorymanagements/:inventorymanagementId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/inventorymanagements',
      permissions: ['get', 'post']
    }, {
      resources: '/api/inventorymanagements/:inventorymanagementId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/inventorymanagements',
      permissions: ['get']
    }, {
      resources: '/api/inventorymanagements/:inventorymanagementId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Inventorymanagements Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Inventorymanagement is being processed and the current user created it then allow any manipulation
  if (req.inventorymanagement && req.user && req.inventorymanagement.user && req.inventorymanagement.user.id === req.user.id) {
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
