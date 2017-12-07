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

    //This changes the sorting of the table by the head selected and reverses it if it is selected again
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

    //this shows the inactive clients on the view of the client list
    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };

    //changes color of a row if that row is inactive
    vm.inactiveRow = function (item) {
      if (item.inactive) {
        return {
          'opacity': '1',
          'background-color': 'orange'
        };
      }
      else {
        return '';
      }
    };
  }
}());
