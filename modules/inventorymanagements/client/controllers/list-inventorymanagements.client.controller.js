(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .controller('InventorymanagementsListController', InventorymanagementsListController);

  InventorymanagementsListController.$inject = ['InventorymanagementsService'];

  function InventorymanagementsListController(InventorymanagementsService) {
    var vm = this;
      
    //console.log(angular.version);
      
    vm.inventorymanagements = InventorymanagementsService.query();
    vm.headSort = 'tags';
    vm.reverse = false;
    vm.reverseTags = false;
    vm.reverseUPC = false;
    vm.reverseQuantity = false;
    vm.reverseUpdated = false;
    //vm.changeSort = changeSort;
    vm.changeSortTags = changeSortTags;
    vm.changeSortUPC = changeSortUPC;
    vm.changeSortQuantity = changeSortQuantity;
    vm.changeSortUpdated = changeSortUpdated;

    //sort table by header in order or out of order on list view of inventory
    function changeSortTags(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseTags = vm.reverse;
    }
    
     function changeSortUPC(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
       vm.reverseUPC = vm.reverse;
    }
    
     function changeSortQuantity(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseQuantity = vm.reverse;
    }
    
     function changeSortUpdated(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseUpdated = vm.reverse;
    }

    //show inactive items in the inventory list
    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };
  }
}());
