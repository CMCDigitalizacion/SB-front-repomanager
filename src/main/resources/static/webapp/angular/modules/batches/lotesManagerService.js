angular.module('O2DigitalSite').service('BatchesService', function ($http) {
	
	var service = {
		getInfoBatchFile : getInfoBatchFile,
		createOperations : createOperations,
		getInfoCancelFile: getInfoCancelFile,
		cancelOperations : cancelOperations,
	}
	return service;

	function getInfoBatchFile (formData) {

		return $http.post('services/batches/info', formData, {
		   withCredentials : false,
		   headers : { 'Content-Type' : undefined },
		   transformRequest : angular.identity
		 })
	}

	function getInfoCancelFile (formData) {

		return $http.post('services/batches/info/cancel', formData, {
		   withCredentials : false,
		   headers : { 'Content-Type' : undefined },
		   transformRequest : angular.identity
		 })
	}

	function createOperations (idDomain, idUser, formData) {

		return $http.post('services/batches/create/operations/' + idDomain + '/' + idUser, formData, {
		   withCredentials : false,
		   headers : { 'Content-Type' : undefined },
		   transformRequest : angular.identity
		 })
	}

	function cancelOperations (formData) {

		return $http.post('services/batches/cancel', formData, {
		   withCredentials : false,
		   headers : { 'Content-Type' : undefined },
		   transformRequest : angular.identity
		 })
	}

});