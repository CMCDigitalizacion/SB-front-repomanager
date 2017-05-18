angular.module('O2DigitalSite').controller('MainController', ['$scope', '$http', '$state', '$stateParams', 'tokenManager', '$uibModal', '$rootScope', 'Idle', '$location',
    function ($scope, $http, $state, $stateParams, tokenManager, $uibModal, $rootScope, Idle, $location) {
        console.log('Loading the MAIN controller');
        var sessionExpiringModalInstance;
        var isCalled = false;
        var a = 0;
        $scope.seconds;

        $scope.setClearChache = "?" + new Date().getTime();

        $scope.$on('changeStyle', function (event, domain) {
            $scope.setClearChache = "?" + new Date().getTime();
            $scope.cssURL = 'services/logos/css/' + tokenManager.getDomainId() + '' + $scope.setClearChache;
        });

        $scope.loginSuccess = false;
        if (sessionStorage.token) {
            $scope.domainID = tokenManager.getDomainId();
            $scope.loginSuccess = true;
            $scope.setClearChache = "?" + new Date().getTime();
            $scope.cssURL = 'services/logos/css/' + $scope.domainID + '' + $scope.setClearChache;
        } else {
            if (!angular.isUndefinedOrNull(sessionStorage.getItem('ldap')))
                $state.go('loginldap');
            else
                $state.go('login');
        }

        $scope.$on('loginSuccess', function (event, domain) {
            $scope.domainID = domain;
            $scope.loginSuccess = true;
            $scope.setClearChache = "?" + new Date().getTime();
            $scope.cssURL = 'services/logos/css/' + $scope.domainID + '' + $scope.setClearChache;
        });

        $scope.$on('endSession', function () {
            $scope.loginSuccess = false;
        });

        $scope.$on('IdleStart', function () {
            // the user appears to have gone idle
            console.log('IdleStart');
            sessionExpiringModalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                size: 'sm',
                controller: 'ModalInstanceCtrl',
                templateUrl: 'sessionExpiring.html',
                windowClass: 'dialogGeneral'
            });
        });

        $scope.$on('IdleWarn', function (e, countdown) {
            // follows after the IdleStart event, but includes a countdown until the user is considered timed out
            // the countdown arg is the number of seconds remaining until then.
            // you can change the title or display a warning dialog from here.
            // you can let them resume their session by calling Idle.watch()
            // console.log('IdleWarn');
            $('#timeoutingSession').empty();
            $('#timeoutingSession').html('Tu sesion caducará en ' + countdown);
            $scope.seconds = countdown;

        });

        $scope.$on('IdleTimeout', function () {
            // the user has timed out (meaning idleDuration + timeout has passed without any activity)
            // this is where you'd log them
            // console.log('IdleTimeout');
            $scope.$emit('endSession');
            if (!angular.isUndefinedOrNull(sessionStorage.getItem('ldap')))
                $state.go('loginldap');
            else
                $state.go('login');
            isCalled = false;
        });

        $scope.$on('IdleEnd', function () {
            // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
            // console.log('IdleEnd')
            sessionExpiringModalInstance.close('active');
            sessionExpiringModalInstance = undefined;
            isCalled = false;
        });

        $rootScope.attendingVideoconference = false;
    }]);

angular.module('O2DigitalSite').controller('ModalInstanceCtrl', function ($scope) {

});