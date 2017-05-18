angular
	.module('O2DigitalSite')
	.service('bioOperationRESTServices', bioOperationRESTServices)



	function bioOperationRESTServices ($http) {
		
		var service = {
			getPolicies: getPolicies,
			getDocumentsTypeByPolicyTypeID: getDocumentsTypeByPolicyTypeID,
			createNewOperation: createNewOperation
		}
		return service;

		function getPolicies (idConfiguration) {

			return $http({
				method : 'GET',
				url : '/BSign/services/policytype/listofpolicies/'+idConfiguration,
			});
		}

		function getDocumentsTypeByPolicyTypeID (idConfiguration) {
		 	return $http({
				method : 'GET',
				url : '/BSign/services/policytype/getdocumentstypebypolicytypeid/'+idConfiguration,
			});
		}

		function createNewOperation (formData) {

			return $http.post("/BSign/services/encargosbio/newoperation", formData, {
				withCredentials : false,
			       headers : {
			        'Content-Type' : undefined
			       },
			       transformRequest : angular.identity
			})
		 } 

	}