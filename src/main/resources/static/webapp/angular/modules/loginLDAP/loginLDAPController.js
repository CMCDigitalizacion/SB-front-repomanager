angular.module('O2DigitalSite').controller('LoginLDAPController', function($rootScope, $scope, $http, $location, $state, tokenManager, Idle, $timeout){
	sessionStorage.clear();
	sessionStorage.setItem('ldap', 1);
	$state.$current.name = 'login';
	Idle.unwatch();
	$scope.showVersionNumber = false;
	$scope.versionNumber = ""

	$rootScope.$broadcast('endSession');
	$rootScope.$broadcast('removeNotificationHandler');

	$scope.loadVersionnumber = function() {
		$http({
		  method: 'GET',
		  url: 'services/repository/version',
		}).then(function(successResponse) {
		    $scope.showVersionNumber = true;
		    $scope.versionNumber = successResponse.data.version;
		}).catch(function(errorResponse) {

		});
	}
	
	$scope.login = function(user){
		var usertoLogin = {};
		$scope.errorLogin = false;
		$scope.userLocked = false;
		$scope.userWithoutPermission = false;
		$scope.domainWithoutLDAP = false;
		$scope.userNotPresentInGroup = false;
		usertoLogin.username = user.username;
		var pwdHashed = CryptoJS.SHA256(""+user.userpassword);
		var pwdHashedB64= pwdHashed.toString(CryptoJS.enc.Base64); 
		usertoLogin.userpassword = pwdHashedB64;
		usertoLogin.domainName = user.domain;
		$http({
		  method: 'POST',
		  url: 'services/repository/loginldap',
		  data: JSON.stringify(usertoLogin)
		}).then(function successCallback(response) {
			tokenManager.setToken(response.data.token);
			$scope.errorLogin = false;
			
			$timeout(function(){
				$scope.$emit('loginSuccess', tokenManager.getDomainId());
				$state.go('dashboardfunnel',{ id : tokenManager.getDomainId() });	
			}, 200);
		    
		    Idle.watch();
		  }, function errorCallback(response) {
			  	if(response.status === 403 && (response.data.failure.indexOf("locked") !== -1)) 
		  			$scope.userLocked = true;
		  		else if (response.status === 403 && (response.data.failure.indexOf("permission") !== -1)) 
		  			$scope.userWithoutPermission = true;
				else if (response.status === 403 && (response.data.failure.indexOf("LDAP integration") !== -1)) 
		  			$scope.domainWithoutLDAP = true;
				else if(response.status === 403 && (response.data.failure.indexOf("group") !== -1)){
					$scope.userNotPresentInGroup = true;
				}
		  		else $scope.errorLogin = true;

		  });
	}
});