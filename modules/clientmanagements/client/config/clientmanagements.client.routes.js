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
        url: '',
        template: '<ui-view/>'
      })
      .state('clientmanagements.list', {
        url: '/clientmanagements',
        templateUrl: 'modules/clientmanagements/client/views/list-clientmanagements.client.view.html',
        controller: 'ClientmanagementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Clientmanagements List'
        }
      })
      .state('clientmanagements.create', {
        url: '/client/views/form-clientmanagement.client.view.html',
        templateUrl: 'modules/clientmanagements/client/views/form-clientmanagement.client.view.html',
        controller: 'ClientmanagementsController',
        controllerAs: 'vm',
        resolve: {
          clientmanagementResolve: newClientmanagement
        },
        data: {
          roles: ['user', 'admin'],
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
          roles: ['user', 'admin'],
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
