angular
	.module('O2DigitalSite')
	.controller('ListBiometricOperationController', ['$scope', '$http', '$state', '$stateParams', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$rootScope', '$uibModal', 'listBioOperationRESTServices', '$log', '$parse', '$window', '$q', 'tokenManager',
 function($scope, $http, $state, $stateParams, $compile, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $rootScope, $uibModal, listBioOperationRESTServices, $log, $parse, $window, $q, tokenManager){

	$rootScope.$broadcast('rootChange', 'Consultar / Operaciones Biometricas')
 	$scope.dtInstanceOperationsBio = {}

    $scope.dtOptionsOperationsBio = DTOptionsBuilder.newOptions()
    											 .withOption('order', [[ 1, "desc" ]])
    											 .withOption('pageLength', 10)
												 .withOption('stateSave', true)
                                              	 .withOption('stateDuration', -1)
                                              	 .withOption('stateSaveCallback', function(settings, data) {
                                                    sessionStorage.setItem( 'DataTables_OperationsBioList', JSON.stringify(data) )
                                                 })
                                                 .withOption('stateLoadCallback', function(settings, data) {
                                                     return JSON.parse( sessionStorage.getItem( 'DataTables_OperationsBioList' ) )
                                                 })
    											 .withPaginationType('simple_numbers');

    $scope.dtColumnsOperationsBio = [
        DTColumnDefBuilder.newColumnDef(0).withClass('center-text little-words-table'),
        DTColumnDefBuilder.newColumnDef(1).withClass('center-text little-words-table'),
        DTColumnDefBuilder.newColumnDef(2).withClass('center-text little-words-table'),
        DTColumnDefBuilder.newColumnDef(3).withClass('center-text little-words-table'),
        DTColumnDefBuilder.newColumnDef(4).notVisible(),
        DTColumnDefBuilder.newColumnDef(5).notVisible(),
        DTColumnDefBuilder.newColumnDef(6).withClass('center-text little-words-table'),
        DTColumnDefBuilder.newColumnDef(7).withClass('col-sm-1').withTitle('Acciones').notSortable()
    ];


 	$scope.loadListOperation = function () {

 		//Loading the bio operations created from the multiple module and the ones created from the default module.
 		$q.allSettled([
 			listBioOperationRESTServices.getOperationsListMultiple(tokenManager.getDomainId())
 		]).then(function(responseArray) {
 			var errorArray = [];

			angular.forEach(responseArray, function (response, index) {
				if (response.state === 'fulfilled') {
					if(index === 0){
	                	//setting $scope object for operations:
	                	$scope.operationsList = response.value.data;
	                } else if(index === 1){
	                	//merging with others operations values:
	                	$scope.operationsList = $scope.operationsList.concat(response.value.data);
	                }
	            } else {
	            	if(index === 0){
	                	response.reason.from = 'getOperationsListMultiple';
	                } else if(index === 1){
	                	response.reason.from = 'getOperationsList';
	                }
		            errorArray.push(response.reason);
	            }
	        })

			if (errorArray.length > 0){
				var listError = ''
				angular.forEach(errorArray, function (error, index) {
					if(errorArray.length == 1)
						listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
					else if(errorArray.length -1 === index)
						listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
					else
						listError = listError + error.data.failure + ' (desde: ' + error.from + ')  ---  ';
				})
				$rootScope.$broadcast('callError', listError);
			} else{
				angular.forEach($scope.operationsList, function (op) {
 					if(op.state === 0)
 						op.stringState = 'PENDIENTE'
 					else if(op.state === 1)
 						op.stringState = 'FIRMADA'
 				});
				$scope.isLoaded = true;
				$rootScope.$broadcast('callSuccess', 'Operaciones Biometricas cargadas correctamente.');
			}
 		})
 	}


 	$scope.detailsOperation = function (operation) {
 		$log.log(operation);

 		listBioOperationRESTServices.getDocsByOperationID(operation.idoperation).then(
 			function (responseSuccess) {
 				angular.forEach(responseSuccess.data, function (doc, index) {
 					doc.url = 'webapp/web/viewer.html?file=/BSign/services/document/pdf/' + tokenManager.getDomainId() + '/' + doc.uuid + '#zoom=page-fit'
 				});

 				var modalInstance = $uibModal.open({
					templateUrl: 'modalOperation.html',
					controller: 'OperationDetailController',
					size: 'lg',
					windowClass: 'dialogGeneral details-operation-modal-window',
					resolve: {
			        	operation: function () {
			          		return operation;
			     		},
			     		documents: function () {
			     			return responseSuccess.data
			     		}
			     	}
			    });

 				
 			},
 			function (responseError) {
 				
 			}
 		)
 	}




 }]);


angular
	.module('O2DigitalSite')
	.controller('OperationDetailController', function ($scope, $uibModalInstance, operation, documents, $timeout, $window, tokenManager, $rootScope) {


	console.log(operation);
	console.log(documents);

	$scope.canSign = true;

	if(tokenManager.checkIfTokenExist() && (tokenManager.getUserRole() === 0 || tokenManager.getUserRole() === -2))
		$scope.canSign = false;

	var windowHeight = $('#body').height();
	$timeout(function() {
		$('#iframe-pdf').height(windowHeight - 216);
	},100)
	$scope.slides = documents;
	$scope.operation = operation;
	$scope.urlQR = '/BSign/services/encargosbio/qr/'+operation.idoperation;

	$scope.openSignWacomPage = function() {
		$window.open($rootScope.url + 'webapp/signmodule/index.html#/sign/1/'+operation.idoperation, '_blank');
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});