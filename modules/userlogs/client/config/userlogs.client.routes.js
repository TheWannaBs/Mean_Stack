(function () {
  'use strict';

  angular
    .module('userlogs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userlogs', {
        abstract: true,
        url: '/userlogs',
        template: '<ui-view/>'
      })
      .state('userlogs.list', {
        url: '',
        templateUrl: 'modules/userlogs/client/views/list-userlogs.client.view.html',
        controller: 'UserlogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Userlogs List'
        }
      })
      .state('userlogs.create', {
        url: '/create',
        templateUrl: 'modules/userlogs/client/views/form-userlog.client.view.html',
        controller: 'UserlogsController',
        controllerAs: 'vm',
        resolve: {
          userlogResolve: newUserlog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Userlogs Create'
        }
      })
      .state('userlogs.edit', {
        url: '/:userlogId/edit',
        templateUrl: 'modules/userlogs/client/views/form-userlog.client.view.html',
        controller: 'UserlogsController',
        controllerAs: 'vm',
        resolve: {
          userlogResolve: getUserlog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Userlog {{ userlogResolve.name }}'
        }
      })
      .state('userlogs.view', {
        url: '/:userlogId',
        templateUrl: 'modules/userlogs/client/views/view-userlog.client.view.html',
        controller: 'UserlogsController',
        controllerAs: 'vm',
        resolve: {
          userlogResolve: getUserlog
        },
        data: {
          pageTitle: 'Userlog {{ userlogResolve.name }}'
        }
      });
  }

  getUserlog.$inject = ['$stateParams', 'UserlogsService'];

  function getUserlog($stateParams, UserlogsService) {
    return UserlogsService.get({
      userlogId: $stateParams.userlogId
    }).$promise;
  }

  newUserlog.$inject = ['UserlogsService'];

  function newUserlog(UserlogsService) {
    return new UserlogsService();
  }
}());
