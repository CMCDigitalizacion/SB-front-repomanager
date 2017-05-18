angular.module('O2DigitalSite').controller('ModalDetail', ['$scope', '$window','$http', '$stateParams', 'operationServiceCallerESign', 'tokenManager', function($scope, $window, $http, $stateParams, operationServiceCallerESign, tokenManager){

  var operationID = tokenManager.getDomainId();
  var uuid;

  $('.bs-example-modal-lg').modal('show');
  $scope.openWindow = function() {
    $window.open('http://146.148.117.127:8080/FirmaDoc/readContentServlet?uuid=' + uuid.actauuid, '_blank');
  };

  $scope.prova = function (info) {
    console.log('prova')
  }

  $scope.loadDetailsOperation = function () {

      operationServiceCallerESign.getOperationByID(tokenManager.getDomainId()).then(
        function (responseSuccess) {
          console.log('SUCCESS', responseSuccess.data);
          $scope.operationdata = responseSuccess.data;
          $scope.listEvents = responseSuccess.data.events;
          // $scope.listNotifications = responseSuccess.data.
          $scope.listDocuments = responseSuccess.data.documents;
          $scope.isLoaded = true;
        },
        function (responseError) {
          console.log('ERROR: ', responseError.data);
        }
      )
  }

  // $http ({
  //   method: 'GET',
  //   url: 'http:localhost:8080/dacontrato.json',

  // }).success(function(data, status, headers, config) {
  //   $scope.datas = data;
  // }).error(function(data, status, headers, config) {
  //   console.log("Estado HTTP: " + status);
  // });

  // $http ({
  //   method: 'GET',
  //   url: 'http:localhost:8080/dadatauuid.json',
  // }).success(function(data, status, headers, config) {
  //   uuid = $scope.datauuid = data;
  // }).error(function(data, status, headers, config) {
  //   console.log("Estado HTTP: " + status);
  // });
}]);

// angular.module('O2DigitalSite').controller('InfoEvent', ['$scope', '$window', '$http', function($scope, $window, $http) {
//   $scope.colorHeader = "#AAAAAA";
//   $http ({
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//     },
//     url: 'http:localhost:8080/listaeventos.json',
//   }).success(function(data, status, headers, config) {
//     $scope.listEvents = data;
//   }).error(function(data, status, headers, config) {
//     console.log("Estado HTTP: " + status);
//   });
// }]);

// angular.module('O2DigitalSite').controller('InfoNotification', ['$scope', '$http', function($scope, $http) {
//   $scope.colorHeader="#FA5858";
//   $http ({
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//     },
//     url: 'http:localhost:8080/listanotificaciones.json',
//   }).success(function(data, status, headers, config) {
//     $scope.listNotifications = data;
//   }).error(function(data, status, headers, config) {
//     console.log("Estado HTTP: " + status);
//   });
// }]);

// angular.module('O2DigitalSite').controller('InfoDocument', ['$scope', '$http', function($scope, $http) {
//   $scope.colorHeader="#2ECCFA";
//   $http ({
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//     },
//     url: 'http:localhost:8080/listadocumentos.json',
//   }).success(function(data, status, headers, config) {
//     $scope.listDocuments = data;
//   }).error(function(data, status, headers, config) {
//     console.log("Estado HTTP: " + status);
//   });
// }]);
