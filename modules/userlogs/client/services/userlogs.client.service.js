// Userlogs service used to communicate Userlogs REST endpoints
(function () {
  'use strict';

  angular
    .module('userlogs')
    .factory('UserlogsService', UserlogsService);

  UserlogsService.$inject = ['$resource'];

  function UserlogsService($resource) {
    return $resource('api/userlogs/:userlogId', {
      userlogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
