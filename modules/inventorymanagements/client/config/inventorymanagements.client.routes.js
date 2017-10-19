(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('inventorymanagements', {
        abstract: true,
        url: '/inventorymanagements',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin'],
        }
      })
      .state('inventorymanagements.list', {
        url: '',
        templateUrl: 'modules/inventorymanagements/client/views/list-inventorymanagements.client.view.html',
        controller: 'InventorymanagementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Inventory List'
        }
      })
      .state('inventorymanagements.create', {
        url: '/create',
        templateUrl: 'modules/inventorymanagements/client/views/create-inventorymanagement.client.view.html',
        controller: 'InventorymanagementsController',
        controllerAs: 'vm',
        resolve: {
          inventorymanagementResolve: newInventorymanagement
        },
        data: {
          pageTitle: 'Inventory Create'
        }
      })
      .state('inventorymanagements.edit', {
        url: '/:inventorymanagementId/edit',
        templateUrl: 'modules/inventorymanagements/client/views/edit-inventorymanagement.client.view.html',
        controller: 'InventorymanagementsController',
        controllerAs: 'vm',
        resolve: {
          inventorymanagementResolve: getInventorymanagement
        },
        data: {
          pageTitle: 'Edit Inventory {{ inventorymanagementResolve.upc }}'
        }
      })
      .state('inventorymanagements.view', {
        url: '/:inventorymanagementId',
        templateUrl: 'modules/inventorymanagements/client/views/view-inventorymanagement.client.view.html',
        controller: 'InventorymanagementsController',
        controllerAs: 'vm',
        resolve: {
          inventorymanagementResolve: getInventorymanagement
        },
        data: {
          pageTitle: 'Inventory {{ inventorymanagementResolve.tags }}'
        }
      });
  }

  getInventorymanagement.$inject = ['$stateParams', 'InventorymanagementsService'];

  function getInventorymanagement($stateParams, InventorymanagementsService) {
    return InventorymanagementsService.get({
      inventorymanagementId: $stateParams.inventorymanagementId
    }).$promise;
  }

  newInventorymanagement.$inject = ['InventorymanagementsService'];

  function newInventorymanagement(InventorymanagementsService) {
    return new InventorymanagementsService();
  }
}());
