'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    $scope.headSort = 'username';
    $scope.reverse = false;
    $scope.C_T = true;
    $scope.C_F = false;

    //This changes the sorting of the table by the head selected and reverses it if it is selected again
    $scope.changeSort = function (headName) {
      $scope.reverse = (headName === $scope.headSort) ? !$scope.reverse : false;
      $scope.headSort = headName;
    }

    //This decides if the up or down arrow is displayed in a specific table head
    $scope.hideArrow = function (arrowCatagory, arrowReverse) {
      if (arrowCatagory === $scope.headSort && arrowReverse === $scope.reverse) {
        return false;
      }
      else {
        return true;
      }
    }

    //stores users locally to the webpage
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    //decides how many users to show per page
    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 1000;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    //helps decide what users to show.
    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };
  }
]);
