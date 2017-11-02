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

    $scope.receive = function() {
      //search for UPC in DB. if there, add quantity. if not, send to create page.

      //TODO: remove these
      console.log($scope.upc.upc);
      console.log($scope.quantity);

      var invResult = -1;
      for (var i = 0; i < vm.inventorymanagements.length; i++) {
        if (vm.inventorymanagements[i].upc === $scope.upc.upc) {
          invResult = i;
          break;
        }
      }

      if(invResult === -1) {
        $state.go();
      }
      else {
        var quan = parseInt($scope.quantity);
        vm.inventorymanagements[invResult].qty += quan;

        vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
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
