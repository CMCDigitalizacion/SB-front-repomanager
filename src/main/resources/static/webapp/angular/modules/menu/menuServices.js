angular
	.module('O2DigitalSite')
	.service('menuRESTServices', menuRESTServices)


	function menuRESTServices ($http) {
		
		var service = {
			changePass    : changePass,
			getDomainName : getDomainName
		}

		return service;

		function changePass (userObject) {
			return $http({
				method : 'POST',
				url : 'services/repository/change/pass/'+userObject.idUser,
				data : JSON.stringify(userObject)
			}); 
		}

		function getDomainName (idDomain) {
			return $http({
				method : 'GET',
				url : 'services/domain/name/'+userObject.idUser,
			}); 
		}
	}