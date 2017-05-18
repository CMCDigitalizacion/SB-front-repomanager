angular.module('O2DigitalSite').controller('WelcomeController', ['$scope', '$http', '$state', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function($scope, $http, $state, $compile, DTOptionsBuilder, DTColumnBuilder){
	console.log('in the welcomeController');



	// $scope.operationsType = {};
 //    $scope.dtOptions = DTOptionsBuilder.fromSource('/HAGCLI_VIDEOID_BCE/services/repository/operationtype/1').withPaginationType('full_numbers').withOption('createdRow', createdRow);
 //    $scope.dtColumns = [
 //        DTColumnBuilder.newColumn('id').withTitle('ID'),
 //        DTColumnBuilder.newColumn('domainid').withTitle('Domain ID'),
 //        DTColumnBuilder.newColumn('name').withTitle('Nombre'),
 //        DTColumnBuilder.newColumn('signatureType').withTitle('Tipo de Firma'),
 //        DTColumnBuilder.newColumn('').withTitle('Accíones').notSortable().renderWith(actionsHtml)
 //    ];

	// function createdRow(row, data, dataIndex) {
 //        // Recompiling so we can bind Angular directive to the DT
 //        $compile(angular.element(row).contents())($scope);
 //    }
	
	// $scope.edit = function(operationsTypeObject){
	// 	$state.go('manage_operation', { id : operationsTypeObject.id})
	// }

	// $scope.deleteID = function(prova){
	// 	console.log(prova)
	// }
	// function actionsHtml(data, type, full, meta) {
	// 	$scope.operationsType[full.id] = full;
 //        return '<span class="glyphicon glyphicon-eye-open" ng-click="edit(operationsType['+ full.id +'])"></span>';
 //    }

 //    $scope.gotoDomain = function () {
 //        console.log('Going to the domainmanager');
 //        $state.go('manage_domain');
 //    }

 //    $scope.gotoDomainWithSpecificID = function () {
 //        console.log('Going to the specific domain ');
 //        var domainID = JSON.parse(sessionStorage.getItem('sessionData')).domain.id;
 //        $state.go('domain_with_id', { id : domainID});
 //    }

}]);