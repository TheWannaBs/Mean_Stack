(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('clientmanagements', {
        abstract: true,
        url: '/clientmanagements',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('clientmanagements.list', {
        url: '/list',
        templateUrl: 'modules/clientmanagements/client/views/list-clientmanagements.client.view.html',
        controller: 'ClientmanagementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Clientmanagements List'
        }
      })
      .state('clientmanagements.create', {
        url: '/create',
        templateUrl: 'modules/clientmanagements/client/views/form-clientmanagement.client.view.html',
        controller: 'ClientmanagementsController',
        controllerAs: 'vm',
        resolve: {
          clientmanagementResolve: newClientmanagement
        },
        data: {
          pageTitle: 'Clientmanagements Create'
        }
      })
      .state('clientmanagements.edit', {
        url: '/:clientmanagementId/edit',
        templateUrl: 'modules/clientmanagements/client/views/form-clientmanagement.client.view.html',
        controller: 'ClientmanagementsController',
        controllerAs: 'vm',
        resolve: {
          clientmanagementResolve: getClientmanagement
        },
        data: {
          pageTitle: 'Edit Clientmanagement {{ clientmanagementResolve.name }}'
        }
      })
      .state('clientmanagements.view', {
        url: '/:clientmanagementId',
        templateUrl: 'modules/clientmanagements/client/views/view-clientmanagement.client.view.html',
        controller: 'ClientmanagementsController',
        controllerAs: 'vm',
        resolve: {
          clientmanagementResolve: getClientmanagement
        },
        data: {
          pageTitle: 'Clientmanagement {{ clientmanagementResolve.name }}'
        }
      })
      .state('moveinventory', {
        url: '/moveitems',
        templateUrl: 'modules/clientmanagements/client/views/move-inv.client.view.html',
        controller: 'ClientInventorymanagementsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      });
  }

  getClientmanagement.$inject = ['$stateParams', 'ClientmanagementsService'];

  function getClientmanagement($stateParams, ClientmanagementsService) {
    return ClientmanagementsService.get({
      clientmanagementId: $stateParams.clientmanagementId
    }).$promise;
  }

  newClientmanagement.$inject = ['ClientmanagementsService'];

  function newClientmanagement(ClientmanagementsService) {
    return new ClientmanagementsService();
  }
}());
