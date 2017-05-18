angular
	.module('O2DigitalSite')
	.service('witnessServices', witnessRESTServices)

	function witnessRESTServices ($http) {
		
		var service = {
			getWitnessConfiguration: getWitnessConfiguration,
			associateNotaryToDomain: associateNotaryToDomain,
			saveCronString: saveCronString,
		}
		return service;

		function getWitnessConfiguration (idDomain) {

			return $http({
				method : 'GET',
				url : 'services/witness/configuration/'+idDomain,
			});
		}

		function associateNotaryToDomain (idDomain, notaryObject) {

			return $http({
				method : 'POST',
				url : 'services/witness/associate/notary/'+idDomain,
				data : JSON.stringify(notaryObject)
			});
		}

		function saveCronString (idDomain, cronObject) {

			return $http({
				method : 'POST',
				url : 'services/witness/save/cron/'+idDomain,
				data : JSON.stringify(cronObject)
			});
		}
	}