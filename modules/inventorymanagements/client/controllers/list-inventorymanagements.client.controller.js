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
    vm.C_T = true;
    vm.C_F = false;

    //Sorts table by header; second click reverses the order
    vm.changeSort = function (headName) {
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.headSort = headName;
    };

    //This decides if the up or down arrow is displayed in a specific table head
    vm.hideArrow = function (arrowCatagory, arrowReverse) {
      if (arrowCatagory === vm.headSort && arrowReverse === vm.reverse) {
        return false;
      }
      else {
        return true;
      }
    };

    //this shows the inactive items on the view of the inventory list
    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };

    //Changes color of a row if that item is inactive
    vm.inactiveRow = function (item) {
      if (item.inactive) {
        return 'danger';
      }
      else {
        return '';
      }
    };
  }
}());
