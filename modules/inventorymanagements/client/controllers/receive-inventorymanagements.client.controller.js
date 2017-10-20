(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .controller('InventorymanagementsReceiveController', InventorymanagementsReceiveController);

  InventorymanagementsReceiveController.$inject = ['InventorymanagementsService'];

  function InventorymanagementsReceiveController(InventorymanagementsService) {
    var vm = this;

    vm.inventorymanagements = InventorymanagementsService.query();

    function receive(upc, quantity) {
      //search for UPC in DB. if there, add quantity. if not, send to create page.
      //vm.inventorymanagement.quantity += quantity;
    }
  }
}());
