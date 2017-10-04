(function () {
  'use strict';

  // Clientmanagements controller
  angular
    .module('clientmanagements')
    .controller('ClientmanagementsController', ClientmanagementsController);

  ClientmanagementsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'clientmanagementResolve'];

  function ClientmanagementsController ($scope, $state, $window, Authentication, clientmanagement) {
    var vm = this;

    vm.authentication = Authentication;
    vm.clientmanagement = clientmanagement;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Clientmanagement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.clientmanagement.$remove($state.go('clientmanagements.list'));
      }
    }

    // Save Clientmanagement
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clientmanagementForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.clientmanagement._id) {
        vm.clientmanagement.$update(successCallback, errorCallback);
      } else {
        vm.clientmanagement.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('clientmanagements.view', {
          clientmanagementId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
