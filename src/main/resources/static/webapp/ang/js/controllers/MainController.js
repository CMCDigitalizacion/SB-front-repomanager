angular.module('O2DigitalSite').controller('MainController', ['$scope', '$rootScope','$window', 'domains', function($scope, $rootScope, $window, domains) {
    domains.success(function(data) {
       // alert(data);
        $scope.domains = data;
    });
}]);