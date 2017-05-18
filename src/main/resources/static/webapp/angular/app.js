/**
 *
 */
/*global angular */

angular.module('O2DigitalSite', ['angularTreeview', 'cfp.loadingBar', 'ui.router', 'datatables', 'ui.bootstrap', 'ui.tinymce', 'ngAnimate', 'hSweetAlert', 'highcharts-ng', 'ngIdle', 'angular-confirm', 'cfp.hotkeys', 'angular-cron-jobs', 'angular-growl', 'ngAnimate', 'angular.filter', 'colorpicker.module', 'angular-notification-icons', 'jsonFormatter', 'datatables.buttons'])

.constant('DefaultTSA', {
    url      : 'http://tss.accv.es:8318/tsaup',
    username : 'galeonsw'
})

.constant('CognitiveServices', {
    'key': 'f3ee9f35da3a43e088c2128b95d7bac8', // key for congnitive services
    'detectURL': 'https://api.projectoxford.ai/face/v1.0/detect?', // url for detect face in congnitive services
    'verifyURL': 'https://api.projectoxford.ai/face/v1.0/verify?' // url for verify face in congnitive services
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider){


    $stateProvider
        .state('login',{
            url: '/login',
            templateUrl:'webapp/login.html',
            params : { isLogin: true },
        })
        .state('loginldap',{
            url: '/loginldap',
            templateUrl:'webapp/loginldap.html',
            params : { isLogin: true },
        })
        .state('welcome',{
            url: '/welcome',
            controller: 'WelcomeController',
            templateUrl:'webapp/welcome.html'
        })
        .state('super_state',{
            url: '/managecompanies',
            controller: 'SuperController as super',
            templateUrl:'webapp/managecompanies.html'
        })
        .state('manage_operation',{
            url: '/operationtype/:id',
            controller:'OperationTypeManagerController',
            templateUrl:'webapp/operationManager.html'
    	})
    	.state('manage_domain',{
            url: '/domain',
            controller:'AllDomainManagerController',
            templateUrl:'webapp/alldomainManager.html'
    	})
        .state('domain_with_id',{
            url: '/domain/:id',
            params : { openOperations: false },
            controller:'DomainManagerController',
            templateUrl:'webapp/domainManager.html'
        })
        .state('operationsListOf_domain_with_id',{
            url         : '/operationslist/:id',
            params      : { fromNotification : false, idOperation : '', message : ''},
            controller  :'OperationsListController',
            templateUrl :'webapp/operationsList.html'
        })
        .state('operationDetail',{
            url: '/operationdetail/:id',
            controller:'ModalDetail',
            templateUrl:'webapp/operationDetail.html'
        })
        .state('newop_operationTypeList',{
            url: '/operationtypelist/:id',
            controller:'OperationTypeListController',
            templateUrl:'webapp/operationTypeList.html'
        })
        .state('new_biometric_operation',{
            url: '/biometricoperation/:id',
            controller:'BiometricOperationController',
            templateUrl:'webapp/biometricOperation.html'
        })
        .state('list_biometric_operation',{
            url: '/listbiometricoperation/:id',
            controller:'ListBiometricOperationController',
            templateUrl:'webapp/listBiometricOperation.html'
        })
       .state('newop_operationLote',{
            url: '/operationlote/:id',
            controller:'OperationLotesController',
            templateUrl:'webapp/operationLote.html'
        })
        .state('dashboardop',{
            url: '/dashboardop/:id',
            controller:'ResumenOpChartController',
            templateUrl:'webapp/ang/dashboard1.html'
        })
         .state('dashboardnotif',{
            url: '/dashboardnotif/:id',
            controller:'ResumenNotifChartController',
            templateUrl:'webapp/ang/dashboardnotif1.html'
        })
         .state('dashboardfunnel',{
            url: '/dashboardfunnel/:id',
            controller:'FunnelOpChartController',
            templateUrl:'webapp/ang/funnelop1.html'
        })
        .state('bsign_configuration',{
            url: '/bsign/:id',
            controller:'BSignController',
            templateUrl:'webapp/bsignManager.html'
        })
        .state('lotesListOf_domain',{
            url: '/loteslist/:id',
            controller:'LotesListController',
            templateUrl:'webapp/lotesList.html'
        })
        .state('videoTable', {
            url: '/pendientesdevalidacion',
            templateUrl: 'webapp/videoTable.html'
        })
        .state('checkVideo', {
            url: '/revisionVideo',
            templateUrl: 'webapp/checkVideo.html'
        })
        .state('viewVideo', {
            url: '/viewVideo',
            templateUrl: 'webapp/viewVideo.html'
        })
        .state('videoConferenceTable', {
            url: '/videoConferenciasPendientes',
            templateUrl: 'webapp/videoConferenceTable.html'
        })
        .state('videoConference', {
            url: '/videoConferencias',
            templateUrl: 'webapp/videoConference.html'
        })
        .state('videoConferenceAttended', {
            url: '/videoConferenciaAtender',
            templateUrl: 'webapp/videoConferenceAttended.html'
        })
        .state('viewVideoConference', {
            url: '/viewVideoConference',
            params: { openVideoDetails : ''},
            templateUrl: 'webapp/viewVideoConference.html'
        })
        .state('witness_configuration', {
            url: '/witness/:idDomain',
            controller:'WitnessConfigurationController',
            templateUrl: 'webapp/witnessConfiguration.html'
        })
        .state('new_batch_operation',{
            url: '/operation/lote/:id',
            controller:'OperationLotesController',
            templateUrl:'webapp/operationLote.html'
        })
        .state('operationsListGroupedOf_domain_with_id',{
            url: '/operationslistgrouped/:id',
            controller:'OperationsListGroupedController',
            templateUrl:'webapp/operationsListGrouped.html'
        })
        .state('advanced_options',{
            url: '/avanzadas/:id',
            controller:'AdvancedOptionsController',
            templateUrl:'webapp/advancedOptions.html'
        })
        .state('digicertList',{
            url: '/digicertList',
            templateUrl:'webapp/angular/modules/digicertList/templates/digicertList.html',
            controller: 'DigicertListController'
        })
        .state('listCategory',{
	 		url: '/listCategory',
            templateUrl:'webapp/angular/modules/detailsOperation/templates/detailsOperation.html',
            controller: 'ListCategoryController'
        })
        .state('categoryDetails',{
	 		url: '/categoryDetails',
	 		templateUrl:'webapp/angular/modules/categoryDetails/templates/categoryDetails.html',
	 		controller: 'CategoryDetailsController'
        })
        .state('detailsOperationByCategory',{
	 		url: '/detailsOperationByCategory',
	 		templateUrl:'webapp/angular/modules/categoryDetails/templates/modalViewImage.html',
	 		controller: 'CategoryDetailsController'
		})
        .state('ldapconfiguration',{
	 		url: '/ldap/:id',
	 		templateUrl:'webapp/ldapConfiguration.html',
	 		controller: 'LdapConfigurationController'
		});

        // $locationProvider.html5Mode(true);
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('interceptor');
  $httpProvider.interceptors.push('tokenExpiredinterceptor');
  $httpProvider.interceptors.push('tokenNotExistinterceptor');
  $httpProvider.interceptors.push('skipAuthForHTML');
})
.config(function(IdleProvider, KeepaliveProvider) {
    // configure Idle settings
    IdleProvider.idle(900); // in seconds 900
    IdleProvider.timeout(60); // in seconds 60
    //KeepaliveProvider.interval(2); // in seconds
})
.run(function($confirmModalDefaults) {
	  $confirmModalDefaults.windowClass = 'dialogPass';
	  $confirmModalDefaults.defaultLabels.title = 'Confirmar';
	  $confirmModalDefaults.defaultLabels.ok = 'Si';
	  $confirmModalDefaults.defaultLabels.cancel = 'No';
});

angular.module('O2DigitalSite').factory('skipAuthForHTML', function(){

    return {

        request: function(config) {
            if(config.url.indexOf("html") > -1) delete config.Authorization;
            return config;
        }
    }
});

angular.module('O2DigitalSite').factory('tokenNotExistinterceptor', function($q, $injector, cfpLoadingBar){

    return {

        responseError: function(res) {

            if(res.status === 403){
                cfpLoadingBar.complete();
                $('#modal-fullscreen').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            	$injector.get('$rootScope').$broadcast('endSession');
                if(!angular.isUndefinedOrNull(sessionStorage.getItem('ldap'))){
                    $injector.get('$state').go('loginldap');    
                } else {
                    $injector.get('$state').go('login');
                }
                return $q.reject(res);
            } else return $q.reject(res);
        }
      }
});

angular.module('O2DigitalSite').factory('tokenExpiredinterceptor', function($q, $injector, $window, tokenManager){

    return {

        responseError: function(res) {

            if(res.status === 401){
                var deferred = $q.defer();

                tokenManager.refreshToken(deferred, res);

                return deferred.promise;
            } else
                return $q.reject(res);
        }
      }
});

angular.module('O2DigitalSite').factory('interceptor', function(cfpLoadingBar, $q, $injector, tokenManager){

    var callStack = [];

	return {
	    request: function(config) {
            if(config.url.indexOf("html") === -1 ){
                if(tokenManager.checkIfTokenExist())
                    config.headers.Authorization = "Bearer " + tokenManager.getToken();

                callStack.push({callPath : config.url});
                cfpLoadingBar.start();
                $('.modal-fullscreen').modal('show');
                $('.modal-fullscreen').css('background-color','WhiteSmoke')//Linen Gainsboro MintCream OldLace WhiteSmoke
                $('.modal-fullscreen').css('opacity','0.6');
                $('#body').removeClass('modal-open');
            }

	    	return config;
	    },

	    requestError: function(config) {
            cfpLoadingBar.start();
			$('.modal-fullscreen').modal('show');
	    	return $q.reject(res);
	    },

	    response: function(res) {
	    	//to force dialog to close
            if(res.config.url.indexOf("html") === -1){
                callStack.pop();
                if(callStack.length === 0){
                    cfpLoadingBar.complete();
                    $('#modal-fullscreen').modal('hide');
                    $('body').removeClass('modal-open');
                    $('body').css('padding-right', '');
                    $('.modal-backdrop').remove();
                }
            }
	    	return res;
	    },

	    responseError: function(res) {
	    	//to force dialog to close
            if(res.config.url.indexOf("html") === -1){
                callStack.pop();
                if(callStack.length === 0){
                    cfpLoadingBar.complete();
                    $('#modal-fullscreen').modal('hide');
                    $('body').removeClass('modal-open');
                    $('body').css('padding-right', '');                    
                    $('.modal-backdrop').remove();
                }
            }
	      	return $q.reject(res);
	    }
	  }
});

angular.module('O2DigitalSite').run(['DTDefaultOptions', function(DTDefaultOptions) {
   // DTDefaultOptions.setLanguageSource('webapp/spanishtables/spanish.json');
    DTDefaultOptions.setLanguageSource('services/repository/table/lang/spanish');
    $.fn.dataTable.moment( 'll' );
    $.fn.dataTable.moment( 'DD/MM/YYYY' );
    $.fn.dataTable.moment( 'DD/MM/YYYY HH:mm:ss' );
    $.fn.dataTable.moment( 'DD-MM-YYYY HH:mm:ss' );
}]);

angular.module('O2DigitalSite').run(['$state', function($state){
    $state.go('login');

}])

angular.module('O2DigitalSite').run(function($rootScope, $uibModalStack, $state, operationFilterServiceManager, $location) {

    angular.isUndefinedOrNull = function(val) {
        return angular.isUndefined(val) || val === null
    }

    angular.isNull = function(val) {
        return angular.isUndefined(val) || val === null
    }

    var url = $location.$$absUrl.split('#/')[0];
    $rootScope.url = url;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $uibModalStack.dismissAll();

        //Check if token exists and the state is different from the login state
        if(!sessionStorage.token && toState.name !== 'login' && toState.name !== 'loginldap') location = $rootScope.url;

//        if(!sessionStorage.filterStateEID)
//            videoFilterServiceManager.saveDefaultFilter();

        if(!sessionStorage.filterStateOperation)
            operationFilterServiceManager.saveDefaultFilter();
    });

});

angular.module('O2DigitalSite').config(['$provide', function ($provide) {
    $provide.decorator('$q', ['$delegate', function ($delegate) {
        var $q = $delegate;

        $q.allSettled = $q.allSettled || function allSettled(promises) {
            // Implementation of allSettled function from Kris Kowal's Q:
            // https://github.com/kriskowal/q/wiki/API-Reference#promiseallsettled

            var wrapped = angular.isArray(promises) ? [] : {};

            angular.forEach(promises, function(promise, key) {
                if (!wrapped.hasOwnProperty(key)) {
                    wrapped[key] = wrap(promise);
                }
            });

            return $q.all(wrapped);

            function wrap(promise) {
                return $q.when(promise)
                    .then(function (value) {
                        return { state: 'fulfilled', value: value };
                    }, function (reason) {
                        return { state: 'rejected', reason: reason };
                    });
            }
        };

        return $q;
    }]);
}]);



angular.module('O2DigitalSite').config(['growlProvider', function (growlProvider) {
  growlProvider.globalTimeToLive(10000);
  growlProvider.onlyUniqueMessages(true);
}]);
