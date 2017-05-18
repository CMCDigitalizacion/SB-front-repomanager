angular.module('O2DigitalSite').controller('LoginController', function($rootScope, $scope, $http, $location, $state, tokenManager, Idle, $timeout){
	sessionStorage.clear();
	$state.$current.name = 'login';
	Idle.unwatch();
	$scope.showVersionNumber = false;
	$scope.versionNumber = ""

	$rootScope.$broadcast('endSession');
	$rootScope.$broadcast('closeSSEs');

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
		usertoLogin.username = user.username;
		var pwdHashed = CryptoJS.SHA256(""+user.userpassword);
		var pwdHashedB64= pwdHashed.toString(CryptoJS.enc.Base64); 
		usertoLogin.userpassword = pwdHashedB64;
		$http({
		  method: 'POST',
		  url: 'services/repository/login',
		  data: JSON.stringify(usertoLogin)
		}).then(function successCallback(response) {
			tokenManager.setToken(response.data);
			$scope.errorLogin = false;
			
			$timeout(function(){
				$scope.$emit('loginSuccess', tokenManager.getDomainId());
				$state.go('dashboardfunnel',{ id : tokenManager.getDomainId() });	
			}, 200);
		    
		    Idle.watch();
		  }, function errorCallback(response) {
			  	if(response.status === 403 && response.data.failure.contains("locked")) 
		  			$scope.userLocked = true;
		  		else if (response.status === 403 && response.data.failure.contains("permission")) 
		  			$scope.userWithoutPermission = true;
		  		else $scope.errorLogin = true;
		  });
	}
});