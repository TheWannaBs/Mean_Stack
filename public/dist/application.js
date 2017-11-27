'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

(function (app) {
  'use strict';

  app.registerModule('clientmanagements');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('inventorymanagements');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('clientmanagements', {
        abstract: true,
        url: '/clientmanagements',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('clientmanagements.list', {
        url: '/list',
        templateUrl: 'modules/clientmanagements/client/views/list-clientmanagements.client.view.html',
        controller: 'ClientmanagementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Clientmanagements List'
        }
      })
      .state('clientmanagements.create', {
        url: '/create',
        templateUrl: 'modules/clientmanagements/client/views/create-clientmanagement.client.view.html',
        controller: 'ClientmanagementsController',
        controllerAs: 'vm',
        resolve: {
          clientmanagementResolve: newClientmanagement
        },
        data: {
          pageTitle: 'Clientmanagements Create'
        }
      })
      .state('clientmanagements.edit', {
        url: '/:clientmanagementId/edit',
        templateUrl: 'modules/clientmanagements/client/views/edit-clientmanagement.client.view.html',
        controller: 'ClientmanagementsController',
        controllerAs: 'vm',
        resolve: {
          clientmanagementResolve: getClientmanagement
        },
        data: {
          pageTitle: 'Edit Clientmanagement {{ clientmanagementResolve.name }}'
        }
      })
      .state('clientmanagements.view', {
        url: '/:clientmanagementId',
        templateUrl: 'modules/clientmanagements/client/views/view-clientmanagement.client.view.html',
        controller: 'ClientmanagementsController',
        controllerAs: 'vm',
        resolve: {
          clientmanagementResolve: getClientmanagement
        },
        data: {
          pageTitle: 'Clientmanagement {{ clientmanagementResolve.name }}'
        }
      })
      .state('moveinventory', {
        url: '/moveitems',
        templateUrl: 'modules/clientmanagements/client/views/move-inv.client.view.html',
        controller: 'ClientInventorymanagementsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      });
  }

  getClientmanagement.$inject = ['$stateParams', 'ClientmanagementsService'];

  function getClientmanagement($stateParams, ClientmanagementsService) {
    return ClientmanagementsService.get({
      clientmanagementId: $stateParams.clientmanagementId
    }).$promise;
  }

  newClientmanagement.$inject = ['ClientmanagementsService'];

  function newClientmanagement(ClientmanagementsService) {
    return new ClientmanagementsService();
  }
}());

(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .controller('ClientInventorymanagementsListController', ClientInventorymanagementsListController);

  angular
    .module('inventorymanagements')
    .controller('ClientInventorymanagementsListController', ClientInventorymanagementsListController)
    .filter('emptyifblank', function () {
      return function (object, query) {
        if (!query)
          return {};
        else
          return object;
      };
    });

  ClientInventorymanagementsListController.$inject = ['ClientmanagementsService', 'InventorymanagementsService', '$scope', '$state', 'Authentication'];

  function ClientInventorymanagementsListController(ClientmanagementsService, InventorymanagementsService, $scope, $state, Authentication) {
    var vm = this;

    vm.clientmanagements = ClientmanagementsService.query();
    vm.inventorymanagements = InventorymanagementsService.query();
    $scope.$state = $state;
    $scope.authentication = Authentication;

    function toasty() {
      var x = document.getElementById('snackbar');
      x.className = 'show';
      setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
    }

    $scope.cancelButton = function () {
      if ('admin' === Authentication.user.roles[0]) {
        $state.go('mainmenuadmin');
      } else {
        $state.go('mainmenu');
      }
    };

    $scope.moveToClient = function () {
      if (!$scope.serial && !$scope.nameAndEmail) {
        alert('You must fill in a Client and UPC first');
      } else if (!$scope.serial) {
        alert('You must fill in a UPC first');
      } else if (!$scope.nameAndEmail) {
        alert('You must fill in a Client first');
      } else {
        var invResult = -1;
        for (var i = 0; i < vm.inventorymanagements.length; i++) {
          if (vm.inventorymanagements[i].upc === $scope.serial.upc) {
            invResult = i;
            break;
          }
        }
        if (vm.inventorymanagements[invResult].qty === 0) {
          // out of stock
          alert('This item is out of stock');
          return;
        }
        var clientInfo = $scope.nameAndEmail.split(' --- ');
        var clientResult = -1;
        for (i = 0; i < vm.clientmanagements.length; i++) {
          if (vm.clientmanagements[i].name === clientInfo[0] && vm.clientmanagements[i].email === clientInfo[1]) {
            clientResult = i;
            break;
          }
        }
        if (invResult === -1 && clientResult === -1) {
          alert('That Client and UPC don\'t exist');
        } else if (invResult === -1) {
          alert('That UPC doesn\'t exist');
        } else if (clientResult === -1) {
          alert('That Client doesn\'t exist');
        } else {
          // found an item with this upc and a client with the right name and email combo
          var alreadyHas = false;
          for (i = 0; i < vm.clientmanagements[clientResult].inventory.length; i++) {
            if (vm.clientmanagements[clientResult].inventory[i].upc === vm.inventorymanagements[invResult].upc) {
              // client already has this, increase by one
              vm.clientmanagements[clientResult].inventory[i].qty += 1;
              alreadyHas = true;
              break;
            }
          }
          if (!alreadyHas) {
            vm.clientmanagements[clientResult].inventory.push({
              tags: vm.inventorymanagements[invResult].tags,
              upc: vm.inventorymanagements[invResult].upc,
              qty: 1
            });
          }
          vm.inventorymanagements[invResult].qty -= 1;
          vm.clientmanagements[clientResult].$update(successCallback, errorCallback);
          vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
          // gimme that toast
          toasty();
          // clear upc field
          $scope.serial = null;
        }
      }
      function successCallback(res) {
        // toasty
        // console.log("success");
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    $scope.moveToInventory = function () {
      if (!$scope.serial && !$scope.nameAndEmail) {
        alert('You must fill in a Client and UPC first');
      } else if (!$scope.serial) {
        alert('You must fill in a UPC first');
      } else if (!$scope.nameAndEmail) {
        alert('You must fill in a Client first');
      } else {
        var clientInfo = $scope.nameAndEmail.split(' --- ');
        var clientResult = -1;
        for (var i = 0; i < vm.clientmanagements.length; i++) {
          if (vm.clientmanagements[i].name === clientInfo[0] && vm.clientmanagements[i].email === clientInfo[1]) {
            clientResult = i;
            break;
          }
        }
        var invResult = -1;
        for (i = 0; i < vm.inventorymanagements.length; i++) {
          if (vm.inventorymanagements[i].upc === $scope.serial.upc) {
            invResult = i;
            break;
          }
        }
        if (invResult === -1 && clientResult === -1) {
          alert('That Client and UPC don\'t exist');
        } else if (invResult === -1) {
          alert('That UPC doesn\'t exist');
        } else if (clientResult === -1) {
          alert('That Client doesn\'t exist');
        } else {
          // client and item exist, now check if client has that item
          var alreadyHas = false;
          for (i = 0; i < vm.clientmanagements[clientResult].inventory.length; i++) {
            if (vm.clientmanagements[clientResult].inventory[i].upc === vm.inventorymanagements[invResult].upc) {
              // client already has this, now decrement by 1 and check if item should be removed
              vm.clientmanagements[clientResult].inventory[i].qty -= 1;
              if (vm.clientmanagements[clientResult].inventory[i].qty === 0) {
                // remove this item from their inventory
                vm.clientmanagements[clientResult].inventory.splice(i, 1);
              }
              alreadyHas = true;
              break;
            }
          }
          if (!alreadyHas) {
            // client doesn't have this item, nothing to transfer
            alert('Client doesn\'t have this item');
            return;
          }
          vm.inventorymanagements[invResult].qty += 1;
          vm.clientmanagements[clientResult].$update(successCallback, errorCallback);
          vm.inventorymanagements[invResult].$update(successCallback, errorCallback);
          // get toasty
          toasty();
          // clear upc field
          $scope.serial = null;
        }
      }
      function successCallback(res) {
        // more toast
        // console.log("success");
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
}());

(function () {
  'use strict';

  // Clientmanagements controller
  angular
  .module('clientmanagements')
  .controller('ClientmanagementsController', ClientmanagementsController);

  ClientmanagementsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'clientmanagementResolve'];

  function ClientmanagementsController ($scope, $state, $window, Authentication, clientmanagement) {
    var vm = this;

    vm.authentication = Authentication;
    vm.clientmanagement = clientmanagement;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.changeStatus = changeStatus;
    vm.labelDisp = labelDisp;
    vm.labelText = labelText;
    vm.buttonColor = buttonColor;
    vm.buttonText = buttonText;
    vm.branchText = branchText;
    vm.displayClientRoles = displayClientRoles;//list of clientroles

    // Remove existing Clientmanagement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.clientmanagement.$remove()
        .then(function(){
          $state.go('clientmanagements.list');
        });

      }
    }

    // Save Clientmanagement
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clientmanagementForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.clientmanagement._id) {
        vm.clientmanagement.$update(successCallback, errorCallback);
      } else {
        vm.clientmanagement.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('clientmanagements.view', {
          clientmanagementId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function displayClientRoles() {
      var list = '';
      if(vm.clientmanagement.clientrolesFoster)
        list += 'Foster, ';
      if(vm.clientmanagement.clientrolesStaff)
        list += 'Staff, ';
      if(vm.clientmanagement.clientrolesSponsor)
        list += 'Sponsor, ';
      if(vm.clientmanagement.clientrolesVeteran)
        list += 'Veteran, ';
      if(vm.clientmanagement.clientrolesVolunteer)
        list += 'Volunteer, ';
      return list.slice(0,list.length-2);
    }

    //Save Foster Checkbox Values
    function changeStatusFoster() {
      vm.clientmanagement.clientrolesFoster = !vm.clientmanagement.clientrolesFoster;
      //vm.list = vm.list + "Foster, ";
      vm.clientmanagement.$update(vm.clientmanagement)
        .then(function () {
          $state.go('clientmanagements.view');
        });
    }//end func

    //Save Staff Checkbox Values
    function changeStatusStaff() {
      vm.clientmanagement.clientrolesStaff = !vm.clientmanagement.clientrolesStaff;
      vm.list += 'Staff, ';
      vm.clientmanagement.$update(vm.clientmanagement)
        .then(function () {
          $state.go('clientmanagements.view');
        });
    }//end func

    //Save Sponsor Checkbox Values
    function changeStatusSponsor() {
      vm.clientmanagement.clientrolesSponsor = !vm.clientmanagement.clientrolesSponsor;
      //vm.list += "Sponsor, ";
      vm.clientmanagement.$update(vm.clientmanagement)
        .then(function () {
          $state.go('clientmanagements.view');
        });
    }//end func

    //Save Veteran Checkbox Values
    function changeStatusVeteran() {
      vm.clientmanagement.clientrolesVeteran = !vm.clientmanagement.clientrolesVeteran;
      //vm.list += "Veteran, ";
      vm.clientmanagement.$update(vm.clientmanagement)
        .then(function () {
          $state.go('clientmanagements.view');
        });
    }//end func

    //Save Volunteer Checkbox Values
    function changeStatusVolunteer() {
      vm.clientmanagement.clientrolesVolunteer = !vm.clientmanagement.clientrolesVolunteer;
      //vm.list += "Volunteer, ";
      vm.clientmanagement.$update(vm.clientmanagement)
        .then(function () {
          $state.go('clientmanagements.view');
        });
    }//end func

    //Change Activity of Item
    function changeStatus() {
      if ($window.confirm('Are you sure you want to change this item\'s activity?')) {
        vm.clientmanagement.inactive = !vm.clientmanagement.inactive;
        vm.clientmanagement.$update(vm.clientmanagement)
          .then(function () {
            $state.go('clientmanagements.view');
          });
      }
    }

    //Display Inactive Label
    function labelDisp() {
      if (vm.clientmanagement.inactive) {
        return 'label label-warning';
      }
      else {
        return '';
      }
    }

    //Display Lable Text
    function labelText() {
      if (vm.clientmanagement.inactive) {
        return 'Inactive';
      }
      else {
        return '';
      }
    }

    //Change Activity Button Color
    function buttonColor() {
      if (vm.clientmanagement.inactive) {
        return 'btn btn-success';
      }
      else {
        return 'btn btn-warning';
      }
    }

    //Change Activity Button Text
    function buttonText() {
      if (vm.clientmanagement.inactive) {
        return 'Activate';
      }
      else {
        return 'Deactivate';
      }
    }
    function branchText(){
      var branch = '';
      if(vm.clientmanagement.airForce){
        branch += 'Air Force, ';
      }
      if(vm.clientmanagement.army){
        branch += 'Army, ';
      }
      if(vm.clientmanagement.coastGuard){
        branch += 'Coast Guard, ';
      }
      if(vm.clientmanagement.marines){
        branch += 'Marines, ';
      }
      if(vm.clientmanagement.nationalGuard){
        branch += 'National Guard, ';
      }
      if(vm.clientmanagement.navy){
        branch += 'Navy, ';
      }
      if(branch){
        branch = branch.substring(0, branch.length-2);
      }
      return branch;
    }
  }
}());

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

// Clientmanagements service used to communicate Clientmanagements REST endpoints
(function () {
  'use strict';

  angular
    .module('clientmanagements')
    .factory('ClientmanagementsService', ClientmanagementsService);

  ClientmanagementsService.$inject = ['$resource'];

  function ClientmanagementsService($resource) {
    return $resource('api/clientmanagements/:clientmanagementId', {
      clientmanagementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('mainmenu', {
      url: '/mainmenu',
      templateUrl: 'modules/core/client/views/mainmenu.client.view.html',
      data: {
        roles: ['user']
      }
    })
    .state('mainmenuadmin', {
      url: '/mainmenuadmin',
      templateUrl: 'modules/core/client/views/mainmenuadmin.client.view.html',
      data: {
        roles: ['admin']
      }
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Redirect to appropriate main menu
    $scope.goToMainMenu = function() {
      if ('admin' === Authentication.user.roles[0]) {
        $state.go('mainmenuadmin');
      } else {
        $state.go('mainmenu');
      }
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('inventorymanagements', {
        abstract: true,
        url: '/inventorymanagements',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin'],
        }
      })
      .state('inventorymanagements.list', {
        url: '',
        templateUrl: 'modules/inventorymanagements/client/views/list-inventorymanagements.client.view.html',
        controller: 'InventorymanagementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Inventory List'
        }
      })
      .state('inventorymanagements.receive', {
        url: '/receive',
        templateUrl: 'modules/inventorymanagements/client/views/receive-inventorymanagement.client.view.html',
        controller: 'InventorymanagementsReceiveController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Receive Inventory'
        }
      })
      .state('inventorymanagements.create', {
        url: '/create',
        templateUrl: 'modules/inventorymanagements/client/views/create-inventorymanagement.client.view.html',
        controller: 'InventorymanagementsController',
        controllerAs: 'vm',
        params: { 'upc': null, 'quantity': null },
        resolve: {
          inventorymanagementResolve: newInventorymanagement
        },
        data: {
          pageTitle: 'Inventory Create'
        }
      })
      .state('inventorymanagements.edit', {
        url: '/:inventorymanagementId/edit',
        templateUrl: 'modules/inventorymanagements/client/views/edit-inventorymanagement.client.view.html',
        controller: 'InventorymanagementsController',
        controllerAs: 'vm',
        resolve: {
          inventorymanagementResolve: getInventorymanagement
        },
        data: {
          pageTitle: 'Edit Inventory {{ inventorymanagementResolve.upc }}'
        }
      })
      .state('inventorymanagements.view', {
        url: '/:inventorymanagementId',
        templateUrl: 'modules/inventorymanagements/client/views/view-inventorymanagement.client.view.html',
        controller: 'InventorymanagementsController',
        controllerAs: 'vm',
        resolve: {
          inventorymanagementResolve: getInventorymanagement
        },
        data: {
          pageTitle: 'Inventory {{ inventorymanagementResolve.tags }}'
        }
      });
  }

  getInventorymanagement.$inject = ['$stateParams', 'InventorymanagementsService'];

  function getInventorymanagement($stateParams, InventorymanagementsService) {
    return InventorymanagementsService.get({
      inventorymanagementId: $stateParams.inventorymanagementId
    }).$promise;
  }

  newInventorymanagement.$inject = ['$stateParams', 'InventorymanagementsService'];

  function newInventorymanagement($stateParams, InventorymanagementsService) {
    return new InventorymanagementsService({
      'upc': $stateParams.upc,
      'qty': $stateParams.quantity
    });
  }
}());

(function () {
  'use strict';

  // Inventorymanagements controller
  angular
    .module('inventorymanagements')
    .controller('InventorymanagementsController', InventorymanagementsController);

  InventorymanagementsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'inventorymanagementResolve'];

  function InventorymanagementsController($scope, $state, $window, Authentication, inventorymanagement) {
    var vm = this;

    vm.authentication = Authentication;
    vm.inventorymanagement = inventorymanagement;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.changeStatus = changeStatus;
    vm.labelDisp = labelDisp;
    vm.labelText = labelText;
    vm.buttonColor = buttonColor;
    vm.buttonText = buttonText;

    // Remove existing Inventorymanagement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.inventorymanagement.$remove()//vm.inventorymanagement)
          .then(function () {
            $state.go('inventorymanagements.list');
          });
      }
    }

    // Save Inventorymanagement
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.inventorymanagementForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.inventorymanagement._id) {
        vm.inventorymanagement.$update(successCallback1, errorCallback);
      } else {
        vm.inventorymanagement.$save(successCallback2, errorCallback);
      }

      function successCallback1(res) {
        $state.go('inventorymanagements.view', {
          inventorymanagementId: res._id
        });
      }

      function successCallback2(res) {
        $state.go('inventorymanagements.list', {
          inventorymanagementId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //Change Activity of Item
    function changeStatus () {
      if ($window.confirm('Are you sure you want to change this item\'s activity?')) {
        vm.inventorymanagement.inactive = !vm.inventorymanagement.inactive;
        vm.inventorymanagement.$update(vm.inventorymanagement)
          .then(function () {
            $state.go('inventorymanagements.view');
          });
      }
    }

    //Display Inactive Label
    function labelDisp () {
      if (vm.inventorymanagement.inactive) {
        return 'label label-warning';
      }
      else {
        return '';
      }
    }

    //Display Lable Text
    function labelText () {
      if (vm.inventorymanagement.inactive) {
        return 'Inactive';
      }
      else {
        return '';
      }
    }

    //Change Activity Button Color
    function buttonColor () {
      if (vm.inventorymanagement.inactive) {
        return 'btn btn-success';
      }
      else {
        return 'btn btn-warning';
      }
    }

    //Change Activity Button Text
    function buttonText() {
      if (vm.inventorymanagement.inactive) {
        return 'Activate';
      }
      else {
        return 'Deactivate';
      }
    }

  }
}());

(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .controller('InventorymanagementsListController', InventorymanagementsListController);

  InventorymanagementsListController.$inject = ['InventorymanagementsService'];

  function InventorymanagementsListController(InventorymanagementsService) {
    var vm = this;

    vm.inventorymanagements = InventorymanagementsService.query();
    vm.headSort = 'tags';

    vm.showNoInactive = function (item) {
      return item.inactive === false;
    };
  }
}());

(function () {
  'use strict';

  angular
  .module('inventorymanagements')
  .controller('InventorymanagementsReceiveController', InventorymanagementsReceiveController);

  InventorymanagementsReceiveController.$inject = ['InventorymanagementsService', '$scope', '$state'];

  function InventorymanagementsReceiveController(InventorymanagementsService, $scope, $state) {
    var vm = this;
    $scope.state = $state;
    vm.inventorymanagements = InventorymanagementsService.query();
    $scope.choices = [{ id: 'choice1', upc: '', quantity: '' }];

    $scope.addNewChoice = function() {
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({ 'id':'choice'+newItemNo, upc: '', quantity: '' });
    };

    $scope.removeChoice = function() {
      var lastItem = $scope.choices.length-1;
      $scope.choices.splice(lastItem);
    };

    function toasty() {
      var x = document.getElementById('snackbar');
      x.className = 'show';
      setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
    }

    function isNonzeroInteger(str) {
      if (str !== 0 && !str) {
        return true;
      }
      var n = Math.floor(Number(str));
      // console.log(str + " vs " + n);
      return String(n) === String(str) && n > 0;
    }

    $scope.receive = function() {
      // search for UPC in DB. if there, add quantity. if not, send to create page.
      // initial check over array of choices for error
      for (var i = 0; i < $scope.choices.length; i++) {
        $scope.choices[i].invResult = -1;
        if (!$scope.choices[i].upc.upc && !$scope.choices[i].quantity) {
          alert('You must fill in Quantity and UPC first');
          return;
        } else if (!$scope.choices[i].upc.upc) {
          alert('You must fill in UPC first');
          return;
        } else if (!$scope.choices[i].quantity) {
          alert('You must fill in Quantity first');
          return;
        } else if (!isNonzeroInteger($scope.choices[i].quantity)) {
          alert('Quantity must be a nonzero integer');
          return;
        }
        // look for upc in database
        for (var j = 0; j < vm.inventorymanagements.length; j++) {
          if (vm.inventorymanagements[j].upc === $scope.choices[i].upc.upc) {
            $scope.choices[i].invResult = j;
            break;
          }
        }

        // if upc isn't in database, go to create view
        if($scope.choices[i].invResult === -1) {
          $state.go('inventorymanagements.create', {
            'upc': $scope.choices[i].upc.upc,
            'quantity': $scope.choices[i].quantity
          });
          return;
        }
      }

      //if no errors, receive inventory
      for (var i2 = 0; i2 < $scope.choices.length; i2++) {
        var quan = parseInt($scope.choices[i2].quantity);
        // reset quantity field
        $scope.choices[i2].quantity = null;
        // quantity update
        vm.inventorymanagements[$scope.choices[i2].invResult].qty += quan;
        //update DB
        vm.inventorymanagements[$scope.choices[i2].invResult].$update(successCallback, errorCallback);
      }

      function successCallback(res) {
        // toast
        toasty();
        // reload page
        $state.go('inventorymanagements.receive');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
}());

// Inventorymanagements service used to communicate Inventorymanagements REST endpoints
(function () {
  'use strict';

  angular
    .module('inventorymanagements')
    .factory('InventorymanagementsService', InventorymanagementsService);

  InventorymanagementsService.$inject = ['$resource'];

  function InventorymanagementsService($resource) {
    return $resource('api/inventorymanagements/:inventorymanagementId', {
      inventorymanagementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    .state('admin.users', {
      url: '/users',
      templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
      controller: 'UserListController'
    })
    .state('admin.user', {
      url: '/users/:userId',
      templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
      controller: 'UserController',
      resolve: {
        userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
          return Admin.get({
            userId: $stateParams.userId
          });
        }]
      }
    })
    .state('admin.user-edit', {
      url: '/users/:userId/edit',
      templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
      controller: 'UserController',
      resolve: {
        userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
          return Admin.get({
            userId: $stateParams.userId
          });
        }]
      }
    })
    .state('user-create', {
      url: '/users/create',
      templateUrl: 'modules/users/client/views/admin/create-user.client.view.html',
      controller: 'AuthenticationController'
    });
  }
  ]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      // .state('authentication.signup', {
      //   url: '/signup',
      //   templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      // })
      .state('authentication.signin', {
        url: '',
        templateUrl: 'modules/core/client/views/home.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:userId',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    $scope.headSort = 'username';
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 1000;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

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

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', 'Users',
  function ($scope, $state, Authentication, userResolve, Users) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

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

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    //if ($scope.authentication.user) {
    //  $location.path('/');
    //}

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        //$scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go('admin.users');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        if ('admin' === Authentication.user.roles[0]) {
          $state.go('mainmenuadmin');
        } else {
          $state.go('mainmenu');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    //if ($scope.authentication.user) {
    //  $location.path('/');
    //}

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/changePassword/' + $stateParams.userId).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with at least 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
