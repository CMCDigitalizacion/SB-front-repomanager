angular
	.module('O2DigitalSite')
	.controller('WitnessConfigurationController', WitnessConfigurationController)

	function WitnessConfigurationController($scope, $http, $state, $stateParams, witnessServices, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, $timeout, tokenManager){
		console.log($stateParams.idDomain)

		$rootScope.$broadcast('rootChange', 'Administración / Lotes Notario')

		$scope.dtInstanceNotaries = {}
		$scope.notarySelected = undefined;
		$scope.modified = false;
		$scope.prova;
		var companyName;

		$scope.cronConfiguration = {
			options : {
				allowMonth : false,
				allowMinute : false,
				allowHour : false,
				allowDay : false,
				allowYear : false
			}
		}

		$scope.dtOptionsNotaries = DTOptionsBuilder.newOptions().withOption('pageLength', 10).withPaginationType('simple_numbers');
		$scope.dtColumnsNotaries = [
	        DTColumnDefBuilder.newColumnDef(0).withClass('col-sm-4'),
	        DTColumnDefBuilder.newColumnDef(1).withClass('col-sm-4'),
	        DTColumnDefBuilder.newColumnDef(2).withClass('col-sm-3'),
	        DTColumnDefBuilder.newColumnDef(3).withTitle('').notSortable().withClass('col-sm-1')
	    ];

		$scope.loadWitnessConfiguration = function() {
			witnessServices.getWitnessConfiguration(tokenManager.getDomainId()).then(
				function(successResponse) {
					console.log(successResponse)
					$rootScope.$broadcast('callSuccess', 'Configuración cargada correctamente');
					$scope.witness = successResponse.data;
					companyName = successResponse.data.companyName;
					angular.forEach($scope.witness.notariesList, function(notaryObject, index) {
						if(notaryObject.checked)
							$scope.notarySelected = notaryObject;
					});
					$scope.serverData = successResponse.data.cron.cronAngularFormat;
					$scope.isLoaded = true;
				},
				function(errorResponse) {
					console.log(errorResponse)
					$rootScope.$broadcast('callError', errorResponse.data.failure + ' (desde: getWitnessConfiguration)');
				}
			)
		}

		$scope.associateNotaryToDomain = function(notary) {
			$scope.modified = true;
			if(notary.checked === true){
				$scope.notarySelected = angular.copy(notary);
				angular.forEach($scope.witness.notariesList, function(notaryObject, index) {
					if(notary.identificador !== notaryObject.identificador && notaryObject.checked)
						notaryObject.checked = false;
				})
			}
			else
				$scope.notarySelected = undefined;
		}

		$scope.saveNotaryToDomain = function() {
			witnessServices.associateNotaryToDomain(tokenManager.getDomainId(), $scope.notarySelected).then(
				function(successResponse) {
					if(angular.isUndefined($scope.notarySelected)){
						$rootScope.$broadcast('callSuccess', companyName + ' no tiene notarios asociados.');
						$scope.serverData = "* * * * *"
					}
					else
						$rootScope.$broadcast('callSuccess', $scope.notarySelected.nombre + ' ' + $scope.notarySelected.appellidos + ' ha sido asociado al dominio ' + companyName);
					$scope.modified = false;
				},
				function(errorResponse) {
					$rootScope.$broadcast('callError', errorResponse.data.failure + ' (desde: associateNotaryToDomain)');
				}
			)
		}

		$scope.saveCron = function(cronString) {
			var cronObject = {};
			cronObject.cronAngularFormat = cronString;
			cronObject.cronQuartzFormat = setRightCronFormat(cronString);
			witnessServices.saveCronString(tokenManager.getDomainId(), cronObject).then(
				function(successResponse) {
					$rootScope.$broadcast('callSuccess', "Cron guardado corrcetamente.");
				},
				function(errorResponse) {
					$rootScope.$broadcast('callError', errorResponse.data.failure + ' (desde: saveCronString)');
				}
			)
		}

		function setRightCronFormat(cronString) {
			var arrayOfWords = cronString.split(" ");
			var cronToReturn = '0 ';
			angular.forEach(arrayOfWords, function(word, index) {
				if(index === 2)
					cronToReturn += "? "
				else if(index === 4)
					cronToReturn += "" + (parseInt(word) + 1)
				else
					cronToReturn += word+" "
			})
			return cronToReturn;
		}
	}