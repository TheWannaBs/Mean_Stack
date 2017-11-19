(function () {
  'use strict';

  angular
    .module('userlogs')
    .controller('InventorymanagementsReceiveController', InventorymanagementsReceiveController);

  angular
  .module('inventorymanagements')
  .controller('InventorymanagementsReceiveController', InventorymanagementsReceiveController);

  InventorymanagementsReceiveController.$inject = ['InventorymanagementsService', 'userlogResolve', 'Authentication', '$scope', '$state'];

  function InventorymanagementsReceiveController(InventorymanagementsService, userlog, Authentication, $scope, $state) {
    var vm = this;
    $scope.state = $state;
    vm.inventorymanagements = InventorymanagementsService.query();
    vm.userlog = userlog;

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
        //TODO: should this route to same page, or to list? (***This should route to recieve***)
        //TODO: also needs to pop-up a success message
        $scope.saveUserLog(invResult, quan);
        $state.go('inventorymanagements.receive');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    //should save 
    $scope.saveUserLog = function (i, q) {
      var item = vm.inventorymanagements[i];

      //create new user log with receve data
      vm.userlog.user = Authentication.user.username; //TODO: THIS BE FUNKY
      console.log(vm.userlog.user);
      vm.userlog.clientName = "RECIEVE";
      vm.userlog.clientRoles = "";
      vm.userlog.itemTags = vm.inventorymanagements[i].tags;
      vm.userlog.itemUpc = vm.inventorymanagements[i].upc;
      vm.userlog.direction = "->";
      vm.userlog.qty_moved = q;
      //save this log to the database
      vm.userlog.$save();
    };
  }
}());
