(function () {
  'use strict';

  describe('Inventorymanagements List Controller Tests', function () {
    // Initialize global variables
    var InventorymanagementsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      InventorymanagementsService,
      mockInventorymanagement;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _InventorymanagementsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      InventorymanagementsService = _InventorymanagementsService_;

      // create mock article
      mockInventorymanagement = new InventorymanagementsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Inventorymanagement Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Inventorymanagements List controller.
      InventorymanagementsListController = $controller('InventorymanagementsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockInventorymanagementList;

      beforeEach(function () {
        mockInventorymanagementList = [mockInventorymanagement, mockInventorymanagement];
      });

      it('should send a GET request and return all Inventorymanagements', inject(function (InventorymanagementsService) {
        // Set POST response
        $httpBackend.expectGET('api/inventorymanagements').respond(mockInventorymanagementList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.inventorymanagements.length).toEqual(2);
        expect($scope.vm.inventorymanagements[0]).toEqual(mockInventorymanagement);
        expect($scope.vm.inventorymanagements[1]).toEqual(mockInventorymanagement);

      }));
    });
  });
}());
