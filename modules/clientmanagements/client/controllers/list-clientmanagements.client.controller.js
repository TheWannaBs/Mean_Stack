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
