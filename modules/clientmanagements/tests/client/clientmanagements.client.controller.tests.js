(function () {
  'use strict';

  describe('Clientmanagements Controller Tests', function () {
    // Initialize global variables
    var ClientmanagementsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ClientmanagementsService,
      mockClientmanagement;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ClientmanagementsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ClientmanagementsService = _ClientmanagementsService_;

      // create mock Clientmanagement
      mockClientmanagement = new ClientmanagementsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Clientmanagement Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Clientmanagements controller.
      ClientmanagementsController = $controller('ClientmanagementsController as vm', {
        $scope: $scope,
        clientmanagementResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleClientmanagementPostData;

      beforeEach(function () {
        // Create a sample Clientmanagement object
        sampleClientmanagementPostData = new ClientmanagementsService({
          name: 'Clientmanagement Name'
        });

        $scope.vm.clientmanagement = sampleClientmanagementPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ClientmanagementsService) {
        // Set POST response
        $httpBackend.expectPOST('api/clientmanagements', sampleClientmanagementPostData).respond(mockClientmanagement);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Clientmanagement was created
        expect($state.go).toHaveBeenCalledWith('clientmanagements.view', {
          clientmanagementId: mockClientmanagement._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/clientmanagements', sampleClientmanagementPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Clientmanagement in $scope
        $scope.vm.clientmanagement = mockClientmanagement;
      });

      it('should update a valid Clientmanagement', inject(function (ClientmanagementsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/clientmanagements\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('clientmanagements.view', {
          clientmanagementId: mockClientmanagement._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ClientmanagementsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/clientmanagements\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Clientmanagements
        $scope.vm.clientmanagement = mockClientmanagement;
      });

      it('should delete the Clientmanagement and redirect to Clientmanagements', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/clientmanagements\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('clientmanagements.list');
      });

      it('should should not delete the Clientmanagement and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
