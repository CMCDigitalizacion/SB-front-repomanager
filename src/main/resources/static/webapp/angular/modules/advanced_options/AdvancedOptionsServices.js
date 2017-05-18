angular
	.module('O2DigitalSite')
	.service('advanced_REST_Services', advanced_REST_Services)

	function advanced_REST_Services ($http) {
		
		var service = {
            getAdvancedOptions  : getAdvancedOptions,
            restoreDefault      : restoreDefault,
            saveAdvancedOptions : saveAdvancedOptions
    	};
    	return service;

        function getAdvancedOptions(idDomain){
            return $http({
                method : 'GET',
                url : 'services/domain/advanced/' + idDomain,
            });
        }

        function restoreDefault(idDomain){
            return $http({
                method : 'POST',
                url : 'services/domain/advanced/restore/' + idDomain,
            });
        }

        function saveAdvancedOptions(idDomain, advancedObject){
            return $http({
                method : 'POST',
                url : 'services/domain/advanced/save/' + idDomain,
                data: JSON.stringify(advancedObject)
            });
        }
    }