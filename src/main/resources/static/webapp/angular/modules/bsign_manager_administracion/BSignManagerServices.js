angular
	.module('O2DigitalSite')
	.service('bsignRESTServices', bsignRESTServices)

	function bsignRESTServices ($http) {
		
		var service = {
			getBSignData: getBSignData,
			savePolicyType: savePolicyType,
			deletePolicyType: deletePolicyType,
			saveDocumentType: saveDocumentType,
			deleteDocumentType: deleteDocumentType,
			updateDocsTypeOfPolicyType: updateDocsTypeOfPolicyType,
			saveConfiguration: saveConfiguration,
			modifyPolicyType: modifyPolicyType
		}

		return service;

		function getBSignData (idConfiguration) {
			return $http({
				method : 'GET',
				url : '/BSign/services/bsign/manager/data/'+idConfiguration,
			});
		}

		function getOperationsType (idConfiguration) {
			return $http({
				method : 'GET',
				url : '/BSign/services/bsign/listofpolicies/'+idConfiguration,
			});
		}

		function saveConfiguration (idConfiguration, configuration) {
			return $http({
				method : 'POST',
				url : '/BSign/services/configuration/save/'+idConfiguration,
				data: JSON.stringify(configuration)
			});
		}

		function savePolicyType (idConfiguration, policyTypeObject) {
			return $http({
				method : 'POST',
				url : '/BSign/services/policytype/save/'+idConfiguration,
				data: JSON.stringify(policyTypeObject)
			});
		}

		function deletePolicyType (idConfiguration, idPolicyType, policyName) {
			return $http({
				method : 'DELETE',
				url : '/BSign/services/policytype/delete/'+idConfiguration+'/'+idPolicyType+'/'+policyName,
			});
		}

		function saveDocumentType (documentObject) {
			return $http({
				method : 'POST',
				url : '/BSign/services/documenttype/save',
				data: JSON.stringify(documentObject)
			});
		}

		function deleteDocumentType (idConfiguration, idDocument) {
			return $http({
				method : 'DELETE',
				url : '/BSign/services/documenttype/delete/'+idConfiguration+'/'+idDocument,
			});
		}

		function updateDocsTypeOfPolicyType (idConfiguration, policyId, docsString) {
			return $http({
				method : 'POST',
				url : '/BSign/services/policytype/update/docs/'+idConfiguration+'/'+policyId,
				data: docsString
			});
		}

		function modifyPolicyType (idConfiguration, policyId, policyObject) {
			return $http({
				method : 'POST',
				url : '/BSign/services/policytype/update/policy/'+idConfiguration+'/'+policyId,
				data: JSON.stringify(policyObject)
			});
		}

	}

angular
	.module('O2DigitalSite')
	.service('bsignServices', bsignServices)

	function bsignServices () {
		
		var service = {
			setPolicyList: setPolicyList,
			getPolicyList: getPolicyList,

			setDocumentsList: setDocumentsList,
			getDocumentsList: getDocumentsList,

			setDocumentObject: setDocumentObject,
			getDocumentObject: getDocumentObject,

			setSavedDocPromise: setSavedDocPromise,
			getSavedDocPromise: getSavedDocPromise
		}

		return service;

		var policyList,
			documentList,
			documentObject,
			savedDocPromise;

		function getSavedDocPromise(){
			return savedDocPromise;
		}

		function setSavedDocPromise (promiseValue) {
			savedDocPromise = promiseValue;
		}

		function setDocumentObject (documentObjectValue) {
			documentObject = documentObjectValue;
		}

		function getDocumentObject () {
			return documentObject;
		}
		function setPolicyList (policyListValue) {
			policyList = policyListValue;
		}

		function getPolicyList () {
			return policyList;
		}

		function setDocumentsList (documentsListValue) {
			documentList = documentsListValue;
		}

		function getDocumentsList () {
			return documentList;
		}
	}