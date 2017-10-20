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
      
      
      
  }//big func end
}());