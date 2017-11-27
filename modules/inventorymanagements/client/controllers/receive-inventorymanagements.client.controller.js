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
    $scope.choices = [{ id: 'choice1', upc: {}, quantity: '' }];

    var _scannerIsRunning = false;
    var scanThis = 0;

    function startScanner() {
      Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#scanner-container'),
          constraints: {
            width: 480,
            height: 320,
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
            showCanvas: false,
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

        // Set flag to is running
        _scannerIsRunning = true;
      });

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

      Quagga.onDetected(function (result) {
        console.log('Barcode detected and processed : [' + result.codeResult.code + ']', result);
        $scope.choices[scanThis].upc.upc = result.codeResult.code;
        console.log($scope.choices[scanThis].upc.upc);
        $state.go('inventorymanagements.receive');
      });
    }

    //Start/stop scanner
    document.getElementById('btn').addEventListener('click', function () {
      if (_scannerIsRunning) {
        Quagga.stop();
      } else {
        startScanner();
      }
    }, false);

    $scope.addNewChoice = function() {
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({ 'id':'choice'+newItemNo, upc: {}, quantity: '' });
      scanThis++;
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
