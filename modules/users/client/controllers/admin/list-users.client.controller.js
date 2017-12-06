'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    $scope.headSort = 'username';
    $scope.reverse = false;
    $scope.reverseUsername = false;
    $scope.reverseRoles = false;
    $scope.reverseEmail = false;
    $scope.reverseUpdated = false;
    $scope.changeSortUsername = changeSortUsername;
    $scope.changeSortRoles = changeSortRoles;
    $scope.changeSortEmail = changeSortEmail;
    $scope.changeSortUpdated = changeSortUpdated;

    //sort list of users by header; in order or out of order
    function changeSortUsername(headName) {
      $scope.headSort = headName;
      $scope.reverse = (headName === $scope.headSort) ? !$scope.reverse : false;
      $scope.reverseUsername = $scope.reverse;
      $scope.reverseRoles = false;
      $scope.reverseEmail = false;
      $scope.reverseUpdated = false;
    }

    function changeSortRoles(headName) {
      $scope.headSort = headName;
      $scope.reverse = (headName === $scope.headSort) ? !$scope.reverse : false;
      $scope.reverseRoles = $scope.reverse;
      $scope.reverseUsername = false;
      $scope.reverseEmail = false;
      $scope.reverseUpdated = false;
    }

    function changeSortEmail(headName) {
      $scope.headSort = headName;
      $scope.reverse = (headName === $scope.headSort) ? !$scope.reverse : false;
      $scope.reverseEmail = $scope.reverse;
      $scope.reverseUsername = false;
      $scope.reverseRoles = false;
      $scope.reverseUpdated = false;
    }

    function changeSortUpdated(headName) {
      $scope.headSort = headName;
      $scope.reverse = (headName === $scope.headSort) ? !$scope.reverse : false;
      $scope.reverseUpdated = $scope.reverse;
      $scope.reverseUsername = false;
      $scope.reverseRoles = false;
      $scope.reverseEmail = false;
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
