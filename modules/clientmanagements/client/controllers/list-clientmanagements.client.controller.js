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

    //this function sorts the heads of the table either in order or reverse order on the list view for clients
    function changeSort(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
    }

    //this shows the inactive clients on the view of the client list
    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };
  }
}());
