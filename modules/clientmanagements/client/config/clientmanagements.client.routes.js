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
        url: '',//'clientmanagements/
        template: '<ui-view/>'
        //data: {
        //  roles : ['user', 'admin']//just admin?
        //}
      })
      .state('clientmanagements.list', {
        url: '/list',//'clientmanagements',//'/clientmanagements/client/views/list-clientmanagements.client.view.html',//'list',
        templateUrl: 'modules/clientmanagements/client/views/list-clientmanagements.client.view.html',
        controller: 'ClientmanagementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Clientmanagements List'
        }
      })
      .state('clientmanagements.create', {
        url: '/client/views/form-clientmanagement.client.view.html',//'/create',
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
        url: '/:clientmanagementId/edit',//'client/views/form-clientmanagement.client.view.html'//
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
        url: '/:clientmanagementId',//'client/views/view-clientmanagement.client.view.htmt'//
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