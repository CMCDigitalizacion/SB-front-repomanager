angular
	.module('O2DigitalSite')
	.controller('ListCategoryController', ListCategoryController);

function ListCategoryController($scope, $http, $uibModal, $state, $stateParams, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $timeout, $rootScope, $filter, digicertListServices, sweet, tokenManager) {
	var dataobject = {
		usuarioid : tokenManager.getUserIdFromToken(),
		domainId : tokenManager.getDomainId()
	}

	var dataobjectSaveNewInformation = {
		domainId : tokenManager.getDomainId(),
		userId : tokenManager.getUserIdFromToken(),
		uuid : $stateParams.uuid
						
	}
	 
	 $scope.impuestosList = [];
	 
	 $scope.operation = digicertListServices.getOperation();
	 $scope.categories = $scope.operation.categorias;
	 $scope.disableCategory = false;
	
	 $scope.goToList= function(operations) {
		 $state.go('digicertList');
	 }
	 $scope.disableButton = function(){
		 $scope.disableCategory = true; 
	 }
	 

	$scope.impuestosList = [];
	$scope.operation = digicertListServices.getOperation();
	$scope.category = digicertListServices.getOperation();
	$scope.arrayNewCategories = {};
	$scope.arrayNewCategories.categorias = [];
	$scope.categoriesFormatted = []; 
	
	$scope.operations = digicertListServices.getAllOperations();
	//	 $scope.disableCategory = false;

	$scope.initDetailsCategory = function(operations) {
		digicertListServices.getDetailsCategory(dataobject).then(
			function(responseSucess) {
				//				 console.log('sucess');
				$scope.categories = responseSucess.data
				angular.forEach($scope.categories, function(category, index){
					var categoryFormatted = category.nombre;
					
					$scope.categoriesFormatted.push(categoryFormatted);
				})
			},
			function(responseError) {
				console.log('error');
			}
		);
	}
	
	$scope.prova = function(){
		console.log($scope.categoriesFormatted);
	}
	
	$scope.saveNewInformation = function(category) {
		var arrayOfCategories = []
		angular.forEach($scope.categoriesFormatted, function(cat, index){
			if(cat === category){
				arrayOfCategories.push(cat);
			}
		});
		var objectToSave = {
				"categorias ": category,
				"favorito" : 1
		}
		digicertListServices.editDetailsOperation(dataobjectSaveNewInformation, objectToSave).then(
				function(responseSucess) {
					$scope.categories = responseSucess.data
					angular.forEach($scope.categories, function(category, index){
						var categoryFormatted = {
								nombre : category,
								index : index,
						}
						
						$scope.categoriesFormatted.push(categoryFormatted);
					})
				},
				function(responseError) {
					console.log('error');
				}
			);
		}
	
}