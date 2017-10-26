(function () {
  'use strict';

  // Clientmanagements controller
  angular
  .module('clientmanagements')
  .controller('ClientmanagementsController', ClientmanagementsController);

  ClientmanagementsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'clientmanagementResolve'];

  function ClientmanagementsController ($scope, $state, $window, Authentication, clientmanagement)
  {
    var vm = this;

    vm.authentication = Authentication;
    vm.clientmanagement = clientmanagement;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    //vm.clientRoles = clientRoles;
    vm.changeStatus = changeStatus;
    vm.labelDisp = labelDisp;
    vm.labelText = labelText;
    vm.buttonColor = buttonColor;
    vm.buttonText = buttonText;

    $scope.choices = [{ "name":"IT" },{ "name":"Design" },{ "name":"Technology" }];
    $scope.checkBoxArray = [];
    $scope.validate = function(value)
    {
      if ($scope.checkBoxArray.indexOf(value) === -1)
      {
        $scope.checkBoxArray.push(value);
      }
      else
      {
        $scope.checkBoxArray.splice($scope.checkBoxArray.indexOf(value), 1);
      }
    };
      
    $scope.disableButton = true;
    $scope.doTheThings = function (choice)
    {
      if (choice.checked) 
        $scope.disableButton = true;
      else 
        $scope.disableButton = false;
    };  
      
    /*$scope.options = [{
    name: 'java',
    value: true,
    }, {
    name: 'c#',
    value: false
    }, {
    name: 'angular',
    value: true
    }, {
    name: 'r',
    value: false
    }, {
    name: 'python',
    value: true
    }, {
    name: 'c++',
    value: true
    }];

    $scope.save = function() {
      var optionsCSV = '';
      $scope.options.forEach(function(option) {
        if (option.value) {
          // If this is not the first item
          if (optionsCSV) {
            optionsCSV += ','
          }
          optionsCSV += option.name;
        }
      })
      // Save the csv to your db (replace alert with your code)
      alert(optionsCSV);
    };         
    */  
      
    // Remove existing Clientmanagement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.clientmanagement.$remove()
        .then(function(){
          $state.go('clientmanagements.list');
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
        $state.go('clientmanagements.list', {
          clientmanagementId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }//save Clentmanagement
    
    //function clientRoles()
    //{
      //vm.clientmanagement.clientroles.$update();
    //}
      
      
      
  //}//big func end

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
        return "Activate";
      }
      else {
        return "Deactivate";
      }
    }
  }
}());