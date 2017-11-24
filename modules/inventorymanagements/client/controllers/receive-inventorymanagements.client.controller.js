(function () {
  'use strict';

  angular
  .module('inventorymanagements')
  .controller('InventorymanagementsReceiveController', InventorymanagementsReceiveController);

  InventorymanagementsReceiveController.$inject = ['InventorymanagementsService', '$scope', '$state'];

  function InventorymanagementsReceiveController(InventorymanagementsService, $scope, $state) {
    var vm = this;
    $scope.state = $state;
    vm.inventorymanagements = InventorymanagementsService.query();
    $scope.choices = [{ id: 'choice1' }, { id: 'choice2' }];

    $scope.addNewChoice = function() {
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({ 'id':'choice'+newItemNo });
    };

    $scope.removeChoice = function() {
      var lastItem = $scope.choices.length-1;
      $scope.choices.splice(lastItem);
    };

    $scope.receive = function() {
      //search for UPC in DB. if there, add quantity. if not, send to create page.

      for (var i = 0; i < $scope.choices.length; i++) {
        var invResult = -1;
        for (var j = 0; j < vm.inventorymanagements.length; j++) {
          if (vm.inventorymanagements[j].upc === $scope.choices[i].upc.upc) {
            invResult = j;
            break;
          }
        }

        if(invResult === -1) {
          $state.go();
        }
        else {
          var quan = parseInt($scope.choices[i].quantity);
          vm.inventorymanagements[invResult].qty += quan;

          vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
        }
      }

      function successCallback(res) {
        //TODO: should this route to same page, or to list?
        //TODO: also needs to pop-up a success message
        $state.go('inventorymanagements.receive');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
}());
