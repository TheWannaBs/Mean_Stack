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
    vm.reverseName = false;
    vm.reversePhone = false;
    vm.reverseEmail = false;
    vm.reverseDogName = false;
    vm.reverseDogID = false;
    vm.reverseRank = false;
    vm.reverseUpdated = false;
    //vm.changeSort = changeSort;
    vm.changeSortName = changeSortName;
    vm.changeSortPhone = changeSortPhone;
    vm.changeSortEmail = changeSortEmail;
    vm.changeSortDogName = changeSortDogName;
    vm.changeSortDogID = changeSortDogID;
    vm.changeSortRank = changeSortRank;
    vm.changeSortUpdated = changeSortUpdated;
    //vm.sort = false;

    //these function sort the heads of the table either in order or reverse order on the list view for clients
    function changeSortName(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseName = vm.reverse;
      vm.reversePhone = false;
      vm.reverseEmail = false;
      vm.reverseDogName = false;
      vm.reverseDogID = false;
      vm.reverseRank = false;
      vm.reverseUpdated = false;
    }

    function changeSortPhone(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reversePhone = vm.reverse;
      vm.reverseName = false;
      vm.reverseEmail = false;
      vm.reverseDogName = false;
      vm.reverseDogID = false;
      vm.reverseRank = false;
      vm.reverseUpdated = false;
    }

    function changeSortEmail(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseEmail = vm.reverse;
      vm.reverseName = false;
      vm.reversePhone = false;
      vm.reverseDogName = false;
      vm.reverseDogID = false;
      vm.reverseRank = false;
      vm.reverseUpdated = false;
    }

    function changeSortDogName(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseDogName = vm.reverse;
      vm.reverseName = false;
      vm.reversePhone = false;
      vm.reverseEmail = false;
      vm.reverseDogID = false;
      vm.reverseRank = false;
      vm.reverseUpdated = false;
    }

    function changeSortDogID(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseDogID = vm.reverse;
      vm.reverseName = false;
      vm.reversePhone = false;
      vm.reverseEmail = false;
      vm.reverseDogName = false;
      vm.reverseRank = false;
      vm.reverseUpdated = false;
    }

    function changeSortRank(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseRank = vm.reverse;
      vm.reverseName = false;
      vm.reversePhone = false;
      vm.reverseEmail = false;
      vm.reverseDogName = false;
      vm.reverseDogID = false;
      vm.reverseUpdated = false;
    }

    function changeSortUpdated(headName) {
      vm.headSort = headName;
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.reverseUpdated = vm.reverse;
      vm.reverseName = false;
      vm.reversePhone = false;
      vm.reverseEmail = false;
      vm.reverseDogName = false;
      vm.reverseDogID = false;
      vm.reverseRank = false;
    }

    //this shows the inactive clients on the view of the client list
    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };

  }
}());
