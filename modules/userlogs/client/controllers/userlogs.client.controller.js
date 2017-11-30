(function () {
  'use strict';

  // Userlogs controller
  angular
    .module('userlogs')
    .controller('UserlogsController', UserlogsController);

  UserlogsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userlogResolve'];

  function UserlogsController ($scope, $state, $window, Authentication, userlog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userlog = userlog;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Userlog
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.userlog.$remove($state.go('userlogs.list'));
      }
    }

    // Save Userlog
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userlogForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.userlog._id) {
        vm.userlog.$update(successCallback, errorCallback);
      } else {
        vm.userlog.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('userlogs.view', {
          userlogId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
