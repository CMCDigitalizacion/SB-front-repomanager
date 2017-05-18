angular
	.module('O2DigitalSite')
	.service('superRESTServices', superRESTServices)
	.service('superUtilities', superUtilities)

	function superRESTServices ($http) {
		
		var service = {
        	getAllDomains    : getAllDomains,
        	saveAdminUser    : saveAdminUser,
        	saveDomain       : saveDomain,
        	updateDomain     :  updateDomain,
            getAllUsers      : getAllUsers,
            deleteUser       : deleteUser,
            modifyUser       : modifyUser,
            getAllNotaries   : getAllNotaries,
            saveNotary       : saveNotary,
            deleteNotary     : deleteNotary,
            findOperation    : findOperation,
            getDomainBatches : getDomainBatches,
    	};
    	return service;

        function getDomainBatches(idDomain){
            return $http({
                method : 'GET',
                url : 'services/witness/batches/' + idDomain,
            });
        }

        function findOperation(idDomain, operation){
            return $http({
                method : 'GET',
                url : 'services/witness/verify/' + idDomain + '/' + operation.uuid + '/' + operation.dateString,
            });
        }

        function deleteNotary (notary){
            return $http({
                method : 'DELETE',
                url : 'services/super/delete/notary/'+notary.id
            });
        }

        function deleteUser (user){
            return $http({
                method : 'DELETE',
                url : 'services/super/delete/'+user.id
            });
        }

        function saveNotary (notary){
            return $http({
                method : 'POST',
                url : 'services/super/save/notary',
                data : JSON.stringify(notary)
            });
        }

        function modifyUser (user){
            return $http({
                method : 'POST',
                url : 'services/super/modify/user/'+user.id,
                data : JSON.stringify(user)
            });
        }

        function getAllUsers (){
            return $http({
                method : 'GET',
                url : 'services/super/allusers'
            });
        }

        function getAllNotaries (){
            return $http({
                method : 'GET',
                url : 'services/super/allnotaries'
            });
        }

    	function getAllDomains () {
    		return $http({
				method : 'GET',
				url : 'services/super/alldomains'
			});
    	}

    	function saveAdminUser (adminObject) {
    		return $http({
				method : 'POST',
				url : 'services/super/save/user',
				data : JSON.stringify(adminObject)
			});
    	}

    	function saveDomain (domainObject) {
    		return $http({
				method : 'POST',
				url : 'services/super/save/domain',
				data : JSON.stringify(domainObject)
			});
    	}
    	
    	function updateDomain (domainObject) {
    		return $http({
				method : 'POST',
				url : 'services/super/update/domain',
				data : JSON.stringify(domainObject)
			});
    	}

	}

	function superUtilities () {

		var service = {
        	setAdminObject : setAdminObject,
        	getAdminObject : getAdminObject,
        	setDomainsList : setDomainsList,
        	getDomainsList : getDomainsList
    	};
    	return service;

    	var adminObject,
    		domainsList;

    	function setDomainsList (domains) {
    		domainsList = domains;
    	}

    	function getDomainsList () {
    		return domainsList;
    	}

    	function setAdminObject (adminObjectValue) {
    		adminObject = adminObjectValue;
    	}

    	function getAdminObject () {
    		return adminObject;
    	}
	}
