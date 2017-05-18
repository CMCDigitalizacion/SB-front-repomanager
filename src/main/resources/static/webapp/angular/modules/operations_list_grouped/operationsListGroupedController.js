angular.module('O2DigitalSite').controller('OperationsListGroupedController', ['$scope', '$http', '$state', '$stateParams', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'operationManager', 'operationServiceCallerESign', '$timeout', '$rootScope', '$filter', '$uibModal', 'sweet', 'tokenManager', 'operationFilterServiceManager',
 function($scope, $http, $state, $stateParams, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, operationManager, operationServiceCallerESign, $timeout, $rootScope, $filter, $uibModal, sweet, tokenManager, operationFilterServiceManager){

 	console.log('In the operationsListController, the domain\' s id received is: '+ $stateParams.id);
 	$rootScope.$broadcast('rootChange', 'Consultar / Operaciones de Firma Agrupadas')
 	$scope.isLoaded = false;
 	var operationSelectedID;
 	var operationSelecteduuid;
 	var operationSelectedMultipleUuid;

    $scope.fromdatepicker = {
        opened : false
    };

    $scope.todatepicker = {
        opened : false
    };

    if(angular.isDefined(sessionStorage.filterGroupedOperation)) {
        $scope.filter = JSON.parse(sessionStorage.filterGroupedOperation);
        if(angular.isDefined($scope.filter.from) && $scope.filter.from !== '' && !angular.isNull($scope.filter.from)){
            $scope.filter.from = new Date($scope.filter.from);
        }

        if(angular.isDefined($scope.filter.to) && $scope.filter.to !== '' && !angular.isNull($scope.filter.to)){
            $scope.filter.to = new Date($scope.filter.to);
        }
    }
    else{
        $scope.filter = {};
    }

    $scope.dtInstanceOperationsList = {};

    $scope.dtOptionsOperations = DTOptionsBuilder.newOptions()
                                                 .withPaginationType('simple_numbers');
    
    $scope.dtOptionsOperationsSecondTable = DTOptionsBuilder.newOptions()
											    .withOption('order', [[ 1, "desc" ]])
											    .withOption('stateSave', false)
											    .withOption('stateDuration', false)
											    .withOption('info', false)
											    .withOption('paging', false)
											    .withOption('searching', false);
    
    $scope.dtColumnsOperations = [
        DTColumnDefBuilder.newColumnDef(0).withClass('hidden'),
        DTColumnDefBuilder.newColumnDef(1).withClass('col-sm-1 numContract').notSortable()
    ];
   
    $scope.dtColumnsOperationsSecondTable = [
	    DTColumnDefBuilder.newColumnDef(0).withClass('hidden'),
        DTColumnDefBuilder.newColumnDef(1).withClass('center-text'),
        DTColumnDefBuilder.newColumnDef(2).withClass('center-text'),
        DTColumnDefBuilder.newColumnDef(3).withClass('center-text'),
        DTColumnDefBuilder.newColumnDef(4).withClass('hidden'),
        DTColumnDefBuilder.newColumnDef(5).withClass('hidden'),
        DTColumnDefBuilder.newColumnDef(6).withClass('center-text').renderWith(typeSignHtml),
        DTColumnDefBuilder.newColumnDef(7).withClass('col-sm-1 center-text').renderWith(stateFormatterHtml),
        DTColumnDefBuilder.newColumnDef(8).withClass('col-sm-1 center-text').withTitle('Acciones').notSortable()
    ];
    
    $scope.optionsConfig = [
                            {id:0,value:"Número Contrato"},
                            {id:1,value:"Fecha Contrato"},
                            {id:2,value:"Cliente"},
                            {id:3,value:"NIF Cliente"},
                            {id:4,value:"Teléfono"},
                            {id:5,value:"Email"},
                            {id:6,value:"Tipología Firma"},
                            {id:7,value:"Estado"}
                            ];
     
     $scope.selectedOption = [];
     
     // if don't have configuration apply a default (three first and the last)
     if ( localStorage.getItem('configOpList') == null || localStorage.getItem('configOpList') == undefined ) {
      	
      	var config = [];
     	
        if ( $scope.optionsConfig.length > 4 ) 
        	config = [0,1,2,$scope.optionsConfig.length-1];
         else {
        	 for(var i = 0; i < $scope.optionsConfig.length; i++)
             	config.push(i);
         }
        localStorage.setItem('configOpList', JSON.stringify(config));
    }
     
    var LSconfigOpList = localStorage.getItem('configOpList');
    LSconfigOpList = $.parseJSON(LSconfigOpList);

    $scope.selectedOption = LSconfigOpList;
    
    // Show only the fields asigned in the localStorage configuration
    for ( var foo = 0; foo < $scope.optionsConfig.length; foo++ ) {
    	
    	// if the option is in selected option show, else hidden 
    	if ( $scope.selectedOption.indexOf($scope.optionsConfig[foo].id) > -1 ) {
    		
    		if ( $scope.optionsConfig[foo].id == 6 )
    			$scope.dtColumnsOperationsSecondTable[$scope.optionsConfig[foo].id].sClass = 'col-sm-1 center-text';
    		else if ( $scope.optionsConfig[foo].id == 7 )
    			$scope.dtColumnsOperationsSecondTable[$scope.optionsConfig[foo].id].sClass = 'col-sm-1 center-text';
    		else
    			$scope.dtColumnsOperationsSecondTable[$scope.optionsConfig[foo].id].sClass = 'center-text';
    	} else
    		$scope.dtColumnsOperationsSecondTable[$scope.optionsConfig[foo].id].sClass = 'hidden';
    }

    $scope.isVisor = function() {
      if(tokenManager.checkIfTokenExist() && tokenManager.getUserRole() === -2)
        return true;
      else
        return false;
    }

     
    // add or delete this index in the array selectedOption
    $scope.toggle = function(item) {
      	var index = $scope.selectedOption.indexOf(item);
          if (index > -1)
              $scope.selectedOption.splice(index, 1);
          else
              $scope.selectedOption.push(item);
    }
      
    $scope.isExists = function (item) {
          return $scope.selectedOption.indexOf(item) > -1;
    };
    
    $scope.applyChanges = function() {
      	localStorage.setItem('configOpList', JSON.stringify($scope.selectedOption));
      	location.reload();
    } 
    
    $scope.showSelectedOption = function() {
    	 var LSconfigOpList = localStorage.getItem('configOpList');
    	 LSconfigOpList = $.parseJSON(LSconfigOpList);
    	    
    	 $scope.selectedOption = LSconfigOpList;
    }
    
    $("#tableListOperations [type='search']").val(' ');

    function dateFormatterHtml (data, type, full, meta) {
        return full[7];
    }
    
    function typeSignHtml (data, type, full, meta, pos, toReturn) {
    	if (pos === null || pos === undefined) 
    		pos = 0;
    
    	if (toReturn === null || toReturn === undefined)
    		var toReturn = '<span>';
    	
    	var typeSign = data;
    	
    	if (typeSign[0] === "0")
    		toReturn = 'SIN FIRMA';
         else if (typeSign[0] === "1")
        	toReturn = 'SIMPLE';
         else if (typeSign[0] === "2")
        	toReturn = 'AVANZADA';
         else if (typeSign[0] === "3")
        	toReturn = 'VIDEO CONFERENCIA';
         else if (typeSign[0] === "4")
            toReturn = 'VIDEO ID';
         else if (typeSign[0] === "5")
        	toReturn = 'VIDEO ID CON FIRMA';
         else if (typeSign[0] === "6")
        	toReturn = 'BIOMÉTRICA';
         else if (typeSign[0] === "9") {
        	for (var i = pos+1; i < typeSign.length; i++) {
        		if (i > 1) {
        			toReturn += ', ';
        		}
        		toReturn += typeSignHtml(typeSign[i], type, full, meta, i, toReturn);
 			}
         }
    	
    	if (pos === null || pos === undefined) 
    		toReturn += '</span>';
    	
    	return toReturn;
    }

    // Conversión a HTML de los diferentes estados en los que puede estar una operación
    function stateFormatterHtml (data, type, full, meta) {
    	var state = data;
    	var toReturn = '';
    	switch(state) {
    	case '0':
    		toReturn = '<span>PENDIENTE</span>';
    		break;
    	case '1':
    		toReturn = '<span>ACCESO</span>';
    		break;
    	case '2':
    		toReturn = '<span>FIRMADA</span>';
    		break;
    	case '3':
    		toReturn = '<span>CADUCADA</span>';
    		break;
    	case '4':
    		toReturn = '<span>ERROR</span>';
    		break;
    	case '12':
    		toReturn = '<span>FIRMA PARCIAL</span>';
    		break;
    	case '21':
    		toReturn = '<span>VIDEO ID: ACCESO</span>';
    		break;
    	case '22':
    		toReturn = '<span>VIDEO ID: VERIFICADO</span>';
    		break;
    	case '23':
    		toReturn = '<span>VIDEO ID: RECHAZADO</span>';
    		break;
    	case '24':
    		toReturn = '<span>VIDEO ID: PENDIENTE</span>';
    		break;
    	case '26':
    		toReturn = '<span>SOLICITUD DE VIDEOCONFERENCIA</span>';
    		break;
    	case '27':
    		toReturn = '<span>VIDEOCONFERENCIA EN PROGRESO</span>';
    		break;
    	case '30':
    		toReturn = '<span>VIDEO 1PASO: FIRMADA POR CLIENTE</span>';
    		break;
    	case '40':
    		toReturn = '<span>VALIDADA</span>';
    		break;
    	case '41':
    		toReturn = '<span>PARCIALMENTE VALIDADA</span>';
    		break;
    	case '50':
    		toReturn = '<span>DIGITALIZADA</span>';
    		break;
    	case '91':
    		toReturn = '<span>BLOQUEADA</span>';
    		break;
    	case '99':
    		toReturn = '<span>CANCELADA</span>';
    		break;
    	case '-2':
    		toReturn = '<span>HMB ERROR</span>';
    		break;
    	default:
    		toReturn = '---';
    	}
    	return toReturn;
    }

    $scope.loadOperationsList = function () {

        operationServiceCallerESign.getOperationFilteredGrouped(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), $scope.filter).then(function(responseSuccess){
        	console.log('SUCCESS');
        	$scope.operationsList = [];
        	listOperationGrouped(responseSuccess.data);
        	
        	$scope.isLoadedList = true;

        }, function (responseError) {
        	console.log('Error on getting the list of operation by Domain ID', responseError);
    	});
 	}
 	
    $scope.filterTable = function (filter) {
        console.log(filter);
        var fromFormattedData = 'undefined';
        var toFormattedData = 'undefined';
        if (angular.isDefined(filter)){

            if (angular.isDefined(filter.from))
                fromFormattedData = moment(filter.from).format('YYYY-MM-DD');
            if (angular.isDefined(filter.to))
                toFormattedData = moment(filter.to).format('YYYY-MM-DD');

            filter.fromFormatted = fromFormattedData;
            filter.toFormatted = toFormattedData;

            if(fromFormattedData !== 'undefined' && toFormattedData !== 'undefined' && fromFormattedData>toFormattedData){
				sweet.show({
					title: '',
					confirmButtonColor: '#F27474',
					text: 'La fecha final debe ser igual o posterior a la inicial.',
					confirmButtonText: 'Cerrar',
					type: 'warning'
				});

            } else{
                operationServiceCallerESign.getOperationFilteredGrouped(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), filter).then(
                    function (responseSuccess) {
                    	$scope.operationsList = [];
                    	listOperationGrouped(responseSuccess.data);
                        sessionStorage.filterGroupedOperation = JSON.stringify(filter);
                    },
                    function (responseError) {

                    }
                );
            }

        }
    }

    $scope.openFromDatePicker = function() {
        $scope.fromdatepicker.opened = true;
    }

    $scope.openToDatePicker = function() {
        $scope.todatepicker.opened = true;
    }

    $scope.refreshFilterTable = function(filter) {
      if(angular.isUndefined(filter)) filter = {}
      filter.from = undefined;
      filter.fromFormatted = undefined;
      filter.to = undefined;
      filter.toFormatted = undefined;
      filter.nif = undefined;
      filter.state = undefined;
      
      operationFilterServiceManager.saveDefaultFilter();
      
      operationServiceCallerESign.getOperationFiltered(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), filter).then(
          function (responseSuccess) {
        	  	$scope.operationsList = [];
        	  	listOperationGrouped(responseSuccess.data);
          },
          function (responseError) {

          });
    }


	$scope.detallesOp = function (operationObject) {

 		console.log(operationObject);
        operationSelectedID = operationObject.id;
        operationSelecteduuid = operationObject.uuid;
        $scope.multipleUuid = operationObject.multipleUuid;
        //operationServiceCallerESign.getOperationByID(operationObject.id).then(
        operationServiceCallerESign.getOperationByUUID(tokenManager.getDomaniId(), operationObject.uuid).then(
        function (responseSuccess) {
    		$scope.isLoadedList = false;
			console.log('SUCCESS', responseSuccess.data);

            var operationDate = angular.copy(responseSuccess.data.authPolicy.fields[0]);
            operationDate.label = 'Fecha'
            operationDate.value = responseSuccess.data.creationDateF;

            var stateOperation = angular.copy(responseSuccess.data.authPolicy.fields[0]);
            stateOperation.label = 'Estado'
            stateOperation.value = $scope.convertState(responseSuccess.data.state);

            var infos = responseSuccess.data.authPolicy.fields;
            infos.unshift(stateOperation);
            infos.unshift(operationDate);

            $scope.infoList = infos;

			$scope.operationID =  responseSuccess.data.operationId;
			$scope.state = responseSuccess.data.state;
			$scope.stateName = $scope.convertState(responseSuccess.data.state);
			$scope.creationDate = responseSuccess.data.creationDateF;
			$scope.listEvents = responseSuccess.data.events;
            $scope.listDocumentsToUpload = responseSuccess.data.documentsToUpload;
			$scope.listNotifications = responseSuccess.data.notifications;
			$scope.listDocuments = responseSuccess.data.documents;
			$scope.operationuuid = responseSuccess.data.uuid;
			$scope.customernif = responseSuccess.data.name;
			$scope.isLoaded = true;
			$scope.isWaitingReview = false;
			$scope.canResend = false;
            $scope.canCancel = false;
            $scope.canSee = false;
            $scope.canValidate = false;
            $scope.canFinalize = false;
            $scope.canViewActa = false;
            $scope.canResendVideoAccess = false;
			if( $scope.state === 0 || $scope.state === 21){
                $scope.canResendVideoAccess = true;
				$scope.canValidate = true;
				$scope.isWaitingReview = true;
			}
				
            if( $scope.state === 22 || $scope.state === 23){
                $scope.canSee = true;
                
            }
			if( $scope.state === 0 || $scope.state == 1)
				$scope.canResend = true;
			if( $scope.state == 0 || $scope.state == 1)
				$scope.canCancel = true;
			if( $scope.state == 2 || $scope.state == 12 ){
				$scope.canViewActa = true;
				$scope.canFinalize = true;
			}
			if( $scope.state == 40 || $scope.state == 50 || $scope.state == 22){    //provisional
				$scope.canViewActa = true;
			}
		
        },
        function (responseError) {
          console.log('ERROR: ', responseError.data);
        }
      )
 	}

 	$scope.closeOperationDetails = function () {
 		$scope.isLoaded = false;
 		$scope.isLoadedList = true;
 	}

    $rootScope.$on("CallCloseDetails", function(){
        $scope.closeOperationDetails();
     });

    $rootScope.$on("CallRefresh", function(){
        $scope.refreshFilterTable();
     });
    
    $scope.openWindow = function () {

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'modal-document-acta.html',
          controller: 'docActaController',
          windowClass: 'dialogGeneral acta-modal-window',
          resolve: {
        	  operationuuid: function () {
          		  return operationSelecteduuid;
          	  }
        }
        });
    }
    
    
    $scope.downloadActaGlobal = function () {

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'modal-document-acta.html',
          controller: 'docActaGlobalController',
          windowClass: 'dialogGeneral acta-modal-window',
          resolve: {
        	  multipleUuid: function () {
          		  return $scope.multipleUuid;
          	  }
        }
        });
    }

    
    $scope.finalizeOp = function () {

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'sm',
          templateUrl: 'modal-finalize.html',
          controller: 'validateOpController',
          windowClass: 'dialogGeneral ',
          resolve: {
        	  operationuuid: function () {
          		  return operationSelecteduuid;
          	  }
        }
        });
    }    
    
    $scope.validateVideo = function() {
        $state.go('videoTable', { openVideoDetails : ''+$scope.operationuuid, videoState: ''+$scope.state});
    }

    $scope.seeVideo = function() {
        $state.go('videoTable', { openVideoDetails : ''+$scope.operationuuid, videoState: ''+$scope.state});
    }

    
    $scope.cancelOp = function () {

    	$http({
			  method: 'GET',
			  url: 'services/operations/cancelop/'+$scope.operationuuid,
			}).then(function successCallback(response) {
			    console.log(response);
			    $rootScope.$broadcast('callSuccess', 'Operación cancelada');
			    $scope.isWaitingReview = false;
				$scope.canResend = false;
	            $scope.canCancel = false;
	            $scope.canSee = false;
	            $scope.canValidate = false;
	            $scope.canFinalize = false;
	            $scope.canViewActa = false;
                $scope.canResendVideoAccess = false;
			  }, function errorCallback(responseError) {
	            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: cancelar operación)');
			  });

    }   

    $scope.reviewVideo = function () {
        $state.go('videoTable', { openVideoDetails : ''+$scope.operationuuid, videoState: ''+$scope.state});
    }

    $scope.resendSmsAccess = function() {
        operationServiceCallerESign.resendSMSAccess($scope.operationuuid).then(function(responseSuccess) {
            $rootScope.$broadcast('callSuccess', 'SMS ENVIADO CORRECTAMENTE');
        }).catch(function(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: reenvio de notificación sms acceso)');
        })
    } 

    $scope.resendSmsVideoAccess = function() {
        operationServiceCallerESign.resendSMSVideoAccess($scope.operationuuid).then(function(responseSuccess) {
            $rootScope.$broadcast('callSuccess', 'SMS ENVIADO CORRECTAMENTE');
        }).catch(function(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: reenvio de notificación sms acceso video)');
        })
    }    
   
    $scope.resend = function () {

    	$http({
			  method: 'GET',
			  url: 'services/operations/resendnotification/'+$scope.operationuuid,
			}).then(function successCallback(response) {
			    console.log(response);
			    $rootScope.$broadcast('callSuccess', 'NOTIFICACION ENVIADA CORRECTAMENTE');

			  }, function errorCallback(responseError) {
	            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: reenvio de notificación)');
			  });
    }       
    
    $scope.convertState = function( stateNum ){
    	var stateName = "";
    	if( stateNum == 0 )
    		stateName = 'PENDIENTE';
    	if( stateNum == 1 )
    		stateName = 'ACCESO';
    	if( stateNum == 2 )
    		stateName = 'FIRMADA';
    	if( stateNum == 3 )
    		stateName = 'CADUCADA';
    	if( stateNum == 12 )
    		stateName = 'FIRMA PARCIAL';
    	if( stateNum == 91 )
    		stateName = 'BLOQUEADA';
    	if( stateNum == 99 )
    		stateName = 'CANCELADA';
    	if( stateNum == 21 )
    		stateName = 'VIDEOID: ACCESO';
    	if( stateNum == 22 )
    		stateName = 'VIDEOID: VERIFICADO';
    	if( stateNum == 23 )
    		stateName = 'VIDEOID: RECHAZADO';
       	if( stateNum == 20 )
    		stateName = 'FIRMADO SIN VERIFICAR';
       	if( stateNum == 40 )
    		stateName = 'VALIDADA';
       	if( stateNum == 50 )
    		stateName = 'DIGITALIZADA';
   	
       	return stateName;
    	
    }

    function setRightDatesValues(filterScope) {
        
        if(angular.isDefined(filterScope.from)) filterScope.from = new Date(filterScope.from)

        if(angular.isDefined(filterScope.to)) filterScope.to = new Date(filterScope.to)

    }

    // construct the json object for show the operation grouped
    function listOperationGrouped(data) {
    	for ( var foo = 0; foo < data.length; foo++ ) {
    		
    		var last = $scope.operationsList[$scope.operationsList.length-1];
    		
    		// if the multipleUuid doesn't exist or is different to the last, add this to the array
    		if ( (last === null || last === undefined) || data[foo].multipleUuid !== last.multipleUuid ) {
    			$scope.operationsList.push({
    				creationDateF: data[foo].creationDateF,
    				operationId: data[foo].operationId,
    				multipleUuid: data[foo].multipleUuid,
    				opSigned: 0,
    				signer: 0,
    				lstSubOperation: []
    			});
    			last = $scope.operationsList[$scope.operationsList.length-1];
    		}
    		
    		// assign the new date (if it's previous)
    		if ( last.creationDateF > data[foo].creationDateF )
    			last.creationDateF = data[foo].creationDateF
    		
    		// assign the new signer to the list, and update the number of signer and operation signed
    		last.lstSubOperation.push(data[foo]);
    		last.signer++;
    		
    		if ( data[foo].state == 2 || data[foo].state == 12 ) 
    			last.opSigned++;
    	}
    }

 }]);