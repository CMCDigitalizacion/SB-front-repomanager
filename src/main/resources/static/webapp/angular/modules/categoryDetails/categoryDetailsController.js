angular
	.module('O2DigitalSite')
	.controller('CategoryDetailsController', CategoryDetailsController);

function CategoryDetailsController($scope, $http, $state, tokenManager, $uibModal, $rootScope, $filter, digicertListServices, $stateParams) {
	
	
	$scope.domainId = tokenManager.getDomainId();
	$scope.uuid = $stateParams.uuid;
	$scope.userId = tokenManager.getUserIdFromToken(); 
	
	var dataobject = {
		usuarioid : tokenManager.getUserIdFromToken(),
		domainId : tokenManager.getDomainId()
	}

	$scope.impuestosList = [];
	$scope.operation = digicertListServices.getOperation();
	$scope.category = digicertListServices.getOperation();
	
	$scope.operations = digicertListServices.getAllOperations();
	

	$scope.initDetailsCategory = function(operations) {
		digicertListServices.getDetailsCategory(dataobject).then(
			function(responseSucess) {
				$scope.resultado = responseSucess.data
			},
			function(responseError) {
				console.log('error');
			}
		);
		$state.go('categoryDetails');
	}

	$scope.myFunctionCategory = function(operations) {
		digicertListServices.getDocumentsListCategory(dataobject, operations.nombre).then(
			function(responseSuccess) {
				$scope.category = responseSuccess.data
			},
			function(responseError) {
				console.log('error');
			}
		);
	}

	$scope.goToDocumentCategory = function(uuid) {
		var modalInstance = $uibModal.open({
			animation : true,
			size : 'lg',
			templateUrl : 'webapp/angular/modules/categoryDetails/templates/modalViewPDFCategory.html',
			controller : 'modalViewPDFCategoryController',
				resolve: {
			        uuid: function () {
			            return uuid;
			          }
			        }
			});
		}
	

	$scope.goToDetailsCategory = function(documentosCategoria) {
		digicertListServices.setOperation(documentosCategoria);
		$state.go('detailsOperationByCategory',{uuid: documentosCategoria.uuid});
	}

	$scope.goToListCategory = function(operations) {
		$state.go('categoryDetails');
	}

	$scope.goToDigicertList = function(operations) {
		$state.go('digicertList');

	}
}