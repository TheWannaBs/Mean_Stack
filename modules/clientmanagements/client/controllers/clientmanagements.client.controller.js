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
    vm.changeStatus = changeStatus;
    vm.labelDisp = labelDisp;
    vm.labelText = labelText;
    vm.buttonColor = buttonColor;
    vm.buttonText = buttonText;

    // Remove existing Clientmanagement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.clientmanagement.$remove()
        .then(function(){
          $state.go('clientmanagements.list');
        });

      }
    }
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
        $state.go('clientmanagements.list', {
          clientmanagementId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //Change Activity of Item
    function changeStatus() {
      if ($window.confirm("Are you sure you want to change this item's activity?")) {
        vm.clientmanagement.inactive = !vm.clientmanagement.inactive;
        vm.clientmanagement.$update(vm.clientmanagement)
          .then(function () {
            $state.go("clientmanagements.view");
          });
      }
    }

    //Display Inactive Label
    function labelDisp() {
      if (vm.clientmanagement.inactive) {
        return "label label-warning";
      }
      else {
        return "";
      }
    }

    //Display Lable Text
    function labelText() {
      if (vm.clientmanagement.inactive) {
        return "Inactive";
      }
      else {
        return "";
      }
    }

    //Change Activity Button Color
    function buttonColor() {
      if (vm.clientmanagement.inactive) {
        return "btn btn-success";
      }
      else {
        return "btn btn-warning";
      }
    }

    //Change Activity Button Text
    function buttonText() {
      if (vm.clientmanagement.inactive) {
        return "Recontinue";
      }
      else {
        return "inactive";
      }
    }
  }
}());
