(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .controller('ClientmanagementsListController', ClientmanagementsListController);

  ClientmanagementsListController.$inject = ['ClientmanagementsService'];

  function ClientmanagementsListController(ClientmanagementsService) {
    var vm = this;

    vm.clientmanagements = ClientmanagementsService.query();
    vm.headSort = 'name';
    vm.reverse = false;
    vm.C_T = true;
    vm.C_F = false;
    vm.changeSort = changeSort;
    vm.hideArrow = hideArrow;

    //This changes the sorting of the table by the head selected and reverses it if it is selected again
    function changeSort(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
    }

    //This decides if the up or down arrow is displayed in a specific table head
    function hideArrow(arrowCatagory, arrowReverse) {
      if (arrowCatagory === vm.headSort && arrowReverse === vm.reverse) {
        return false;
      }
      else {
        return true;
      }
    }

    //this shows the inactive clients on the view of the client list
    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };

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
