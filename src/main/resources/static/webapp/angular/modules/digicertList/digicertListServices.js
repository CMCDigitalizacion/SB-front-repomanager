angular
	.module('O2DigitalSite')
	.service('digicertListServices', digicertListServices)

function digicertListServices($http, $rootScope ,tokenManager, $stateParams) {
	

	var operation, operations = [];
	

	var services = {
			getDigicertdocPDF: getDigicertdocPDF,
			setOperation: setOperation,
			getOperation: getOperation,
			setAllOperations: setAllOperations,
			getAllOperations: getAllOperations,
			getOperationFiltered:getOperationFiltered,
			operationFilter:operationFilter,
			getDetailsCategory:getDetailsCategory,
			getDocumentsListCategory:getDocumentsListCategory,
			editDetailsOperation:editDetailsOperation
	}
	
	return services;
	
	function setOperation(op) {
		operation = op;
	}
	
	function getOperation() {
		return operation;
	}
	
	function setAllOperations(op) {
		operations = op;
	}
	
	function getAllOperations() {
		return operations;
	}
	
function getDigicertdocPDF(uuid) {
		
		return $http({
			method: 'GET',
			url: $rootScope.url + 'services/certimage/getdigitalizeddocumentbyuuid/' + tokenManager.getDomainId() +  '/' + tokenManager.getToken() + '/' + uuid
		});
}
	function getOperationFiltered(domainId, userId, operationObject) {
		return $http({
			method : 'POST',
			headers: {
				'Content-Type': "application/json",
				'Authorization': $rootScope.token
			},  

			url : $rootScope.url + 'services/certimage/digitalizeddocs/' + domainId + '/'  + userId,
			data: JSON.stringify(operationObject)
		})
	}
	
	function getDetailsCategory(object, dataobject){
		return $http({
			method : 'POST',
			headers: {
				'Content-Type': "application/json",
				'Authorization': $rootScope.token,
				
			},  

			url : $rootScope.url + 'services/certimage/digitalizeddocscategories/' + object.domainId + '/'  + object.usuarioid,
			data: JSON.stringify(dataobject)
		})
	}
	
	function getDocumentsListCategory(object, category){
		return $http({
			method : 'POST',
			headers: {
				'Content-Type': "application/json",
				'Authorization': $rootScope.token,
				
			},  

			url : $rootScope.url + 'services/certimage/digitalizeddocsbycategory/' + object.domainId + '/'  + object.usuarioid + '/' + category
		})
	}

	function editDetailsOperation(object , dataobject){
		return $http({
			method : 'POST',
			url : $rootScope.url + 'services/certimage/editdigitalizeddoc/' + object.domainId + '/' + object.userId + '/' + "c4162f8a-42d4-428c-88dc-7bd1326ac883",
			data: JSON.stringify(object)
		})

	}
	
	function operationFilter() {
		
			return operationObject = {
				fromFormattedDataCaptura : null,
                toFormattedDataCaptura: null,
                fromFormattedDataExpedicion: null,
                toFormattedDataExpedicion: null,
                fromFormattedDataOperacion: null,
                toFormattedDataOperacion: null,
                cif : null,
		        nombreyapllidos : null,
		        nummeroderecepcion : null,
		        razonsocial : null,
		        baseimponibledesde : null,
		        baseimponiblehasta : null,
		        tipoimpositivo :null,
		        cuotatributariadesde : null,
		        cuotatributariahasta : null,
		        importetotaldesde : null,
		        importetotalhasta : null
            }
			
			
	}
		
}