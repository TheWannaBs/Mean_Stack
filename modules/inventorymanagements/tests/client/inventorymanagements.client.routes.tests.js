(function () {
  'use strict';

  describe('Inventorymanagements Route Tests', function () {
    // Initialize global variables
    var $scope,
      InventorymanagementsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InventorymanagementsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InventorymanagementsService = _InventorymanagementsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('inventorymanagements');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/inventorymanagements');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          InventorymanagementsController,
          mockInventorymanagement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('inventorymanagements.view');
          $templateCache.put('modules/inventorymanagements/client/views/view-inventorymanagement.client.view.html', '');

          // create mock Inventorymanagement
          mockInventorymanagement = new InventorymanagementsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inventorymanagement Name'
          });

          // Initialize Controller
          InventorymanagementsController = $controller('InventorymanagementsController as vm', {
            $scope: $scope,
            inventorymanagementResolve: mockInventorymanagement
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:inventorymanagementId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.inventorymanagementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            inventorymanagementId: 1
          })).toEqual('/inventorymanagements/1');
        }));

        it('should attach an Inventorymanagement to the controller scope', function () {
          expect($scope.vm.inventorymanagement._id).toBe(mockInventorymanagement._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/inventorymanagements/client/views/view-inventorymanagement.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InventorymanagementsController,
          mockInventorymanagement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('inventorymanagements.create');
          $templateCache.put('modules/inventorymanagements/client/views/create-inventorymanagement.client.view.html', '');

          // create mock Inventorymanagement
          mockInventorymanagement = new InventorymanagementsService();

          // Initialize Controller
          InventorymanagementsController = $controller('InventorymanagementsController as vm', {
            $scope: $scope,
            inventorymanagementResolve: mockInventorymanagement
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.inventorymanagementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/inventorymanagements/create');
        }));

        it('should attach an Inventorymanagement to the controller scope', function () {
          expect($scope.vm.inventorymanagement._id).toBe(mockInventorymanagement._id);
          expect($scope.vm.inventorymanagement._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/inventorymanagements/client/views/create-inventorymanagement.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InventorymanagementsController,
          mockInventorymanagement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('inventorymanagements.edit');
          $templateCache.put('modules/inventorymanagements/client/views/edit-inventorymanagement.client.view.html', '');

          // create mock Inventorymanagement
          mockInventorymanagement = new InventorymanagementsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inventorymanagement Name'
          });

          // Initialize Controller
          InventorymanagementsController = $controller('InventorymanagementsController as vm', {
            $scope: $scope,
            inventorymanagementResolve: mockInventorymanagement
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:inventorymanagementId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.inventorymanagementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            inventorymanagementId: 1
          })).toEqual('/inventorymanagements/1/edit');
        }));

        it('should attach an Inventorymanagement to the controller scope', function () {
          expect($scope.vm.inventorymanagement._id).toBe(mockInventorymanagement._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/inventorymanagements/client/views/edit-inventorymanagement.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
