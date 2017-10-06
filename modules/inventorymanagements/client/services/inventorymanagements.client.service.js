// Inventorymanagements service used to communicate Inventorymanagements REST endpoints
(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .factory('InventorymanagementsService', InventorymanagementsService);

  InventorymanagementsService.$inject = ['$resource'];

  function InventorymanagementsService($resource) {
    return $resource('api/inventorymanagements/:inventorymanagementId', {
      inventorymanagementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
