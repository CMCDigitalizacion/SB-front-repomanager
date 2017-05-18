angular
	.module('O2DigitalSite')
	.service('tokenManager', tokenManager)


	function tokenManager ($log, $window, $injector, $q, $rootScope) {
		var token,
			sessionData,
			retrievingToken;

		if(angular.isUndefined(token)) setTokenAtStartup();

		this.setToken = function (tokenValue) {
			sessionStorage.token = tokenValue;
			token = tokenValue;
			var base64Url = token.split('.')[1];
        	var base64 = base64Url.replace('-', '+').replace('_', '/');
        	var claims = JSON.parse($window.atob(base64));
        	sessionData = JSON.parse(claims.sessionData);
        	refreshDomainData();
		}

		this.getSessionData = function () {
			if(angular.isDefined(token)) return sessionData;
		}

		this.getBSignId = function () {
			if(angular.isDefined(token)) return sessionData.bSignId;
			else $log.warn('No token founded, it means that you cannot get the biosign is.' );
		}

		this.getUserRole = function () {
			if(angular.isDefined(token)) return sessionData.role;
			else $log.warn('No token founded, it means that you cannot get the user role.' );
		}

		this.getDomainId = function() {
			if(angular.isDefined(token)) return sessionData.domainid;
			else $log.warn('No token founded, it means that you cannot get the domainid.' );
		}
		
		this.getUserId = function() {
			if(angular.isDefined(token)) return sessionData.userId;
			else $log.warn('No token founded, it means that you cannot get the domainid.' );
		}

		this.getUserName = function() {
			if(angular.isDefined(token)) return sessionData.username;
			else $log.warn('No token founded, it means that you cannot get the domainid.' );
		}

		this.getDomainName = function() {
			if(angular.isDefined(token)) return sessionData.domainName;
			else $log.warn('No token founded, it means that you cannot get the domain\'s name.' );
		}

		this.getUserIdFromToken = function () {
			if(angular.isDefined(token)){
				return sessionData.userid;
			} else $log.warn('No token founded, it means that you cannot request a new valid token.' )
		}

		this.getToken = function () {
			if(checkTokenExist()){
				return token;
			} else $log.warn('No token founded in sessionStorage, it means that you are not allowed to call O2DigitalSign\'s services. Your calls will be rejected.' )
		}

		this.refreshToken = function (deferredValue, res) {

			var $http = $injector.get('$http');
			$http({
	      		method: 'GET',
	      		url: 'services/repository/refresh/'+sessionData.userid
        	}).then(
            	function successCallback(response) {
                    if(angular.isUndefined(response.data)) $log.warn(response.data)
                    var tokenValue = response.data;

                    token = tokenValue;
					sessionStorage.setItem('token', tokenValue);
					var base64Url = token.split('.')[1];
		        	var base64 = base64Url.replace('-', '+').replace('_', '/');
		        	var claims = JSON.parse($window.atob(base64));
		        	sessionData = JSON.parse(claims.sessionData);
		        	refreshDomainData();

		        	$rootScope.$broadcast('tokenRefreshed');

                    $injector.get('$http')(res.config).then(
                        function (responseSuccess) {
                            deferredValue.resolve(responseSuccess);
                    },
                        function (responseError) {
                            deferredValue.reject(responseError);
                    })
              },
				function errorCallback(response) {
					$log.error('Somenthing on the refresh token process has been wrong.')
              });

		}

		this.checkIfTokenExist = function () {
			if (sessionStorage.token) {
				token = sessionStorage.token
				var base64Url = token.split('.')[1];
            	var base64 = base64Url.replace('-', '+').replace('_', '/');
            	var claims = JSON.parse($window.atob(base64));
            	sessionData = JSON.parse(claims.sessionData);
            	refreshDomainData();
				return true;
			} else return false;
		}

		this.removeToken = function () {
			
			var $http = $injector.get('$http');
			$http({
      		method: 'GET',
      		url: 'services/repository/invalidate/'+sessionData.userid
        	}).then(
            	function successCallback(response) {
 
            		sessionStorage.clear();
              },
				function errorCallback(response) {
					$log.error('Somenthing on the refresh token process has been wrong.')
              });
			
		}

		this.refreshDomain = function() {
			refreshDomainData();
		}

		function refreshDomainData() {
			if(angular.isDefined(sessionStorage.domainSaved)){
				var domainSaved             = JSON.parse(sessionStorage.domainSaved);

				sessionData.domainName      = domainSaved.domainName;
				sessionData.domainid        = domainSaved.domainid;
				sessionData.availableFunct1 = domainSaved.availableFunct1;
				sessionData.availableFunct2 = domainSaved.availableFunct2;
				sessionData.availableFunct3 = domainSaved.availableFunct3;
				sessionData.availableFunct4 = domainSaved.availableFunct4;

			}
		}

		function checkTokenExist () {
			if(sessionStorage.token) return true;
			else return false;
		}

		function setTokenAtStartup () {
			if (sessionStorage.token) {
				token = sessionStorage.token
				var base64Url = token.split('.')[1];
            	var base64 = base64Url.replace('-', '+').replace('_', '/');
            	var claims = JSON.parse($window.atob(base64));
            	sessionData = JSON.parse(claims.sessionData);
            	refreshDomainData();
				return true;
			}
			else return false;
		}

		function isStillValid () {
			if (sessionStorage.token) {
				token = sessionStorage.token
				var base64Url = token.split('.')[1];
            	var base64 = base64Url.replace('-', '+').replace('_', '/');
            	var claims = JSON.parse($window.atob(base64));
            	var secondFromEpoc = new Date() / 1000;
            	if (claims.exp - secondFromEpoc > 0) return true;
            	else return false;
			}
			else return false;
		}
	}
