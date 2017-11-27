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
