(function () {
  'use strict';

  angular
    .module('userlogs')
    .controller('UserlogsListController', UserlogsListController);

  UserlogsListController.$inject = ['UserlogsService'];

  function UserlogsListController(UserlogsService) {
    var vm = this;

    vm.userlogs = UserlogsService.query();
    vm.headsort = "timestamp";

    /* THIS IS FOR PAGENATION DO NOT DELETE
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
