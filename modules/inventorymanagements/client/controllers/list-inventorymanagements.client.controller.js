(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .controller('InventorymanagementsListController', InventorymanagementsListController);

  InventorymanagementsListController.$inject = ['InventorymanagementsService'];

  function InventorymanagementsListController(InventorymanagementsService) {
    var vm = this;

    vm.inventorymanagements = InventorymanagementsService.query();
  }
}());
