(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .controller('ClientInventorymanagementsListController', ClientInventorymanagementsListController);

  angular
    .module('inventorymanagements')
    .controller('ClientInventorymanagementsListController', ClientInventorymanagementsListController)
    .filter("emptyifblank", function () {
      return function (object, query) {
        if (!query)
          return {};
        else
          return object;
      };
    });

  ClientInventorymanagementsListController.$inject = ['ClientmanagementsService', 'InventorymanagementsService', '$scope', '$state', 'Authentication'];

  function ClientInventorymanagementsListController(ClientmanagementsService, InventorymanagementsService, $scope, $state, Authentication) {
    var vm = this;

    vm.clientmanagements = ClientmanagementsService.query();
    vm.inventorymanagements = InventorymanagementsService.query();
    $scope.$state = $state;
    $scope.authentication = Authentication;

    function toasty() {
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    $scope.cancelButton = function () {
      if ("admin" === Authentication.user.roles[0]) {
        $state.go('mainmenuadmin');
      } else {
        $state.go('mainmenu');
      }
    };

    function isNonzeroInteger(str) {
      var n = Math.floor(Number(str));
      return String(n) === str && n > 0;
    }

    $scope.moveToClient = function () {
      if (!$scope.serial && !$scope.nameAndEmail) {
        alert("You must fill in a Client and UPC first");
      } else if (!$scope.serial) {
        alert("You must fill in a UPC first");
      } else if (!$scope.nameAndEmail) {
        alert("You must fill in a Client first");
      } else if (!isNonzeroInteger($scope.qty)) {
        alert("Quantity must be a nonzero integer");
      } else {
        // if quantity is blank, default to 1
        if (!$scope.qty) {
          $scope.qty = 1;
        }
        var invResult = -1;
        for (var i = 0; i < vm.inventorymanagements.length; i++) {
          if (vm.inventorymanagements[i].upc === $scope.serial.upc) {
            invResult = i;
            break;
          }
        }
        if (vm.inventorymanagements[invResult].qty < $scope.qty) {
          // out of stock
          alert("There is not enough of this item in stock");
          return;
        }
        var clientInfo = $scope.nameAndEmail.split(" --- ");
        var clientResult = -1;
        for (i = 0; i < vm.clientmanagements.length; i++) {
          if (vm.clientmanagements[i].name === clientInfo[0] && vm.clientmanagements[i].email === clientInfo[1]) {
            clientResult = i;
            break;
          }
        }
        if (invResult === -1 && clientResult === -1) {
          alert("That Client and UPC don't exist");
        } else if (invResult === -1) {
          alert("That UPC doesn't exist");
        } else if (clientResult === -1) {
          alert("That Client doesn't exist");
        } else {
          // found an item with this upc and a client with the right name and email combo
          var alreadyHas = false;
          for (i = 0; i < vm.clientmanagements[clientResult].inventory.length; i++) {
            if (vm.clientmanagements[clientResult].inventory[i].upc === vm.inventorymanagements[invResult].upc) {
              // client already has this, increase by qty
              vm.clientmanagements[clientResult].inventory[i].qty += $scope.qty;
              alreadyHas = true;
              break;
            }
          }
          if (!alreadyHas) {
            vm.clientmanagements[clientResult].inventory.push({
              tags: vm.inventorymanagements[invResult].tags,
              upc: vm.inventorymanagements[invResult].upc,
              qty: $scope.qty
            });
          }
          vm.inventorymanagements[invResult].qty -= $scope.qty;
          vm.clientmanagements[clientResult].$update(successCallback, errorCallback);
          vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
          // gimme that toast
          toasty();
          // clear upc field
          $scope.serial = null;
          $scope.qty = null;
        }
      }
      function successCallback(res) {
        // toasty
        // console.log("success");
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    $scope.moveToInventory = function () {
      if (!$scope.serial && !$scope.nameAndEmail) {
        alert("You must fill in a Client and UPC first");
      } else if (!$scope.serial) {
        alert("You must fill in a UPC first");
      } else if (!$scope.nameAndEmail) {
        alert("You must fill in a Client first");
      } else if (!isNonzeroInteger($scope.qty)) {
        alert("Quantity must be a nonzero integer");
      } else {
        // if quantity is blank, default to 1
        if (!$scope.qty) {
          $scope.qty = 1;
        }
        var clientInfo = $scope.nameAndEmail.split(" --- ");
        var clientResult = -1;
        for (var i = 0; i < vm.clientmanagements.length; i++) {
          if (vm.clientmanagements[i].name === clientInfo[0] && vm.clientmanagements[i].email === clientInfo[1]) {
            clientResult = i;
            break;
          }
        }
        var invResult = -1;
        for (i = 0; i < vm.inventorymanagements.length; i++) {
          if (vm.inventorymanagements[i].upc === $scope.serial.upc) {
            invResult = i;
            break;
          }
        }
        if (invResult === -1 && clientResult === -1) {
          alert("That Client and UPC don't exist");
        } else if (invResult === -1) {
          alert("That UPC doesn't exist");
        } else if (clientResult === -1) {
          alert("That Client doesn't exist");
        } else {
          // client and item exist, now check if client has that item
          var alreadyHas = false;
          for (i = 0; i < vm.clientmanagements[clientResult].inventory.length; i++) {
            if (vm.clientmanagements[clientResult].inventory[i].upc === vm.inventorymanagements[invResult].upc) {
              // client already has this, now decrement by qty and check if item should be removed
              if (vm.clientmanagements[clientResult].inventory[i].qty < $scope.qty) {
                // client doesn't have >= $scope.qty
                alert("The Client doesn't have that many");
                return;
              }
              vm.clientmanagements[clientResult].inventory[i].qty -= $scope.qty;
              if (vm.clientmanagements[clientResult].inventory[i].qty === 0) {
                // remove this item from their inventory
                vm.clientmanagements[clientResult].inventory.splice(i, 1);
              }
              alreadyHas = true;
              break;
            }
          }
          if (!alreadyHas) {
            // client doesn't have this item, nothing to transfer
            alert("Client doesn't have this item");
            return;
          }
          vm.inventorymanagements[invResult].qty += $scope.qty;
          vm.clientmanagements[clientResult].$update(successCallback, errorCallback);
          vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
          // get toasty
          toasty();
          // clear upc field
          $scope.serial = null;
          $scope.qty = null;
        }
      }
      function successCallback(res) {
        // more toast
        // console.log("success");
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
}());
