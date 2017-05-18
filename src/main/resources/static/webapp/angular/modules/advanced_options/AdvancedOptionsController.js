angular
  .module('O2DigitalSite')
  .controller('AdvancedOptionsController', AdvancedOptionsController);

  function AdvancedOptionsController($scope, $rootScope, $uibModal, tokenManager, $state, $timeout, advanced_REST_Services) {

	$rootScope.$broadcast('rootChange', 'Administración / Opciones Avanzadas');
	  
  	$scope.isLoaded = false;

  	$scope.loadAdvancedOptions = function() {
  		advanced_REST_Services.getAdvancedOptions(tokenManager.getDomainId()).then(function(responseSuccess) {
  			$scope.advanced = responseSuccess.data;
  			$scope.isLoaded = true;
  		}).catch(function(responseError) {
  			
  		})
  	}

  	$scope.saveAdvancedConfiguration = function(advancedData) {

  		var advancedOptionsToSave = angular.copy(advancedData);

  		advanced_REST_Services.saveAdvancedOptions(tokenManager.getDomainId(), advancedOptionsToSave).then(function(responseSuccess) {
  			 $scope.advanced = responseSuccess.data;
  		}).catch(function(responseError) {
  			
  		})
  	}

  	$scope.restoreDefault = function() {
  		advanced_REST_Services.restoreDefault(tokenManager.getDomainId()).then(function(responseSuccess) {
  			 $scope.advanced = responseSuccess.data;
  		}).catch(function(responseError) {
  			
  		})
  	}
  }