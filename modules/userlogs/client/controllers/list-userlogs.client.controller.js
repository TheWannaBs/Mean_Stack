(function () {
  'use strict';

  angular
    .module('userlogs')
    .controller('UserlogsListController', UserlogsListController);

  UserlogsListController.$inject = ['UserlogsService'];

  function UserlogsListController(UserlogsService) {
    var vm = this;

    vm.userlogs = UserlogsService.query();
    vm.headSort = 'timestamp';
    vm.reverse = false;
    vm.C_T = true;
    vm.C_F = false;

    //Sorts table by header; second click reverses the order
    vm.changeSort = function (headName) {
      vm.reverse = (headName === vm.headSort) ? !vm.reverse : false;
      vm.headSort = headName;
    }

    //This decides if the up or down arrow is displayed in a specific table head
    vm.hideArrow = function (arrowCatagory, arrowReverse) {
      if (arrowCatagory === vm.headSort && arrowReverse === vm.reverse) {
        return false;
      }
      else {
        return true;
      }
    }
    /*this is a helper function to replace strings at specific indicies with a substring 
    String.prototype.replaceAt = function (index, replacement) {
      return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }

    THIS IS FOR PAGENATION DO NOT DELETE
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = 20;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    vm.figureOutItemsToDisplay = function () {
      vm.filteredItems = $filter('filter')(vm.userlogs, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    };

    vm.pageChanged = function () {
      vm.figureOutItemsToDisplay();
    };
    */
  }
}());
