(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .controller('ClientmanagementsListController', ClientmanagementsListController);

  ClientmanagementsListController.$inject = ['ClientmanagementsService'];

  function ClientmanagementsListController(ClientmanagementsService) {
    var vm = this;

    vm.clientmanagements = ClientmanagementsService.query();
    vm.headSort = "tags";
    vm.printPage = printPage;

    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };

    //prints the page
    function printPage(divName) {
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open();
      popupWin.document.open();
      popupWin.document.write('<html><h1 class="page-header"> Client List </h1> <body onload="window.print()">' + printContents + '</body></html > ');
      popupWin.document.close();
    }
  }
}());
