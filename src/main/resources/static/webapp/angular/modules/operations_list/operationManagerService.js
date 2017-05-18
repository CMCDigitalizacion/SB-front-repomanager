angular.module('O2DigitalSite').service('operationManager', function () {
	
	var operationSelected,
		eventsArray;

	var setOperationSelected = function (operationSelectedValue) {
		operationSelected = operationSelectedValue;
	}

	var getOperationSelected = function () {
		return operationSelected;
	}

	var setOperationEventsArray = function (eventsArrayValue) {
		eventsArray = eventsArrayValue;
	}

	var getOperationEventsArray = function () {
		return eventsArray;
	}

	return {
		setOperationSelected : setOperationSelected,
		getOperationSelected : getOperationSelected
	}

});

angular.module('O2DigitalSite').service('operationServiceCallerESign', function ($http) {

	var resendSMSVideoAccess = function(operationUUID) {
		return $http({
			method : 'GET',
			url : 'services/operations/resendotpvideoaccess/'+operationUUID
		})
	}

	var resendSMSAccess = function(operationUUID) {
		return $http({
			method : 'GET',
			url : 'services/operations/resendotpaccess/'+operationUUID
		})
	}
	
	var getListOfOperationsByDomainID = function (domainID, userID) {
		return $http({
			method : 'GET',
			
			url : 'services/operations/listoperations/'+domainID+'/'+userID
		})
	}

	var getOperationByID = function (operationID) {
		return $http({
			method : 'GET',
			url : 'services/operations/getoperation/'+operationID
		})
	}

	var getOperationByUUID = function (domainID, operationUUID) {
		return $http({
			method : 'GET',
			url : 'services/operations/getoperationbyuuid/'+ domainID + '/' +operationUUID
		})
	}

	var getOperationFiltered = function (domainID, userID, filter) {
		return $http({
			method : 'GET',
			url : 'services/operations/getoperations/'+domainID+'/'+userID+'/filtered/'+filter.fromFormatted+'/'+filter.toFormatted+'/'+filter.state+'/'+filter.nif+'/'
		})
	}

	var getOperationFilteredGrouped = function (domainID, userID, filter) {
		return $http({
			method : 'GET',
			url : 'services/operations/getoperationsgrouped/'+domainID+'/'+userID+'/filtered/'+filter.fromFormatted+'/'+filter.toFormatted+'/'+filter.state+'/'+filter.nif+'/'
		})
	}

	var getOperationValidated = function ( operationUuid) {
		return $http({
			method : 'GET',
			url : 'services/operations/validate/'+operationUuid
		})
	}

	var validateOperation = function(operationUuid) {
		return $http({
			method : 'POST',
			url : 'services/operations/validate/'+operationUuid
		})
	}

	var replaceDocument = function(file, documentUuid, idUser, withNotification, operationUuid) {
		var fd = new FormData();

		fd.append('file', file);

	    return $http.post("services/operations/replace/" + documentUuid + "/" + idUser + "/" + withNotification + "/" + operationUuid, fd, {
	       withCredentials : false,
	       headers : {
	        'Content-Type' : undefined
	       },
	       transformRequest : angular.identity
	    })

	}

	var cancelAllOperations = function(idUser, operationUuid) {

	    return $http({
			method : 'POST',
			url : 'services/operations/cancel/all/' + idUser + "/" + operationUuid
		})

	}

	return {
		getListOfOperationsByDomainID : getListOfOperationsByDomainID,
		getOperationByID              : getOperationByID,
		getOperationByUUID            : getOperationByUUID,
		getOperationFiltered          : getOperationFiltered,
		getOperationValidated         : getOperationValidated,
		resendSMSVideoAccess          : resendSMSVideoAccess,
		resendSMSAccess               : resendSMSAccess,
		getOperationFilteredGrouped   : getOperationFilteredGrouped,
		validateOperation             : validateOperation,
		replaceDocument               : replaceDocument,
		cancelAllOperations           : cancelAllOperations

	}

});