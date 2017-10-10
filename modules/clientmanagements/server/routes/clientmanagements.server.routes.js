'use strict';

/**
 * Module dependencies
 */
var clientmanagementsPolicy = require('../policies/clientmanagements.server.policy'),
  clientmanagements = require('../controllers/clientmanagements.server.controller');

module.exports = function(app) {
  // Clientmanagements Routes
  app.route('/api/clientmanagements').all(clientmanagementsPolicy.isAllowed)
    .get(clientmanagements.list)
    .post(clientmanagements.create);

  app.route('/api/clientmanagements/:clientmanagementId').all(clientmanagementsPolicy.isAllowed)
    .get(clientmanagements.read)
    .put(clientmanagements.update)
    .delete(clientmanagements.delete);

  // Finish by binding the Clientmanagement middleware
  app.param('clientmanagementId', clientmanagements.clientmanagementByID);
};
