angular.module('O2DigitalSite').controller('OperationLotesController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$timeout', '$uibModal', 'sweet', 'BatchesService', 'tokenManager',
 function($scope, $rootScope, $http, $state, $stateParams, $timeout, $uibModal, sweet, BatchesService, tokenManager){

 	console.log('In the operationLotesController, the domain\' s id received is: '+ $stateParams.id);
 	$rootScope.$broadcast('rootChange', 'Solicitar Firma / Lote')
 	
	$scope.isValidFile       = false;
	$scope.isValidCancelFile = false;
 	$scope.isLoaded          = false;
 	$scope.isLoadedCancel    = false;
	var files                = [];
	var filesToCancel        = [];

	$scope.uploadedCancelFile = function(element) {
		
		if(angular.isDefined(element.files[0])){
			
			filesToCancel = [];
			filesToCancel.push(element.files[0]);

			var formData = new FormData();
			formData.append('file', element.files[0]);

			BatchesService.getInfoCancelFile(formData).then(function(responseSuccess) {
				console.log(responseSuccess.data)
				$scope.isLoadedCancel    = true;
				$scope.isValidCancelFile = true;
				$scope.infoCancel        = responseSuccess.data;
				$rootScope.$broadcast('callSuccess', 'El fichero ' + files[0].name + ' es un fichero valido.')
			}).catch(function(responseError) {
				console.log(responseError.data)
				$scope.isLoadedCancel       = true;
				$scope.isValidCancelFile    = true;
				$rootScope.$broadcast('callError', 'El fichero ' + files[0].name + ' NO es un fichero valido.')
			})
		}
	}

	$scope.deleteOperations = function() {
		var formData = new FormData();
		formData.append('file', filesToCancel[0]);

		BatchesService.cancelOperations(formData).then(function(responseSuccess) {
			console.log(responseSuccess.data);
			$rootScope.$broadcast('callSuccess', 'Las operaciones se han borrado correctamente.')
		}).catch(function(responseError) {
			console.log(responseError.data);
				$rootScope.$broadcast('callError', response.data.failure)
		})
	}

	$scope.uploadedFileLote = function(element) {

		if(angular.isDefined(element.files[0])){
			
			files = [];
			files.push(element.files[0]);

			var formData = new FormData();
			formData.append('file', element.files[0]);

			BatchesService.getInfoBatchFile(formData).then(function(responseSuccess) {
				console.log(responseSuccess.data)
				$scope.isLoaded    = true;
				$scope.isValidFile = true;
				$scope.info        = responseSuccess.data;
				$rootScope.$broadcast('callSuccess', 'El fichero ' + files[0].name + ' es un fichero valido.')
			}).catch(function(responseError) {
				console.log(responseError.data)
				$scope.isLoaded    = false;
				$scope.isValidFile = false;
				$rootScope.$broadcast('callError', 'El fichero ' + files[0].name + ' NO es un fichero valido.')
			})
		}
	}

	$scope.createOperations = function() {

		var formData = new FormData();
		formData.append('file', files[0]);

		BatchesService.createOperations(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), formData).then(function(responseSuccess) {
			console.log(responseSuccess.data)
		}).catch(function(responseError) {
			console.log(responseError.data)
		})
	}
 }]);