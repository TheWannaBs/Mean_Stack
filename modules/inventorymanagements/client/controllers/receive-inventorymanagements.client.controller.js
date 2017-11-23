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

    function toasty() {
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    $scope.receive = function() {
      //search for UPC in DB. if there, add quantity. if not, send to create page.
      var invResult = -1;
      if (!$scope.upc.upc && !$scope.quantity) {
        alert("You must fill in Quantity and UPC first");
      } else if (!$scope.upc.upc) {
        alert("You must fill in UPC first");
      } else if (!$scope.quantity) {
        alert("You must fill in Quantity first");
      } else {
        if($scope.quantity <= 0) {
          alert("Quantity must be greater than 0");
        }
        else {
          // look for upc in database
          for (var i = 0; i < vm.inventorymanagements.length; i++) {
            if (vm.inventorymanagements[i].upc === $scope.upc.upc) {
              invResult = i;
              break;
            }
          }
          // if upc isn't in database, go to create view
          if(invResult === -1) {
            $state.go('inventorymanagements.create', {
              'upc': $scope.upc.upc,
              'quantity': $scope.quantity
            });
          }
          //else update quantity and update database
          else {
            var quan = parseInt($scope.quantity);
            vm.inventorymanagements[invResult].qty += quan;

            vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
          }
        }
      }


      function successCallback(res) {
        // toast
        toasty();
        // reset quantity field
        $scope.quantity = null;
        // reload page
        $state.go('inventorymanagements.receive');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
}());
