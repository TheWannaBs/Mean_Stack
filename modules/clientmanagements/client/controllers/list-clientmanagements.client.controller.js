(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .controller('ClientmanagementsListController', ClientmanagementsListController);

  ClientmanagementsListController.$inject = ['ClientmanagementsService'];

  function ClientmanagementsListController(ClientmanagementsService) {
    var vm = this;

    vm.clientmanagements = ClientmanagementsService.query();
    vm.headSort = 'tags';

    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };
  }
}());
