'use strict';

/**
 * Module dependencies
 */
var inventorymanagementsPolicy = require('../policies/inventorymanagements.server.policy'),
  inventorymanagements = require('../controllers/inventorymanagements.server.controller');

module.exports = function(app) {
  // Inventorymanagements Routes
  app.route('/api/inventorymanagements').all(inventorymanagementsPolicy.isAllowed)
    .get(inventorymanagements.list)
    .post(inventorymanagements.create);

  app.route('/api/inventorymanagements/:inventorymanagementId').all(inventorymanagementsPolicy.isAllowed)
    .get(inventorymanagements.read)
    .put(inventorymanagements.update)
    .delete(inventorymanagements.delete);

  // Finish by binding the Inventorymanagement middleware
  app.param('inventorymanagementId', inventorymanagements.inventorymanagementByID);
};
