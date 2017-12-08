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
    vm.reverse = true;
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

    vm.directionGlyph = function (dir) {
      if (dir === '->') {
        return 'glyphicon glyphicon-arrow-right';
      }
      else {
        return 'glyphicon glyphicon-arrow-left';
      }
    };
  }
}());
