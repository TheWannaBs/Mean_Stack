'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    $scope.headSort = 'username';
    $scope.reverse = false;
    $scope.changeSort = changeSort;

    //sort list of users by header; in order or out of order
    function changeSort(headName) {
      $scope.headSort = headName;
      $scope.reverse = (headName === $scope.headSort) ? !$scope.reverse : false;
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
