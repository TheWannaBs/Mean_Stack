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

    //sort table by header in order or out of order on list view of inventory
    function changeSort(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
    }

    //show inactive items in the inventory list
    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };
  }
}());
