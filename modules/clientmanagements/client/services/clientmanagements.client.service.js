// Clientmanagements service used to communicate Clientmanagements REST endpoints
(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .factory('ClientmanagementsService', ClientmanagementsService);

  ClientmanagementsService.$inject = ['$resource'];

  function ClientmanagementsService($resource) {
    return $resource('api/clientmanagements/:clientmanagementId', {
      clientmanagementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
