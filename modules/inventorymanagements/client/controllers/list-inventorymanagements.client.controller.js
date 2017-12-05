(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .controller('InventorymanagementsListController', InventorymanagementsListController);

  InventorymanagementsListController.$inject = ['InventorymanagementsService'];

  function InventorymanagementsListController(InventorymanagementsService) {
    var vm = this;
      
    console.log(angular.version);
      
    vm.inventorymanagements = InventorymanagementsService.query();
    vm.headSort = 'tags';
    vm.reverse = false;
    vm.changeSort = changeSort;

    function changeSort(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
    }

    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };
  }
}());
