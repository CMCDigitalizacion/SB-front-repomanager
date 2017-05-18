/**
 *
 */
/*global angular */

angular.module('O2BioSigner', ['cfp.loadingBar', 'ui.router', 'datatables', 'ui.bootstrap', 'ui.tinymce', 'ngAnimate', 'hSweetAlert', 'ngIdle', 'angular-confirm', 'cfp.hotkeys', 'ngWebSocket'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){

        $stateProvider
        .state('sign',{
            url: '/sign/:userId/:idOperation',
            templateUrl:'sign.html',
            controller: 'SignController'
        });

;
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('interceptor');
  // $httpProvider.interceptors.push('tokenExpiredinterceptor');
  // $httpProvider.interceptors.push('tokenNotExistinterceptor');
  // $httpProvider.interceptors.push('skipAuthForHTML');
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

// angular.module('O2DigitalSite').factory('skipAuthForHTML', function(){

//     return {

//         request: function(config) {
//             if(config.url.indexOf("html") > -1) delete config.Authorization;
//             return config;
//         }
//     }
// });

// angular.module('O2DigitalSite').factory('tokenNotExistinterceptor', function($q, $injector){

//     return {

//         responseError: function(res) {

//             if(res.status === 403){
//             	$injector.get('$rootScope').$broadcast('endSession');
//                 $injector.get('$state').go('login');
//                 return $q.reject(res);
//             } else return $q.reject(res);
//         }
//       }
// });

// angular.module('O2DigitalSite').factory('tokenExpiredinterceptor', function($q, $injector, $window, tokenManager){

//     return {

//         responseError: function(res) {

//             if(res.status === 401){
//                 var deferred = $q.defer();

//                 tokenManager.refreshToken(deferred, res);

//                 return deferred.promise;
//             } else
//                 return $q.reject(res);
//         }
//       }
// });

angular.module('O2BioSigner').factory('interceptor', function(cfpLoadingBar, $q, $injector /*, tokenManager*/){

    var callStack = [];

	return {
	    request: function(config) {
            if(config.url.indexOf("html") === -1 ){
                // if(tokenManager.checkIfTokenExist())
                //     config.headers.Authorization = "Bearer " + tokenManager.getToken()
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
                    $('.modal-backdrop').remove();
                }
            }
	      	return $q.reject(res);
	    }
	  }
});

angular.module('O2BioSigner').run(['DTDefaultOptions', function(DTDefaultOptions) {
   // DTDefaultOptions.setLanguageSource('webapp/spanishtables/spanish.json');
    DTDefaultOptions.setLanguageSource('services/repository/table/lang/spanish');
    $.fn.dataTable.moment( 'll' );
    $.fn.dataTable.moment( 'DD/MM/YYYY' );
    $.fn.dataTable.moment( 'DD/MM/YYYY HH:mm:ss' );
}]);

angular.module('O2BioSigner').run(['$state', function($state){
    $state.go('sign', { userId : 1, idOperation: '20160512154334'});
}])

// angular.module('O2DigitalSite').run(function($rootScope, $uibModalStack, $state) {
//     $rootScope.$on('$stateChangeStart', function (event, toState) {
//         $uibModalStack.dismissAll();
//         if(!sessionStorage.token) location = "/HAGCLI_VIDEOID_BCE";
//     });

// });

angular.module('O2BioSigner').config(['$provide', function ($provide) {
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
