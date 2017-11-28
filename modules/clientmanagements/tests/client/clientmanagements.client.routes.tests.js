(function () {
  'use strict';

  describe('Clientmanagements Route Tests', function () {
    // Initialize global variables
    var $scope,
      ClientmanagementsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ClientmanagementsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ClientmanagementsService = _ClientmanagementsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('clientmanagements');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/clientmanagements');
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
          ClientmanagementsController,
          mockClientmanagement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('clientmanagements.view');
          $templateCache.put('modules/clientmanagements/client/views/view-clientmanagement.client.view.html', '');

          // create mock Clientmanagement
          mockClientmanagement = new ClientmanagementsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Clientmanagement Name'
          });

          // Initialize Controller
          ClientmanagementsController = $controller('ClientmanagementsController as vm', {
            $scope: $scope,
            clientmanagementResolve: mockClientmanagement
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:clientmanagementId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.clientmanagementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            clientmanagementId: 1
          })).toEqual('/clientmanagements/1');
        }));

        it('should attach an Clientmanagement to the controller scope', function () {
          expect($scope.vm.clientmanagement._id).toBe(mockClientmanagement._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/clientmanagements/client/views/view-clientmanagement.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ClientmanagementsController,
          mockClientmanagement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('clientmanagements.create');
          $templateCache.put('modules/clientmanagements/client/views/create-clientmanagement.client.view.html', '');

          // create mock Clientmanagement
          mockClientmanagement = new ClientmanagementsService();

          // Initialize Controller
          ClientmanagementsController = $controller('ClientmanagementsController as vm', {
            $scope: $scope,
            clientmanagementResolve: mockClientmanagement
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.clientmanagementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/clientmanagements/create');
        }));

        it('should attach an Clientmanagement to the controller scope', function () {
          expect($scope.vm.clientmanagement._id).toBe(mockClientmanagement._id);
          expect($scope.vm.clientmanagement._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/clientmanagements/client/views/create-clientmanagement.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ClientmanagementsController,
          mockClientmanagement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('clientmanagements.edit');
          $templateCache.put('modules/clientmanagements/client/views/edit-clientmanagement.client.view.html', '');

          // create mock Clientmanagement
          mockClientmanagement = new ClientmanagementsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Clientmanagement Name'
          });

          // Initialize Controller
          ClientmanagementsController = $controller('ClientmanagementsController as vm', {
            $scope: $scope,
            clientmanagementResolve: mockClientmanagement
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:clientmanagementId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.clientmanagementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            clientmanagementId: 1
          })).toEqual('/clientmanagements/1/edit');
        }));

        it('should attach an Clientmanagement to the controller scope', function () {
          expect($scope.vm.clientmanagement._id).toBe(mockClientmanagement._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/clientmanagements/client/views/edit-clientmanagement.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
