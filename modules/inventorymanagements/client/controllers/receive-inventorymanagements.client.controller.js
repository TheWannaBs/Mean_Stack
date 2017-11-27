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
    $scope.choices = [{ id: 'choice1', upc: '', quantity: '' }];

    $scope.addNewChoice = function() {
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({ 'id':'choice'+newItemNo, upc: '', quantity: '' });
    };

    $scope.removeChoice = function() {
      var lastItem = $scope.choices.length-1;
      $scope.choices.splice(lastItem);
    };

    function toasty() {
      var x = document.getElementById('snackbar');
      x.className = 'show';
      setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
    }

    function isNonzeroInteger(str) {
      if (str !== 0 && !str) {
        return true;
      }
      var n = Math.floor(Number(str));
      // console.log(str + " vs " + n);
      return String(n) === String(str) && n > 0;
    }

    $scope.receive = function() {
      // search for UPC in DB. if there, add quantity. if not, send to create page.
      // initial check over array of choices for error
      for (var i = 0; i < $scope.choices.length; i++) {
        $scope.choices[i].invResult = -1;
        if (!$scope.choices[i].upc.upc && !$scope.choices[i].quantity) {
          alert('You must fill in Quantity and UPC first');
          return;
        } else if (!$scope.choices[i].upc.upc) {
          alert('You must fill in UPC first');
          return;
        } else if (!$scope.choices[i].quantity) {
          alert('You must fill in Quantity first');
          return;
        } else if (!isNonzeroInteger($scope.choices[i].quantity)) {
          alert('Quantity must be a nonzero integer');
          return;
        }
        // look for upc in database
        for (var j = 0; j < vm.inventorymanagements.length; j++) {
          if (vm.inventorymanagements[j].upc === $scope.choices[i].upc.upc) {
            $scope.choices[i].invResult = j;
            break;
          }
        }

        // if upc isn't in database, go to create view
        if($scope.choices[i].invResult === -1) {
          $state.go('inventorymanagements.create', {
            'upc': $scope.choices[i].upc.upc,
            'quantity': $scope.choices[i].quantity
          });
          return;
        }
      }

      //if no errors, receive inventory
      for (var i2 = 0; i2 < $scope.choices.length; i2++) {
        var quan = parseInt($scope.choices[i2].quantity);
        // reset quantity field
        $scope.choices[i2].quantity = null;
        // quantity update
        vm.inventorymanagements[$scope.choices[i2].invResult].qty += quan;
        //update DB
        vm.inventorymanagements[$scope.choices[i2].invResult].$update(successCallback, errorCallback);
      }

      function successCallback(res) {
        // toast
        toasty();
        // reload page
        //$scope.saveUserLog(invResult, quan);
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
      vm.userlog.username = Authentication.user.username; 
      console.log(vm.userlog.username);
      vm.userlog.clientName = "RECIEVE";
      vm.userlog.itemTags = vm.inventorymanagements[i].tags;
      vm.userlog.itemUpc = vm.inventorymanagements[i].upc;
      vm.userlog.direction = "->";
      vm.userlog.qty_moved = q;
      //save this log to the database
      vm.userlog.$save();
    };
  }
}());
