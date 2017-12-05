'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', 'Users',
  function ($scope, $state, Authentication, userResolve, Users) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    //remove a user from database
    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    //update a user after editing
    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    //validate the edit before updating 
    $scope.editCheck = function (editName, editID) {
      if(editName === Authentication.user.username) {
        alert('You cannot edit yourself.');
      }
      else {
        $state.go('admin.user-edit',{ userId: editID });
      }
    };
  }
]);
