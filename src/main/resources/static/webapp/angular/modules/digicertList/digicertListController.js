angular
	.module('O2DigitalSite')
	.controller('DigicertListController', DigicertListController);

function DigicertListController($scope, $http, $uibModal, $state, $stateParams, tokenManager, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $timeout, $rootScope, $filter, digicertListServices, sweet) {
	$scope.operationObject = {};
	$scope.digicertOperationList = [];
	
	$scope.domainId = tokenManager.getDomainId();
	$scope.uuid = $stateParams.uuid;
	$scope.userId = tokenManager.getUserIdFromToken();


	$scope.fechadeexpediciondesde = {
		opened : false
	};

	$scope.fechadeexpedicionhasta = {
		opened : false
	};


	$scope.fechadecapturadesde = {
		opened : false
	};

	$scope.fechadecapturahasta = {
		opened : false
	};


	$scope.fechadeoperacionesdesde = {
		opened : false
	};

	$scope.fechadeoperacioneshasta = {
		opened : false
	};


	$scope.dtInstanceDigicertList = {};

	$scope.dtOptionsOperations = DTOptionsBuilder.newOptions()
		.withOption('order', [ [ 1, "desc" ] ])
		.withOption('stateSave', true)
		.withOption('stateDuration', -1)
		.withOption('searching', false)
		.withOption('lengthChange', false)
		.withOption('stateSaveCallback', function(settings, data) {
			sessionStorage.setItem('DataTables_digicertList', JSON.stringify(data))
		})
		.withOption('stateLoadCallback', function(settings, data) {
			return JSON.parse(sessionStorage.getItem('DataTables_digicertList'))
		})
		.withPaginationType('simple_numbers');
	$scope.dtColumnsOperations = [
		DTColumnDefBuilder.newColumnDef(0).withClass('center-text'),
		DTColumnDefBuilder.newColumnDef(1).withClass('center-text'),
		DTColumnDefBuilder.newColumnDef(2).withClass('center-text'),
		DTColumnDefBuilder.newColumnDef(3).withClass('center-text'),
		DTColumnDefBuilder.newColumnDef(4).withClass('center-text'),
		DTColumnDefBuilder.newColumnDef(5).withClass('center-text'),
		DTColumnDefBuilder.newColumnDef(6).withClass('col-sm-1 center-text').withTitle('Acciones').notSortable()

	];

	$scope.myFunction = function(operationObject) {
		console.log(operationObject);

		var fromFormattedDataCaptura = undefined;
		var toFormattedDataCaptura = undefined;

		var fromFormattedDataExpedicion = undefined;
		var toFormattedDataExpedicion = undefined;

		var fromFormattedDataOperacion = undefined;
		var toFormattedDataOperacion = undefined;

		if (angular.isDefined(operationObject)) {

			if (angular.isDefined(operationObject.fechadecapturadesde))
				fromFormattedDataCaptura = moment(operationObject.fechadecapturadesde).format('YYYY-MM-DDT00:00:00');
			if (angular.isDefined(operationObject.fechadecapturahasta))
				toFormattedDataCaptura = moment(operationObject.fechadecapturahasta).format('YYYY-MM-DDT23:59:59');

			if (angular.isDefined(operationObject.fechadeexpediciondesde))
				fromFormattedDataExpedicion = moment(operationObject.fechadeexpediciondesde).format('YYYY-MM-DDT00:00:00');
			if (angular.isDefined(operationObject.fechadeexpedicionhasta))
				toFormattedDataExpedicion = moment(operationObject.fechadeexpedicionhasta).format('YYYY-MM-DDT23:59:59');

			if (angular.isDefined(operationObject.fechadeoperacionesdesde))
				fromFormattedDataOperacion = moment(operationObject.fechadeoperacionesdesde).format('YYYY-MM-DDT00:00:00');
			if (angular.isDefined(operationObject.fechadeoperacioneshasta))
				toFormattedDataOperacion = moment(operationObject.fechadeoperacioneshasta).format('YYYY-MM-DDT23:59:59');
			

			operationObject.fechadecapturadesde = fromFormattedDataCaptura;
			operationObject.fechadecapturahasta = toFormattedDataCaptura;

			operationObject.fechadeexpediciondesde = fromFormattedDataExpedicion;
			operationObject.fechadeexpedicionhasta = toFormattedDataExpedicion;

			operationObject.fechadeoperacionesdesde = fromFormattedDataOperacion;
			operationObject.fechadeoperacioneshasta = toFormattedDataOperacion;

		}

		if (fromFormattedDataCaptura !== null && toFormattedDataCaptura !== null && fromFormattedDataCaptura > toFormattedDataCaptura) {

			sweet.show({
				title : "Fecha inválida",
				text : "No puedes introducir una fecha de captura superior a la fecha inicial",
				type : "warning",
				confirmButtonColor : "#DD6B55",
				closeOnConfirm : true,
				html : false
			});
			
//			$scope.miModal()

		} else {


			if (fromFormattedDataExpedicion !== null && toFormattedDataExpedicion !== null && fromFormattedDataExpedicion > toFormattedDataExpedicion) {
				sweet.show({
					title : "Fecha inválida",
					text : "No puedes introducir una fecha de expedición superior a la fecha inicial",
					type : "warning",
					confirmButtonColor : "#DD6B55",
					closeOnConfirm : true,
					html : false
				});
			} else {
				if (fromFormattedDataOperacion !== null && toFormattedDataOperacion !== null && fromFormattedDataOperacion > toFormattedDataOperacion) {

					sweet.show({
						title : "Fecha inválida",
						text : "No puedes introducir una fecha de operación superior a la fecha inicial",
						type : "warning",
						confirmButtonColor : "#DD6B55",
						closeOnConfirm : true,
						html : false
					});


				} else {
					if (operationObject.importedesde > operationObject.importehasta) {

						sweet.show({
							title : "Importe inválido",
							text : "No puedes introducir un importe total inferior al inicial",
							type : "warning",
							confirmButtonColor : "#DD6B55",
							closeOnConfirm : true,
							html : false
						});

					} else {
						if (operationObject.baseimponibledesde > operationObject.baseimponiblehasta) {

							sweet.show({
								title : "Fecha inválida",
								text : "No puedes introducir una base imponible inferior a la inicial",
								type : "warning",
								confirmButtonColor : "#DD6B55",
								closeOnConfirm : true,
								html : false
							});

						} else {
							if (operationObject.cuotatributariadesde > operationObject.cuotatributariahasta) {

								sweet.show({
									title : "Fecha inválida",
									text : "No puedes introducir una cuota tributaria inferior a la inicial",
									type : "warning",
									confirmButtonColor : "#DD6B55",
									closeOnConfirm : true,
									html : false
								});

							} else {
								if ((operationObject.tipoimpositivo < 0) || (operationObject.tipoimpositivo > 100)) {
									sweet.show({
										title : "Importe inválido",
										text : "El tipo impositivo debe de ser superior a 0 y menor de 100",
										type : "warning",
										confirmButtonColor : "#DD6B55",
										closeOnConfirm : true,
										html : false
									});

								} else {
									digicertListServices.getOperationFiltered($scope.domainId, $scope.userId, operationObject).then(
										function(responseSuccess) {
											angular.forEach(responseSuccess.data, function(op, index) {
												if (op.fechadecaptura !== null) {
													responseSuccess.data[index].fechadecaptura = op.fechadecaptura.split('T')[0];
												}
												if (op.fechadeexpedicion !== null) {
													responseSuccess.data[index].fechadeexpedicion = op.fechadeexpedicion.split('T')[0];
												}
												
												if (op.fechadeoperaciones !== null) {
													responseSuccess.data[index].fechadeoperaciones = op.fechadeoperaciones.split('T')[0];
												}
												
												op.downloadUrl = "services/certimage/getdigitalizeddocumentbyuuid/" + tokenManager.getDomainId() + "/" + tokenManager.getToken() + "/" + op.uudid;
											});
											$scope.digicertOperationList = responseSuccess.data;
											digicertListServices.setAllOperations($scope.digicertOperationList);										},
										function(responseError) {
											console.log(responseError)

										});
								}
							}
						}
					}
				}
			}
		}
	}
	
	

	$scope.downloadPDF = function(uuid) {
		digicertListServices.getDigicertdocPDF(uuid).then(
			function(responseSuccess) {
				console.log('sucess');
				

			},
			function(responseError) {
				console.log('Error');
			}
		);
	}

	$scope.showPDF = function() {
		$scope.urlPDF = $rootScope.url + "digicertWebApp/angularDigicert/pdfJS/web/viewer.html?file=" + $rootScope.url + "services/certimage/getdigitalizeddocumentbyuuid/" + $scope.domainId + "/" + $scope.uuid;
	}
	

	$scope.fechadeexpediciondesde = function() {
		$scope.fechadeexpediciondesde.opened = true;
	}

	$scope.fechadeexpedicionhasta = function() {
		$scope.fechadeexpedicionhasta.opened = true;
	}

	$scope.fechadecapturadesde = function() {
		$scope.fechadecapturadesde.opened = true;
	}

	$scope.fechadecapturahasta = function() {
		$scope.fechadecapturahasta.opened = true;
	}

	$scope.fechadeoperacionesdesde = function() {
		$scope.fechadeoperacionesdesde.opened = true;
	}

	$scope.fechadeoperacioneshasta = function() {
		$scope.fechadeoperacioneshasta.opened = true;
	}

	$scope.refreshFilterTable = function(operationObject) {
		if (angular.isUndefined(operationObject))
			operationObject = {}
		operationObject.fromFormattedDataCaptura = undefined;
		operationObject.toFormattedDataCaptura = undefined;
		operationObject.fromFormattedDataExpedicion = undefined;
		operationObject.toFormattedDataExpedicion = undefined;
		operationObject.fromFormattedDataOperacion = undefined;
		operationObject.toFormattedDataOperacion = undefined;
		operationObject.cif = null;
		operationObject.nombreyapllidos = null;
		operationObject.nummeroderecepcion = null;
		operationObject.razonsocial = null;
		operationObject.baseimponibledesde = null;
		operationObject.baseimponiblehasta = null;
		operationObject.tipoimpositivo = null;
		operationObject.cuotatributariadesde = null;
		operationObject.cuotatributariahasta = null;
		operationObject.importedesde = null,
		operationObject.importehasta = null

		digicertListServices.operationFilter();

		digicertListServices.getOperationFiltered($scope.domainId, $scope.userId, operationObject).then(
			function(responseSuccess) {
				$scope.digicertOperationList = responseSuccess.data;
				angular.forEach(responseSuccess.data, function(op, index) {
					if (op.fechadecaptura !== null) {
						responseSuccess.data[index].fechadecaptura = op.fechadecaptura.split('T')[0];
					}
						if (op.fechadeexpedicion !== null) {
							responseSuccess.data[index].fechadeexpedicion = op.fechadeexpedicion.split('T')[0];
						}
						
						if (op.fechadeoperaciones !== null) {
							responseSuccess.data[index].fechadeoperaciones = op.fechadeoperaciones.split('T')[0];
						}
					
										});
										$scope.digicertOperationList = responseSuccess.data;
										digicertListServices.setAllOperations($scope.digicertOperationList);
			},
			function(responseError) {});
	}


	$scope.goToDetails = function(operation) {
		digicertListServices.setOperation(operation);
		$state.go('listCategory');
	}
	
	$scope.goToCategoryDetails = function(operations) {
		digicertListServices.setOperation(operations);
		$state.go('categoryDetails');
	}

	$scope.goToDocument = function(uuid) {
		var modalInstance = $uibModal.open({
			animation : true,
			size : 'lg',
			templateUrl : $rootScope.url + 'webapp/angular/modules/digicertList/templates/modalViewPDF.html',
			controller : 'modalcontrollerViewPDF',
			resolve: {
		        uuid: function () {
		            return uuid;
		          }
		        }
		});
	}

	$rootScope.$on("CallRefresh", function() {
		$scope.refreshFilterTable();
	});
	
	
	}
