(function () {
  'use strict';

  angular
  .module('inventorymanagements')
  .controller('InventorymanagementsReceiveController', InventorymanagementsReceiveController);

  InventorymanagementsReceiveController.$inject = ['InventorymanagementsService', 'userlogResolve', 'Authentication', '$scope', '$state', '$window'];

  function InventorymanagementsReceiveController(InventorymanagementsService, userlog, Authentication, $scope, $state, $window) {
    //var a = document.getElementById('link-id'); //or grab it by tagname etc
    //a.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    var vm = this;
    $scope.state = $state;
    vm.inventorymanagements = InventorymanagementsService.query();
    vm.userlog = userlog;
    $scope.choices = [{ id: '1', upc: {}, quantity: '' }];  //array of items to be receieved
    var _scannerIsRunning = false;
    var scanThis = null;
    var scanArmed = [false];

    startScanner();

    //Displays toast message
    function toasty() {
      var x = document.getElementById('snackbar');
      x.className = 'show';
      setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
    }

    //Displays toast message
    function toasty1() {
      var x = document.getElementById('snackbar1');
      x.className = 'show';
      setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
    }

    //on-click for start/stop scanner button
    function startScanner() {
      Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          constraints: {
            width: 1920,
            height: 1080,
            facingMode: 'environment'
          },
        },
        decoder: {
          readers: [
            'code_128_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_reader',
            'upc_e_reader',
            'i2of5_reader'
          ],
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true
            }
          }
        },

      }, function (err) {
        if (err) {
          console.log(err);
          return;
        }

        console.log('Initialization finished. Ready to start');
        Quagga.start();

        // Set flag to "is running"
        _scannerIsRunning = true;
      });

      //When barcode is processed. draws rectangle around barcode
      //TODO: fix the drawing below camera issue
      Quagga.onProcessed(function (result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
            result.boxes.filter(function (box) {
              return box !== result.box;
            }).forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
            });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
          }
        }
      });

      //When barcode is detected. Puts barcode code into upc box
      Quagga.onDetected(function (result) {
        console.log('Barcode detected and processed : [' + result.codeResult.code + ']', result);
        $scope.choices[scanThis].upc.upc = result.codeResult.code;
        console.log($scope.choices[scanThis].upc.upc);
        toasty1();
        $state.go('inventorymanagements.receive');
        scanArmed[scanThis] = false;
        scanThis = null;
      });
    }

    //Start/stop scanner
    //TODO: check the restart functionality
    /*document.getElementById('btn').addEventListener('click', function () {
      if (_scannerIsRunning) {
        Quagga.stop();
        _scannerIsRunning = false;
      } else {
        startScanner();
      }
      console.log(_scannerIsRunning);
    }, false);*/

    //on-click for scan select btn
    $scope.scanSelect = function(btnID1) {
      scanThis = parseInt(btnID1)-1;
      for (var i3 = 0; i3 < scanArmed.length; i3++) {
        scanArmed[i3] = false;
      }
      scanArmed[scanThis] = true;
    };

    //controls color of scan select btns
    $scope.buttonColor = function(btnID) {
      if (!scanArmed[btnID-1]) {
        return 'btn btn-primary';
      }
      else {
        return 'btn btn-success';
      }
    };

    //Adds new item to be scanned
    $scope.addNewChoice = function() {
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({ 'id': newItemNo, upc: {}, quantity: '' });
    };

    //Removes item to be scanned
    $scope.removeChoice = function(btnID2) {
      $scope.choices.splice(btnID2-1, 1);
      var tmp = 1;
      for (var i4 = 0; i4 < $scope.choices.length; i4++) {
        $scope.choices[i4].id = tmp;
        tmp++;
      }
    };

    //Checks if str is non-zero int
    function isNonzeroInteger(str) {
      if (str !== 0 && !str) {
        return true;
      }
      var n = Math.floor(Number(str));
      // console.log(str + " vs " + n);
      return String(n) === String(str) && n > 0;
    }

    //on-click method for receieve button
    $scope.receive = function() {
      // search for UPC in DB. if there, add quantity. if not, send to create page.
      // initial check over array of choices for error
      var i2 = 0;
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
          if (confirm(('UPC '+$scope.choices[i].upc.upc+' does not exist. Would you like to create it?'))) {
            $state.go('inventorymanagements.create', {
              'upc': $scope.choices[i].upc.upc,
              'quantity': $scope.choices[i].quantity
            });
          } else {
            return;
          }
          return;
        }
      }

      //if no errors, receive inventory
      for (i2 = 0; i2 < $scope.choices.length; i2++) {
        var quan = parseInt($scope.choices[i2].quantity);
        // reset quantity field
        $scope.choices[i2].quantity = null;
        // quantity update
        vm.inventorymanagements[$scope.choices[i2].invResult].qty += quan;
        //update DB
        vm.inventorymanagements[$scope.choices[i2].invResult].$update(successCallback, errorCallback);
        //save log
        $scope.saveUserLog($scope.choices[i2].invResult, quan);
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

    $scope.cancel = function () {
      $state.go('inventorymanagements.list');
      $window.location.reload();
    };

    //should save
    $scope.saveUserLog = function (i, q) {
      var item = vm.inventorymanagements[i];

      //create new user log with receve data
      vm.userlog.username = Authentication.user.username;
      console.log(vm.userlog.username);
      vm.userlog.clientName = 'RECIEVE';
      vm.userlog.itemTags = vm.inventorymanagements[i].tags;
      vm.userlog.itemUpc = vm.inventorymanagements[i].upc;
      vm.userlog.direction = '->';//'\u00A9'
      vm.userlog.qty_moved = q;
      //save this log to the database
      vm.userlog.$save();
    };
  }
}());
