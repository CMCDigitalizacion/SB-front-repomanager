angular.module('O2DigitalSite').directive('eventAccordion', function() {
  return {
    restrict: 'E',
    scope: {
       info: "=",
       index: "@",
       color: "="
    },
    templateUrl: 'webapp/angular/modules/operation_details/event-accordion.html',
/*    controller: ['$scope', '$window', '$http', function($scope, $window, $http) {
      $http ({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        url: 'http:localhost:8080/listaeventos.json',
      }).success(function(data, status, headers, config) {
        $scope.listaeventos = data;
      }).error(function(data, status, headers, config) {
        console.log("Estado HTTP: " + status);
      });
    }],
    controllerAs: 'accordion', */
  };
});

angular.module('O2DigitalSite').directive('notificationAccordion', function() {
  return {
    restrict: 'E',
    scope: {
      info: "=",
      index: "@",
      color: "="
    },
    templateUrl: 'webapp/angular/modules/operation_details/notification-accordion.html',
  };
});

angular.module('O2DigitalSite').directive('documentAccordion', function() {
  return {
    restrict: 'E',
    scope: {
      info: "=",
      index: "@",
      color: "="
    },
    templateUrl: 'webapp/angular/modules/operation_details/document-accordion.html',
  };
});

angular.module('O2DigitalSite').directive('documentUploadedAccordion', function() {
  return {
    restrict: 'E',
    scope: {
      info: "=",
      index: "@",
      color: "="
    },
    templateUrl: 'webapp/angular/modules/operation_details/document-uploaded-accordion.html',
  };
});
