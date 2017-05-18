angular.module('O2DigitalSite').service('operationTypeManager', function () {
	
	var operationTypeSelected,
		eventsArray;

	var setOperationTypeSelected = function (operationSelectedValue) {
		operationTypeSelected = operationSelectedValue;
	}

	var getOperationTypeSelected = function () {
		return operationTypeSelected;
	}



	return {
		setOperationTypeSelected : setOperationTypeSelected,
		getOperationTypeSelected : getOperationTypeSelected
	}

});

angular.module('O2DigitalSite').service('operationTypeServiceCallerESign', function ($http, tokenManager) {

	var createMultilevelOperation = function (formData) {

		return $http.post('services/operations/operationmultilevel/' + tokenManager.getDomainId(), formData, {
		   withCredentials : false,
		   headers : { 'Content-Type' : undefined },
		   transformRequest : angular.identity
		 })
	}

	var getLanguages = function (operationTypeId) {
		return $http ({
		    method: 'GET',
		    url: 'services/messages2customer/getlanguages',
		})
	}

	var getDocumentsByOperationType = function (operationTypeId) {
		return $http({
			method : 'GET',
			url : 'services/operations/getdocumentsbyoptype/'+operationTypeId
		})
	}

	var getFieldsByOperationType = function (operationTypeId) {
		return $http({
			method : 'GET',
			url : 'services/operations/getfieldsbyoptype/'+operationTypeId
		})
	}
	
	var getListOfOperationTypeByDomainID = function (domainID) {
		return $http({
			method : 'GET',
			url : 'services/operations/listoperationtype/'+domainID
		})
	}

	var getOperationTypeByID = function (operationID) {
		return $http({
			method : 'GET',
			url : 'services/operations/getoperationtype/'+operationID
		})
	}

	var getFieldsByOpType = function (operationID) {
		return $http({
			method : 'GET',
			url : 'services/operations/getfieldsbyoptype/'+operationID
		})
	}	
	
	return {
		getListOfOperationTypeByDomainID  : getListOfOperationTypeByDomainID,
		getOperationTypeByID              : getOperationTypeByID,
		getFieldsByOpType                 : getFieldsByOpType,
		getFieldsByOperationType          : getFieldsByOperationType,
		getDocumentsByOperationType       : getDocumentsByOperationType,
		getLanguages                      : getLanguages,
		createMultilevelOperation         : createMultilevelOperation,
	}

});