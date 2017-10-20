(function () {
  'use strict';

  // Inventorymanagements controller
  angular
    .module('inventorymanagements')
    .controller('InventorymanagementsController', InventorymanagementsController);

  InventorymanagementsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'inventorymanagementResolve'];

  function InventorymanagementsController ($scope, $state, $window, Authentication, inventorymanagement) {
    var vm = this;

    vm.authentication = Authentication;
    vm.inventorymanagement = inventorymanagement;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.changeDCStatus = changeDCStatus;
    vm.discBtn = discBtn;
    vm.headSort = "tags";

    // Remove existing Inventorymanagement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.inventorymanagement.$remove()//vm.inventorymanagement)
          .then(function () {
            $state.go("inventorymanagements.list");
          });
        //vm.inventorymanagement.$remove($state.go('inventorymanagements.list'));
      }
    }

    // Save Inventorymanagement
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.inventorymanagementForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.inventorymanagement._id) {
        vm.inventorymanagement.$update(successCallback1, errorCallback);
      } else {
        vm.inventorymanagement.$save(successCallback2, errorCallback);
      }

      function successCallback1(res) {
        $state.go('inventorymanagements.view', {
          inventorymanagementId: res._id
        });
      }

      function successCallback2(res) {
        $state.go('inventorymanagements.list', {
          inventorymanagementId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function changeDCStatus() {
      vm.inventorymanagement.discontinue = !vm.inventorymanagement.discontinue;
      vm.inventorymanagement.$update(vm.inventorymanagement)
        .then(function () {
          $state.go("inventorymanagements.view");
        });
    }

    function discBtn() {
      if (vm.inventorymanagement.discontinue) {
        return "Recontinue";
      }
      else {
        return "Discontinue";
      }
    }
  }
}());
