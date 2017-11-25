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

  ClientInventorymanagementsListController.$inject = ['ClientmanagementsService', 'InventorymanagementsService', '$scope', '$state', 'Authentication', '$compile'];

  function ClientInventorymanagementsListController(ClientmanagementsService, InventorymanagementsService, $scope, $state, Authentication, $compile) {
    var vm = this;

    vm.clientmanagements = ClientmanagementsService.query();
    vm.inventorymanagements = InventorymanagementsService.query();
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.serial = [];
    $scope.qty = [];
    $scope.nameAndEmail = [];
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
      if (str !== 0 && !str) {
        return true;
      }
      var n = Math.floor(Number(str));
      // console.log(str + " vs " + n);
      return String(n) === String(str) && n > 0;
    }

    var upcFields = 1;
    $scope.addUPC = function () {
      var newCen = document.createElement('center');
      newCen.innerHTML = '<input type="text" list="Inventory" placeholder="UPC - Will autofill after successful scan" ng-model="serial[' + upcFields + '].upc" style="width: 270px;" required></input><input type="number" ng-model="qty[' + upcFields + ']" style="width: 50px;"></input>';
      $compile(newCen)($scope);
      document.getElementById('input_upc').appendChild(newCen);
      upcFields++;
    };

    $scope.deleteUPC = function () {
      if (upcFields > 1) {
        var upcs = document.getElementById('input_upc');
        upcs.removeChild(upcs.lastChild);
        upcFields--;
      }
    };

    var clientFields = 1;
    $scope.addClient = function () {
      var newCen = document.createElement('center');
      newCen.innerHTML = '<input type="text" list="Clients" placeholder="Client Name" ng-model="nameAndEmail[' + clientFields + ']" style="width: 320px;" required></input>';
      $compile(newCen)($scope);
      document.getElementById('input_client').appendChild(newCen);
      clientFields++;
    };

    $scope.deleteClient = function () {
      if (clientFields > 1) {
        var clients = document.getElementById('input_client');
        clients.removeChild(clients.lastChild);
        clientFields--;
      }
    };

    $scope.moveToClient = function () {
      // first loop through to verify the fields are valid
      for (var i = 0; i < upcFields; i++) {
        if (!$scope.serial[i]) {
          alert("You cannot leave a UPC field blank");
          return;
        } else if (!isNonzeroInteger($scope.qty[i])) {
          alert("Quantity must be a nonzero integer");
          return;
        }
      }
      for (var v = 0; v < clientFields; v++) {
        if (!$scope.nameAndEmail[v]) {
          alert("You cannot leave a Client field blank");
          return;
        }
      }
      for (i = 0; i < upcFields; i++) {
        // if quantity is blank, default to 1
        var quant = $scope.qty[i];
        if (!$scope.qty[i]) {
          quant = 1;
        }
        var invResult = -1;
        for (var w = 0; w < vm.inventorymanagements.length; w++) {
          if (vm.inventorymanagements[w].upc === $scope.serial[i].upc) {
            invResult = w;
            break;
          }
        }
        if (vm.inventorymanagements[invResult].qty < (quant*clientFields)) {
          // out of stock
          alert("There is not enough of this item in stock");
          return;
        }
        // clear upc field
        $scope.serial[i] = null;
        $scope.qty[i] = null;
        for (v = 0; v < clientFields; v++) {
          var clientInfo = $scope.nameAndEmail[v].split(" --- ");
          var clientResult = -1;
          for (w = 0; w < vm.clientmanagements.length; w++) {
            if (vm.clientmanagements[w].name === clientInfo[0] && vm.clientmanagements[w].email === clientInfo[1]) {
              clientResult = w;
              break;
            }
          }
          if (invResult === -1 && clientResult === -1) {
            alert("At least one Client and UPC don't exist");
            return;
          } else if (invResult === -1) {
            alert("At least one UPC doesn't exist");
            return;
          } else if (clientResult === -1) {
            alert("At least one Client doesn't exist");
            return;
          } else {
            // found an item with this upc and a client with the right name and email combo
            var alreadyHas = false;
            for (w = 0; w < vm.clientmanagements[clientResult].inventory.length; w++) {
              if (vm.clientmanagements[clientResult].inventory[w].upc === vm.inventorymanagements[invResult].upc) {
                // client already has this, increase by qty
                vm.clientmanagements[clientResult].inventory[w].qty += quant;
                alreadyHas = true;
                break;
              }
            }
            if (!alreadyHas) {
              vm.clientmanagements[clientResult].inventory.push({
                tags: vm.inventorymanagements[invResult].tags,
                upc: vm.inventorymanagements[invResult].upc,
                qty: quant
              });
            }
            vm.inventorymanagements[invResult].qty -= quant;
            vm.clientmanagements[clientResult].$update(successCallback, errorCallback);
          }
        }
        vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
      }
      // gimme that toast
      toasty();

      function successCallback(res) {
        // toasty
        // console.log("success");
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    $scope.moveToInventory = function () {
      // first loop through to verify the fields are valid
      for (var i = 0; i < upcFields; i++) {
        if (!$scope.serial[i]) {
          alert("You cannot leave a UPC field blank");
          return;
        } else if (!isNonzeroInteger($scope.qty[i])) {
          alert("Quantity must be a nonzero integer");
          return;
        }
      }
      for (var v = 0; v < clientFields; v++) {
        if (!$scope.nameAndEmail[v]) {
          alert("You cannot leave a Client field blank");
          return;
        }
      }
      for (i = 0; i < upcFields; i++) {
        // if quantity is blank, default to 1
        var quant = $scope.qty[i];
        if (!$scope.qty[i]) {
          quant = 1;
        }
        var invResult = -1;
        for (var w = 0; w < vm.inventorymanagements.length; w++) {
          if (vm.inventorymanagements[w].upc === $scope.serial[i].upc) {
            invResult = w;
            break;
          }
        }
        // clear upc field
        $scope.serial[i] = null;
        $scope.qty[i] = null;
        for (v = 0; v < clientFields; v++) {
          var clientInfo = $scope.nameAndEmail[v].split(" --- ");
          var clientResult = -1;
          for (w = 0; w < vm.clientmanagements.length; w++) {
            if (vm.clientmanagements[w].name === clientInfo[0] && vm.clientmanagements[w].email === clientInfo[1]) {
              clientResult = w;
              break;
            }
          }
          if (invResult === -1 && clientResult === -1) {
            alert("At least one Client and UPC don't exist");
            return;
          } else if (invResult === -1) {
            alert("At least one UPC doesn't exist");
            return;
          } else if (clientResult === -1) {
            alert("At least one Client doesn't exist");
            return;
          } else {
            // client and item exist, now check if client has that item
            var alreadyHas = false;
            var notEnough = false;
            for (w = 0; w < vm.clientmanagements[clientResult].inventory.length; w++) {
              if (vm.clientmanagements[clientResult].inventory[w].upc === vm.inventorymanagements[invResult].upc) {
                // client already has this, now decrement by qty and check if item should be removed
                if (vm.clientmanagements[clientResult].inventory[w].qty < quant) {
                  // client doesn't have >= $scope.qty[i]
                  alert(clientInfo[0]+" doesn't have that many, skipping to next client if there is another");
                  notEnough = true;
                  break;
                }
                vm.clientmanagements[clientResult].inventory[w].qty -= quant;
                if (vm.clientmanagements[clientResult].inventory[w].qty === 0) {
                  // remove this item from their inventory
                  vm.clientmanagements[clientResult].inventory.splice(w, 1);
                }
                alreadyHas = true;
                break;
              }
            }
            if (notEnough) {
              continue;
            } else if (!alreadyHas) {
              // client doesn't have this item, nothing to transfer
              alert(clientInfo[0]+" doesn't have this item, skipping to next client if there is another");
              continue;
            }
            vm.inventorymanagements[invResult].qty += quant;
            vm.clientmanagements[clientResult].$update(successCallback, errorCallback);
          }
        }
        vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
      }
      // get toasty
      toasty();

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
