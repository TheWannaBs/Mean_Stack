(function () {
    'use strict';

    describe('Client Inventory Controller Tests', function () {
        // Initialize global variables
        var ClientInventoryController,
            $scope,
            $httpBackend,
            $state,
            Authentication,
            ClientmanagementsService,
            InventorymanagementsService,
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
        beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ClientmanagementsService_, _InventorymanagementsService_) {
            // Set a new global scope
            $scope = $rootScope.$new();

            // Point global variables to injected services
            $httpBackend = _$httpBackend_;
            $state = _$state_;
            Authentication = _Authentication_;
            ClientmanagementsService = _ClientmanagementsService_;
            InventorymanagementsService = _InventorymanagementsService_;

            /* create mock Clientmanagement
            mockClientmanagement = new ClientmanagementsService({
                _id: '525a8422f6d0f87f0e407a33',
                name: 'Clientmanagement Name'
                
            });

            // create mock inventorymanagement
            mockInventorymanagement = new InventorymanagementsService({
                _id: '525a8422f6d0f87f0e407a34',
                name: 'client-test',
            });
            */

            // Mock logged in user
            Authentication.user = {
                roles: ['user']
            };

            // Initialize the Clientmanagements controller.
            ClientInventoryController = $controller('ClientInventorymanagementsListController as vm', {
                $scope: $scope,
                clientmanagementResolve: {}
            });

            // Spy on state go
            spyOn($state, 'go');
        }));

        describe('press the cancel button', function () {
            it('should redirect to main menu if user', function () {
                // Test URL redirection after the cancel button was pressed
                $scope.cancelButton();
                expect($state.go).toHaveBeenCalledWith('mainmenu');
            });

            it('should redirect to adminmainmenu if admin', function () {
                Authentication.user = {
                    roles: ['admin']
                };
                // Test URL redirection after the cancel button was pressed
                $scope.cancelButton();
                expect($state.go).toHaveBeenCalledWith('mainmenuadmin');
            });
        });
    });
}()); 