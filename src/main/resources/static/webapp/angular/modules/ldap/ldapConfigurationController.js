angular.module('O2DigitalSite').controller('LdapConfigurationController', function ($rootScope, $scope, $http, $location, $state, tokenManager, $timeout, ldapServices, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, $uibModal) {
    console.log('In the LdapConfigurationController');
    console.log('the id of the domain is: ' + $stateParams.id);

    $rootScope.$broadcast('rootChange', 'Administración / Configuración LDAP');

    $scope.hasBeenChecked = false;

    $scope.dtOptionsLDAP = DTOptionsBuilder.newOptions()
        .withPaginationType('simple_numbers')
        .withDisplayLength(10)
        .withOption('columnDefs', [{ 'targets': [0, 4], sortable: false }])
        .withOption('order', [[1, "desc"]]);
    $scope.dtColumnDefsLDAP = [
        DTColumnDefBuilder.newColumnDef(0).withClass('center-text'),
        DTColumnDefBuilder.newColumnDef(1).withClass('center-text'),
        DTColumnDefBuilder.newColumnDef(2).withClass('center-text'),
        DTColumnDefBuilder.newColumnDef(3).withClass('center-text'),
        DTColumnDefBuilder.newColumnDef(4).notSortable()
    ];

    $scope.loadLDAPConfiguration = function () {
        ldapServices.getLDAPConfigurations(tokenManager.getDomainId()).then((responseSuccess) => {
            $scope.ldapConfigurations = responseSuccess.data;
            $scope.isLoaded = true;
            $rootScope.$broadcast('callSuccess', 'Configuración de LDAP cargada correctamente.');
        }).catch((responseError) => {
            $rootScope.$broadcast('callError', responseError.data.failure);

        })
    }

    $scope.saveLDAPCombinations = function () {
        var arrayLDAPUuid = [];
        angular.forEach($scope.ldapConfigurations, function (ldap, index) {
            if (ldap.used) {
                arrayLDAPUuid.push(ldap.ldapuuid);
            }
        });

        ldapServices.saveCombinations(arrayLDAPUuid, tokenManager.getDomainId()).then((responseSuccess) => {
            $scope.ldapConfigurations = responseSuccess.data;
            $rootScope.$broadcast('callSuccess', 'Combinación guardada correctamente.');
            $scope.hasBeenChecked = false;

        }).catch((responseError) => {
            $rootScope.$broadcast('callError', responseError.data.failure);
        })
    }

    $scope.select = function () {
        $scope.hasBeenChecked = true;
    }

    $scope.deleteLDapConfiguration = function (ldap) {
        ldapServices.deleteLDAP(ldap, tokenManager.getDomainId()).then((responseSuccess) => {
            $scope.ldapConfigurations = responseSuccess.data;
            $rootScope.$broadcast('callSuccess', 'Configuración de LDAP eliminada correctamente.');
        }).catch((responseError) => {
            $rootScope.$broadcast('callError', responseError.data.failure);
        })
    }

    $scope.editLDapConfiguration = function (ldapConf) {
        var modalShowLDAPConf = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'ldapConfigurationModal.html',
            controller: 'LdapConfigurationModalController',
            windowClass: 'dialogGeneral',
            resolve: {
                ldap: function () {
                    return angular.copy(ldapConf);
                }
            }
        });

        modalShowLDAPConf.result.then((response) => {
            console.log(response);
            $scope.ldapConfigurations = response;
        }).catch((modalDismissed) => {
            console.log('modal dismissed;')
        })
    }
});

angular.module('O2DigitalSite').controller('LdapConfigurationModalController',
    function ($scope, $uibModalInstance, $http, $rootScope, tokenManager, ldapServices, ldap) {

        $scope.isNew = angular.isUndefined(ldap);
        $scope.ldap = ldap;

        $scope.saveLDAPConfiguration = function (ldap) {

            if (!$scope.isNew) {
                ldapServices.updateLdapConfiguration(ldap, tokenManager.getDomainId()).then((responseSuccess) => {
                    console.log(responseSuccess.data);
                    $uibModalInstance.close(responseSuccess.data);
                }).catch((responseError) => {
                    $rootScope.$broadcast('callError', responseError.data.failure);
                    $uibModalInstance.dismiss();
                })
            } else {
                ldapServices.saveLdapConfiguration(ldap, tokenManager.getDomainId()).then((responseSuccess) => {
                    console.log(responseSuccess.data);
                    $uibModalInstance.close(responseSuccess.data);
                }).catch((responseError) => {
                    $rootScope.$broadcast('callError', responseError.data.failure);
                    $uibModalInstance.dismiss();
                })
            }

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        }

    });