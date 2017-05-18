angular
	.module('O2DigitalSite')
	.service('listBioOperationRESTServices', listBioOperationRESTServices)

	function listBioOperationRESTServices ($http) {
		
		var service = {
			getOperationsList         : getOperationsList,
			getOperationsListMultiple : getOperationsListMultiple,
			getDocsByOperationID      : getDocsByOperationID
		}
		return service;

		function getOperationsListMultiple (idConfiguration) {

			return $http({
				method : 'GET',
				url    : '/BSign/services/encargosbio/domain/operation/list/'+idConfiguration,
			});
		}

		function getOperationsList (idConfiguration) {

			return $http({
				method : 'GET',
				url    : '/BSign/services/encargosbio/operation/list/'+idConfiguration,
			});
		}


		function getDocsByOperationID (idOperation) {

			return $http({
				method : 'GET',
				url    : '/BSign/services/encargosbio/operation/docs/'+idOperation,
			});
		}


		
	}