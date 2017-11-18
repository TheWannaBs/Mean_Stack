'use strict';

/**
 * Module dependencies
 */
var userlogsPolicy = require('../policies/userlogs.server.policy'),
  userlogs = require('../controllers/userlogs.server.controller');

module.exports = function(app) {
  // Userlogs Routes
  app.route('/api/userlogs').all(userlogsPolicy.isAllowed)
    .get(userlogs.list)
    .post(userlogs.create);

  app.route('/api/userlogs/:userlogId').all(userlogsPolicy.isAllowed)
    .get(userlogs.read)
    .put(userlogs.update)
    .delete(userlogs.delete);

  // Finish by binding the Userlog middleware
  app.param('userlogId', userlogs.userlogByID);
};
