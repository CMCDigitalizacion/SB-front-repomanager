    app.factory('domains', ['$http', function($http, $rootScope) {
        return $http.get($rootScope.url + 'services/dashboard/listdomains')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
    }]);
