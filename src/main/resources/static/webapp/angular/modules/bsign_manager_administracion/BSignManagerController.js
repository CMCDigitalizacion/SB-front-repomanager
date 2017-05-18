angular.module('O2DigitalSite').controller('BSignController', ['$scope', '$http', '$state', '$stateParams', '$compile', '$log', '$rootScope', 'bsignRESTServices', 'bsignServices', '$uibModal', 'DefaultTSA', 'domainRESTServices', 'tokenManager',
 function($scope, $http, $state, $stateParams, $compile, $log, $rootScope, bsignRESTServices, bsignServices, $uibModal, DefaultTSA, domainRESTServices, tokenManager){

 	$log.log('the configurationid is: ' + $stateParams.id);
 	$rootScope.$broadcast('rootChange', 'Administración / Configuración bSign');
 	$scope.userChanges       = true;
    $scope.defTsa            = {};
    $scope.defTsa.checked    = false;
    $scope.disableDefaultTsa = false;
    $scope.idLabelDefault    = '';
    var configurationTsa     = {};

 	$scope.loadBSignData = function () {

	    bsignRESTServices.getBSignData(tokenManager.getDomainId()).then(
	    	function (responseSuccess) {
                if(responseSuccess.data.conf.configurationTsa.tsaPruebas === 'true') responseSuccess.data.conf.configurationTsa.tsaPruebas = true;
                else responseSuccess.data.conf.configurationTsa.tsaPruebas = false;

                if(responseSuccess.data.conf.configurationTsa.tsaURL === DefaultTSA.url && responseSuccess.data.conf.configurationTsa.tsaUser === DefaultTSA.username) $scope.defTsa.checked = true;
                else $scope.defTsa.checked = false;

                if(responseSuccess.data.conf.configurationTsa.tsaPruebas === true) {
                    $scope.disableDefaultTsa = true;
                    $scope.idLabelDefault    = 'light-gray-color';
                }

                configurationTsa = angular.copy(responseSuccess.data.conf.configurationTsa);
                $scope.conf = responseSuccess.data.conf;
				$rootScope.$broadcast('callSuccess', 'Cargado');
	    		$scope.isLoaded = true;
	    	},
	    	function (responseError) {
	    		$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: loadBSignData)');
	    	}
	    )
 	}

    $scope.saveBioSignConfiguration = function (configuration) {
        $log.log(configuration)
        if(configuration.configurationTsa.tsaPruebas == null) configuration.configurationTsa.tsaPruebas = false;
        bsignRESTServices.saveConfiguration(tokenManager.getDomainId(), configuration).then(
            function  (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'Guardado');
                configurationTsa = angular.copy($scope.conf.configurationTsa);
            },
            function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveNewOp)');
            }
        )
    }

    $scope.changePruebasTsa = function(pruebasTsa) {
        if(pruebasTsa){
            $scope.defTsa.checked            = false;
            $scope.disableDefaultTsa             = true;
            $scope.idLabelDefault    = 'light-gray-color';
            $scope.conf.configurationTsa.tsaURL  = '';
            $scope.conf.configurationTsa.tsaUser = '';
            $scope.conf.configurationTsa.tsaPass = '';
        } else {
            $scope.disableDefaultTsa             = false;
            $scope.idLabelDefault    = '';
        }
    }

    $scope.setDefaultTsa = function(disableTsa) {
        if(disableTsa){
            $scope.conf.configurationTsa.tsaURL  = DefaultTSA.url;
            $scope.conf.configurationTsa.tsaUser = DefaultTSA.username;
            $scope.conf.configurationTsa.tsaPass = '';
        } else {
            $scope.conf.configurationTsa.tsaURL  = '';
            $scope.conf.configurationTsa.tsaUser = '';
            $scope.conf.configurationTsa.tsaPass = '';
        }
    }

    $scope.testTsaData = function(conf) {
        var domainCertificates = {}
        domainCertificates.tsaURL = conf.configurationTsa.tsaURL;
        domainCertificates.tsaUsername = conf.configurationTsa.tsaUser;
        domainCertificates.tsaPassword = conf.configurationTsa.tsaPass;
        domainRESTServices.testTSAConf(domainCertificates, tokenManager.getDomainId()).then(function (responseSuccess) {
            $rootScope.$broadcast('callSuccess', 'La configuración TSA es correcta.');
        }).catch(function (responseError) {
			logger.error(e.getStackTrace());
            $rootScope.$broadcast('callError', responseError.data.failure);
        })
    }



 }]);