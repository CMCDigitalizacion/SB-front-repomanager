angular.module('O2DigitalSite').controller('LotesListController', ['$scope', '$http', '$state', '$stateParams', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'loteManager', 'loteServiceCallerESign', '$timeout', '$rootScope', '$filter', 'tokenManager',
 function($scope, $http, $state, $stateParams, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, loteManager, loteServiceCallerESign, $timeout, $rootScope, $filter, tokenManager){

 	console.log('In the lotesListController, the domain\' s id received is: '+ $stateParams.id);
 	$rootScope.$broadcast('rootChange', 'Consultar / Lotes de Firma');
 	$scope.isLoaded = false;

 	$scope.loadLotesList = function () {
 		
        $scope.dtInstanceOperationsCallback = dtInstanceOperationsCallback;
        $scope.dtInstanceOperations = {};

        function dtInstanceOperationsCallback (dtInstance) {
            $scope.dtInstanceOperations = dtInstance;
        }

 		$scope.dtOptionsOperations = DTOptionsBuilder.newOptions().withPaginationType('simple_numbers');
        $scope.dtColumnsOperations = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5)
        ];

        loteServiceCallerESign.getListOfLotesByDomainID(tokenManager.getDomainId())
        .then(function(responseSuccess){
        	console.log('SUCCESS');
        	$scope.lotesList = responseSuccess.data;
        	$scope.isLoadedList = true;

        }, function (responseError) {        
        	console.log('Error on getting the list of lotes by Domain ID', responseError);
    	});
 	}

 }]);