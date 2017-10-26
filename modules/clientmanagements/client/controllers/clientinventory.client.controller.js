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

    $scope.cancelButton = function () {
      if ("admin" === Authentication.user.roles[0]) {
        $state.go('mainmenuadmin');
      } else {
        $state.go('mainmenu');
      }
    };

    $scope.moveToClient = function () {
      if ($scope.serial && $scope.nameAndEmail) {
        var invResult = -1;
        for (var i = 0; i < vm.inventorymanagements.length; i++) {
          if (vm.inventorymanagements[i].upc === $scope.serial.upc) {
            invResult = i;
            break;
          }
        }
        if (vm.inventorymanagements[invResult].qty === 0) {
          // popup something?
          console.log("You can't move nothing");
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
        if (invResult !== -1 && clientResult !== -1) {
          // found an item with this upc and a client with the right name and email combo
          var alreadyHas = false;
          for(i = 0; i < vm.clientmanagements[clientResult].inventory.length; i++) {
            if (vm.clientmanagements[clientResult].inventory[i].upc === vm.inventorymanagements[invResult].upc) {
              // client already has this, increase by one
              vm.clientmanagements[clientResult].inventory[i].qty += 1;
              alreadyHas = true;
            }
          }
          if (!alreadyHas) {
            vm.clientmanagements[clientResult].inventory.push({
              tags: vm.inventorymanagements[invResult].tags,
              upc: vm.inventorymanagements[invResult].upc,
              qty: 1
            });
          }
          vm.inventorymanagements[invResult].qty -= 1;
          vm.clientmanagements[clientResult].$update(successCallback, errorCallback);
          vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
        }
      }
      function successCallback(res) {
        // TODO: what should this do? clear fields? go back home?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
}());
