(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .controller('ClientInventorymanagementsListController', ClientInventorymanagementsListController);

  angular
    .module('inventorymanagements')
    .controller('ClientInventorymanagementsListController', ClientInventorymanagementsListController);

  ClientInventorymanagementsListController.$inject = ['ClientmanagementsService', 'InventorymanagementsService'];

  function ClientInventorymanagementsListController(ClientmanagementsService, InventorymanagementsService) {
    var vm = this;

    vm.clientmanagements = ClientmanagementsService.query();
    vm.inventorymanagements = InventorymanagementsService.query();
  }
}());
