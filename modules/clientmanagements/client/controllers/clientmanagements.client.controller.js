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
    vm.removeItem = removeItem;
    vm.save = save;
    vm.changeStatus = changeStatus;
    vm.labelDisp = labelDisp;
    vm.labelText = labelText;
    vm.buttonColor = buttonColor;
    vm.buttonText = buttonText;
    vm.branchText = branchText;
    vm.displayClientRoles = displayClientRoles;//list of clientrols

    // Remove existing Clientmanagement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.clientmanagement.$remove()
        .then(function(){
          $state.go('clientmanagements.list');
        });

      }
    }

    function removeItem(item) {
      var index = vm.clientmanagement.inventory.indexOf(item);
      if ($window.confirm('Are you sure you want to delete this client?')) {
        vm.clientmanagement.inventory.splice(index, 1);
        vm.clientmanagement.$update()
          .then(function (res) {
            $state.go('clientmanagements.view', {
              clientmanagementId: res._id
            });
          });
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

    function displayClientRoles() {
      var list = '';
      if(vm.clientmanagement.clientrolesFoster)
        list += 'Foster, ';
      if(vm.clientmanagement.clientrolesStaff)
        list += 'Staff, ';
      if(vm.clientmanagement.clientrolesSponsor)
        list += 'Sponsor, ';
      if(vm.clientmanagement.clientrolesVeteran)
        list += 'Veteran, ';
      if(vm.clientmanagement.clientrolesVolunteer)
        list += 'Volunteer, ';
      return list.slice(0,list.length-2);
    }

    //Change Activity of Item
    function changeStatus() {
      if ($window.confirm('Are you sure you want to change this client\'s activity?')) {
        vm.clientmanagement.inactive = !vm.clientmanagement.inactive;
        vm.clientmanagement.$update(vm.clientmanagement)
          .then(function () {
            $state.go('clientmanagements.view');
          });
      }
    }

    //Display Inactive Label
    function labelDisp() {
      if (vm.clientmanagement.inactive) {
        return 'label label-warning';
      }
      else {
        return '';
      }
    }

    //Display Lable Text
    function labelText() {
      if (vm.clientmanagement.inactive) {
        return 'Inactive';
      }
      else {
        return '';
      }
    }

    //Change Activity Button Color
    function buttonColor() {
      if (vm.clientmanagement.inactive) {
        return 'btn btn-success';
      }
      else {
        return 'btn btn-warning';
      }
    }

    //Change Activity Button Text
    function buttonText() {
      if (vm.clientmanagement.inactive) {
        return 'Activate';
      }
      else {
        return 'Deactivate';
      }
    }
    function branchText(){
      var branch = '';
      if(vm.clientmanagement.airForce){
        branch += 'Air Force, ';
      }
      if(vm.clientmanagement.army){
        branch += 'Army, ';
      }
      if(vm.clientmanagement.coastGuard){
        branch += 'Coast Guard, ';
      }
      if(vm.clientmanagement.marines){
        branch += 'Marines, ';
      }
      if(vm.clientmanagement.nationalGuard){
        branch += 'National Guard, ';
      }
      if(vm.clientmanagement.navy){
        branch += 'Navy, ';
      }
      if(branch){
        branch = branch.substring(0, branch.length-2);
      }
      return branch;
    }
  }
}());
