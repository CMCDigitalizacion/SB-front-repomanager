angular
	.module('O2DigitalSite')
	.service('operationFilterServiceManager', operationFilterServiceManager);

	function operationFilterServiceManager() {
		
		this.saveDefaultFilter = function() {
			var filterState = {
                from: undefined,
                to: undefined,
                operationid: undefined,
                fromFormatted: 'undefined',
                toFormatted: 'undefined',
                state: 'undefined'
            }
            //Saving the objects in the sessionStorage.
            sessionStorage.filterStateOperation = JSON.stringify(filterState);
		}

		this.onFilterTable = function(filterObject) {
			sessionStorage.filterStateOperation = JSON.stringify(filterObject);
		}
	}