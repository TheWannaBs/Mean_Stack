(function () {
  'use strict';

  // Inventorymanagements controller
  angular
    .module('inventorymanagements')
    .controller('InventorymanagementsController', InventorymanagementsController);

  InventorymanagementsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'inventorymanagementResolve'];

  function InventorymanagementsController($scope, $state, $window, Authentication, inventorymanagement) {
    var vm = this;

    vm.authentication = Authentication;
    vm.inventorymanagement = inventorymanagement;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.changeStatus = changeStatus;
    vm.labelDisp = labelDisp;
    vm.labelText = labelText;
    vm.buttonColor = buttonColor;
    vm.buttonText = buttonText;

    // Remove existing Inventorymanagement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.inventorymanagement.$remove()//vm.inventorymanagement)
          .then(function () {
            $state.go("inventorymanagements.list");
          });
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

    //Change Activity of Item
    function changeStatus () {
      if ($window.confirm("Are you sure you want to change this item's activity?")) {
        vm.inventorymanagement.inactive = !vm.inventorymanagement.inactive;
        vm.inventorymanagement.$update(vm.inventorymanagement)
          .then(function () {
            $state.go("inventorymanagements.view");
          });
      }
    }

    //Display Inactive Label
    function labelDisp () {
      if (vm.inventorymanagement.inactive) {
        return "label label-warning";
      }
      else {
        return "";
      }
    }

    //Display Lable Text
    function labelText () {
      if (vm.inventorymanagement.inactive) {
        return "Inactive";
      }
      else {
        return "";
      }
    }

    //Change Activity Button Color
    function buttonColor () {
      if (vm.inventorymanagement.inactive) {
        return "btn btn-success";
      }
      else {
        return "btn btn-warning";
      }
    }

    //Change Activity Button Text
    function buttonText() {
      if (vm.inventorymanagement.inactive) {
        return "Activate";
      }
      else {
        return "Deactivate";
      }
    }

  }
}());
