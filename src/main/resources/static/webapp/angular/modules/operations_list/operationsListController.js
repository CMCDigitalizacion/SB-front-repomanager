angular.module('O2DigitalSite').controller('OperationsListController', ['$scope', '$http', '$state', '$stateParams', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'operationManager', 'operationServiceCallerESign', '$timeout', '$rootScope', '$filter', '$uibModal', 'sweet', 'tokenManager', 'operationFilterServiceManager', '$q', '$interval',
 function($scope, $http, $state, $stateParams, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, operationManager, operationServiceCallerESign, $timeout, $rootScope, $filter, $uibModal, sweet, tokenManager, operationFilterServiceManager, $q, $interval){

 	console.log('In the operationsListController, the domain\' s id received is: '+ $stateParams.id);
  $rootScope.$broadcast('rootChange', 'Consultar / Operaciones de Firma')
  $scope.isLoaded        = false;
  $scope.reload          = false;
  $scope.showReloadCountdown = false;
  $scope.countDown       = 5;
  $scope.documentSelected    = null;
  $scope.urlsDocsToSign      = [];
  $scope.urlsDocsToUpload    = [];
  $scope.message = null;
  
  var fileIndex;
  var intervalToReload;
 	var operationSelectedID;
 	var operationSelecteduuid;
 	var operationSelectedMultipleUuid;

  $scope.fromdatepicker = {
    opened : false
  };

  $scope.todatepicker = {
    opened : false
  };

  if(angular.isDefined(sessionStorage.filterStateOperation)) {
    $scope.filter = JSON.parse(sessionStorage.filterStateOperation);
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
                                               .withOption('order', [[ 1, "desc" ]])
                                               .withOption('stateSave', true)
                                               .withOption('stateDuration', -1)
                                               .withOption('stateSaveCallback', function(settings, data) {
                                                  sessionStorage.setItem( 'DataTables_OperationsList', JSON.stringify(data) )
                                               })
                                               .withOption('stateLoadCallback', function(settings, data) {
                                                   return JSON.parse( sessionStorage.getItem( 'DataTables_OperationsList' ) )
                                               })
                                               .withPaginationType('simple_numbers');
  $scope.dtColumnsOperations = [
      DTColumnDefBuilder.newColumnDef(0).withClass('center-text'),
      DTColumnDefBuilder.newColumnDef(1).withClass('center-text'),
      DTColumnDefBuilder.newColumnDef(2).withClass('center-text'),
      DTColumnDefBuilder.newColumnDef(3).withClass('center-text'),
      DTColumnDefBuilder.newColumnDef(4).notVisible(),
      DTColumnDefBuilder.newColumnDef(5).notVisible(),
      DTColumnDefBuilder.newColumnDef(6).withClass('col-sm-1 center-text').renderWith(stateFormatterHtml),
      DTColumnDefBuilder.newColumnDef(7).withClass('col-sm-1 center-text').withTitle('Acciones').notSortable()

  ];

  function dateFormatterHtml (data, type, full, meta) {
      return full[7];
  }

  function stateFormatterHtml (data, type, full, meta) {
      var state = data;
      var toReturn = '';
      if (state === "0")
          toReturn = '<span>PENDIENTE</span>';
      else if (state === "1")
          toReturn = '<span>ACCESO</span>';
      else if (state === "2")
          toReturn = '<span>FIRMADA</span>';
      else if (state === "3")
          toReturn = '<span>CADUCADA</span>';
      else if (state === "4")
          toReturn = '<span>ERROR</span>';
      else if (state === "12")
          toReturn = '<span>FIRMA PARCIAL</span>';
      else if (state === "91")
          toReturn = '<span>BLOQUEADA</span>';
      else if (state === "99")
          toReturn = '<span>CANCELADA</span>';
      else if (state === "21")
          toReturn = '<span>VIDEO ID: ACCESO</span>';
      else if (state === "24")
          toReturn = '<span>VIDEO ID: PENDIENTE</span>';
      else if (state === "22")
          toReturn = '<span>VIDEO ID: VERIFICADO</span>';
      else if (state === "23")
          toReturn = '<span>VIDEO ID: RECHAZADO</span>';
      else if (state === "40")
          toReturn = '<span>VALIDADA</span>';
      else if (state === "41")
          toReturn = '<span>VALIDADA PARCIAL</span>';
      else if (state === "50")
          toReturn = '<span>DIGITALIZADA</span>';
      else if (state === "30")
          toReturn = '<span>VIDEO FIRMADA SIN VERIFICAR</span>';

      return toReturn;
  }

 	$scope.loadOperationsList = function () {

      var deferred = $q.defer();

      if($stateParams.fromNotification && !$scope.reload){
        $scope.message = $stateParams.message;
        $scope.detallesOperationFromNotification($stateParams.idOperation);
      } else {
        operationServiceCallerESign.getOperationFiltered(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), $scope.filter).then(function(responseSuccess){
            console.log('SUCCESS');
            $scope.operationsList = responseSuccess.data;
            $scope.isLoadedList = true;
            deferred.resolve();
          }, function (responseError) {
            deferred.reject();
            console.log('Error on getting the list of operation by Domain ID', responseError);
        });
      }

      return deferred.promise;
 	}

    $scope.filterTable = function (filter) {
        console.log(filter);
        var fromFormattedData = 'undefined';
        var toFormattedData   = 'undefined';

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
                operationServiceCallerESign.getOperationFiltered(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), filter).then(
                    function (responseSuccess) {
                        $scope.operationsList = responseSuccess.data;
                        sessionStorage.filterStateOperation = JSON.stringify(filter);
                        $scope.saveFilterInScope();
                    },
                    function (responseError) {

                    }
                );
            }

        }
    }

    $scope.saveFilterInScope = function() {
      if(angular.isDefined(sessionStorage.filterStateOperation)) {
        $scope.filter = JSON.parse(sessionStorage.filterStateOperation);
        if(angular.isDefined($scope.filter.from) && $scope.filter.from !== '' && !angular.isNull($scope.filter.from)){
          $scope.filter.from = new Date($scope.filter.from);
        }

        if(angular.isDefined($scope.filter.to) && $scope.filter.to !== '' && !angular.isNull($scope.filter.to)){
          $scope.filter.to = new Date($scope.filter.to);
        }
      }
    }

    $scope.refreshFilterTable = function(filter) {
      if(angular.isUndefined(filter)) filter = {}
      filter.from = undefined;
      filter.fromFormatted = undefined;
      filter.to = undefined;
      filter.toFormatted = undefined;
      filter.nif = undefined;
      filter.state = 'undefined';
      
      operationFilterServiceManager.saveDefaultFilter();
      
      operationServiceCallerESign.getOperationFiltered(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), filter).then(
          function (responseSuccess) {
              $scope.operationsList = responseSuccess.data;
          },
          function (responseError) {

          });
    }

  $scope.openFromDatePicker = function() {
    $scope.fromdatepicker.opened = true;
  }

  $scope.openToDatePicker = function() {
    $scope.todatepicker.opened = true;
  }

  $scope.$on('tokenRefreshed', function (event, message) {
     angular.forEach($scope.listDocuments, function(doc, index) {
       doc.externalURL = $scope.urlsDocsToSign[parseInt(index)].replace("{{idDomain}}", tokenManager.getDomainId()).replace("{{token}}", tokenManager.getToken());
     });
 
     angular.forEach($scope.listDocumentsToUpload, function(doc, index) {
       doc.externalURL = $scope.urlsDocsToUpload[parseInt(index)].replace("{{idDomain}}", tokenManager.getDomainId()).replace("{{token}}", tokenManager.getToken());
     });
   })
 
   $scope.detallesOperationFromNotification = function (operationUuid) {
         $scope.reload = true;
         $scope.operationuuid = operationUuid;
         operationServiceCallerESign.getOperationByUUID(tokenManager.getDomainId(), operationUuid).then(function (responseSuccess) {
           $scope.isLoadedList = false;
           console.log('SUCCESS', responseSuccess.data);
 
           //replace the {{idDomain}} and the {{token}} for the documents to SIGN.
           angular.forEach(responseSuccess.data.documents, function(doc, index) {
             $scope.urlsDocsToSign.push(angular.copy(doc.externalURL));
             doc.externalURL = doc.externalURL.replace("{{idDomain}}", tokenManager.getDomainId())
             doc.externalURL = doc.externalURL.replace("{{token}}", tokenManager.getToken())
           });
 
           //replace the {{idDomain}} and the {{token}} for the documents to UPLOAD.
           angular.forEach(responseSuccess.data.documentsToUpload, function(doc, index) {
             $scope.urlsDocsToUpload.push(doc.externalURL);
             doc.externalURL = doc.externalURL.replace("{{idDomain}}", tokenManager.getDomainId())
             doc.externalURL = doc.externalURL.replace("{{token}}", tokenManager.getToken())
           })
 
           var operationDate = angular.copy(responseSuccess.data.authPolicy.fields[0]);
           operationDate.label = 'Fecha'
           operationDate.value = responseSuccess.data.creationDateF;
 
           var stateOperation = angular.copy(responseSuccess.data.authPolicy.fields[0]);
           stateOperation.label = 'Estado'
           stateOperation.value = $scope.convertState(responseSuccess.data.state);
 
           var infos = responseSuccess.data.authPolicy.fields;
           infos.unshift(stateOperation);
           infos.unshift(operationDate);
 
           $scope.infoList              = infos;
           $scope.level                 = responseSuccess.data.level;
           $scope.operationID           = responseSuccess.data.operationId;
           $scope.state                 = responseSuccess.data.state;
           $scope.stateName             = $scope.convertState(responseSuccess.data.state);
           $scope.creationDate          = responseSuccess.data.creationDateF;
           $scope.listEvents            = responseSuccess.data.events;
           $scope.listDocumentsToUpload = responseSuccess.data.documentsToUpload;
           $scope.listNotifications     = responseSuccess.data.notifications;
           $scope.listDocuments         = responseSuccess.data.documents;
           $scope.operationuuid         = responseSuccess.data.uuid;
           $scope.customernif           = responseSuccess.data.name;
           $scope.advancedOperation     = responseSuccess.data.operationAdvancedOptions;
           $scope.canCancelAll          = true;
           $scope.isLoaded              = true;
           $scope.isWaitingReview       = false;
           $scope.canResend             = false;
           $scope.canCancel             = false;
           $scope.canSee                = false;
           $scope.canValidate           = false;
           $scope.canFinalize           = false;
           $scope.canViewActa           = false;
           $scope.canResendVideoAccess  = false;
           $scope.additionalValidation  = responseSuccess.data.authPolicy.additionalValidation;
 
           if( $scope.state === 0 || $scope.state === 21 || $scope.state === 30 ){
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
           if( $scope.state == 2 || $scope.state == 12){
             $scope.canViewActa = true;
           }
           if( $scope.state == 40 || $scope.state == 50 || $scope.state == 41 ){    //provisional
             $scope.canViewActa = true;
           }
           
         },
         function (responseError) {
           console.log('ERROR: ', responseError.data);
         }
       )
   }
 

	$scope.detallesOp = function (operationObject, isFromValidated) {

        console.log(operationObject);
        operationSelectedID = operationObject.id;
        operationSelecteduuid = operationObject.uuid;
        $scope.multipleUuid = operationObject.multipleUuid;
        $scope.operationObjectCopied = operationObject;
        $scope.reload = false;
        if(isFromValidated)
          $scope.reload = true;
        
        //operationServiceCallerESign.getOperationByID(operationObject.id).then(
        operationServiceCallerESign.getOperationByUUID(tokenManager.getDomainId(), operationObject.uuid).then(function (responseSuccess) {
          $scope.isLoadedList = false;
          console.log('SUCCESS', responseSuccess.data);

          //replace the {{idDomain}} and the {{token}} for the documents to SIGN.
          angular.forEach(responseSuccess.data.documents, function(doc, index) {
            doc.externalURL = doc.externalURL.replace("{{idDomain}}", tokenManager.getDomainId())
            doc.externalURL = doc.externalURL.replace("{{token}}", tokenManager.getToken())
          });

          //replace the {{idDomain}} and the {{token}} for the documents to UPLOAD.
          angular.forEach(responseSuccess.data.documentsToUpload, function(doc, index) {
            doc.externalURL = doc.externalURL.replace("{{idDomain}}", tokenManager.getDomainId())
            doc.externalURL = doc.externalURL.replace("{{token}}", tokenManager.getToken())
          })

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
          $scope.operationID                  = responseSuccess.data.operationId;
          $scope.state                        = responseSuccess.data.state;
          $scope.stateName                    = $scope.convertState(responseSuccess.data.state);
          $scope.creationDate                 = responseSuccess.data.creationDateF;
		      $scope.listEvents                   = responseSuccess.data.events;
          $scope.listDocumentsToUpload        = responseSuccess.data.documentsToUpload;
          $scope.listNotifications            = responseSuccess.data.notifications;
          $scope.listDocuments                = responseSuccess.data.documents;
          $scope.operationuuid                = responseSuccess.data.uuid;
          $scope.customernif                  = responseSuccess.data.name;
          $scope.advancedOperation            = responseSuccess.data.operationAdvancedOptions;
          $scope.showPButton                  = responseSuccess.data.showPButton;
          $scope.canCancelAll                 = true;
          $scope.isLoaded                     = true;
          $scope.isWaitingReview              = false;
          $scope.canResend                    = false;
          $scope.canCancel                    = false;
          $scope.canSee                       = false;
          $scope.canValidate                  = false;
          $scope.canFinalize                  = false;
          $scope.canViewActa                  = false;
          $scope.canResendVideoAccess         = false;
          $scope.additionalValidation = responseSuccess.data.authPolicy.additionalValidation;

          if( $scope.state === 0 || $scope.state === 21 || $scope.state === 30 ){
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
          if( $scope.state == 2 || $scope.state == 12){
            $scope.canViewActa = true;
          }
          if( $scope.state == 40 || $scope.state == 50 || $scope.state == 41 ){    //provisional
            $scope.canViewActa = true;
          }
		
        },
        function (responseError) {
          console.log('ERROR: ', responseError.data);
        }
      )
 	}

    $scope.sendSignedContract = function () {

        $http({
            method: 'GET',
            url: '/O2Bridge/services/pepper/sendsignedcontract/'+operationSelecteduuid
          }).then(function successCallback (responseSuccess) {
        	  $rootScope.$broadcast('callSuccess', 'Documento enviado.'); 
          }, function errorCallback (responseError) {
        	  $rootScope.$broadcast('callError', 'Ha ocurrido un problema enviando el documento.');
          });
    }

    $scope.validateOperation = function() {
    operationServiceCallerESign.validateOperation(operationSelecteduuid).then(function(responseSuccess) {
      $rootScope.$broadcast('callSuccess', 'Operación validada correctamente.');

      $scope.reload              = true;
      $scope.showReloadCountdown = true;
      $scope.canReloadOperation  = true;
      $scope.seconds             = angular.copy($scope.countDown);
      
      intervalToReload = $interval(function() {
        $scope.seconds = $scope.seconds - 1;
      }, 1000)

      $timeout(function() {
        if($scope.canReloadOperation){
          $scope.detallesOp($scope.operationObjectCopied, true);
        }
        $scope.showReloadCountdown = false; 
        $interval.cancel(intervalToReload);
      }, ($scope.countDown * 1000))

    }).catch(function(responseError) {
      $rootScope.$broadcast('callError', responseError.data.failure);
    })
  }

  $scope.dontReloadOperation = function() {
    $scope.canReloadOperation  = false;
    $scope.showReloadCountdown = false;
    $interval.cancel(intervalToReload);
  }

 	$scope.closeOperationDetails = function () {
    if($scope.reload){
      $scope.loadOperationsList().then(function(responseSuccess) {
        $scope.isLoaded = false;
      });
    } else {
      $scope.isLoaded = false;
      $scope.isLoadedList = true;
    }
    
 	}

  $scope.cancelAllOperations = function(event, documentObject, index) {
    event.preventDefault();
    event.stopPropagation();
    $scope.documentSelected = documentObject;

    var modalInstanceCancelOperations = $uibModal.open({
      animation   : true,
      size        : 'md',
      templateUrl : 'modal-cancel-all-operations.html',
      controller  : 'NotificationReplacedDocController',
      windowClass : 'dialogGeneral',
    });

    modalInstanceCancelOperations.result.then(function() {
      operationServiceCallerESign.cancelAllOperations(tokenManager.getUserIdFromToken(), $scope.operationuuid).then(function(responseSuccess) {
        $rootScope.$broadcast('removeDocumentRejectedNotification', $scope.message);
        $rootScope.$broadcast('callSuccess', 'Operaciones canceladas correctamente.');
        $scope.canCancelAll = false;
      }).catch(function(responseError) {
        $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: cancelAllOperations)');
      })
    }).catch(function() {
      
    })
  }
 
   $scope.chooseFile = function(event, documentObject, index) {
     event.preventDefault();
     event.stopPropagation();
     $scope.documentSelected = documentObject;
     fileIndex = parseInt(index);
     $("#file"+index).trigger('click');
   }
 
  $scope.file_changed = function(element) {
    if(element.files.length > 0){
      var fileToReplace = element.files[0];
      var withNotification;
      var modalInstanceSendReplacedNotification = $uibModal.open({
        animation   : true,
        size        : 'sm',
        templateUrl : 'modal-send-replaced-notification.html',
        controller  : 'NotificationReplacedDocController',
        windowClass : 'dialogGeneral',
      });

      modalInstanceSendReplacedNotification.result.then(function() {
        withNotification = true;
        $scope.replaceDocument(element.files[0], $scope.documentSelected.documentUuid, tokenManager.getUserIdFromToken(), withNotification);
      }, function() {
        $("#file"+fileIndex).val("");
      });
    }
  }
 
   $scope.replaceDocument = function(file, docUuid, idUser, withNotification) {
     operationServiceCallerESign.replaceDocument(file, docUuid, idUser, withNotification, $scope.operationuuid).then(function (responseSuccess) {
       var jsonObject                       = responseSuccess.data;
       jsonObject.documentObject            = JSON.parse(jsonObject.documentObject);
       $scope.documentSelected.documentName = jsonObject.documentObject.documentName;
       $scope.documentSelected.state        = jsonObject.documentObject.state;
       var toAppend                         = $("#pdfViewerDoc"+fileIndex);

       $("#panel-pdf-viewer-"+fileIndex).empty();
       $("#panel-pdf-viewer-"+fileIndex).append(toAppend);

       if(angular.isDefined(jsonObject.notificationSended) && jsonObject.notificationSended){
         $rootScope.$broadcast('callSuccess', 'Documento reemplazado correctamente y notificación enviada con éxito.');
       } else if(angular.isDefined(jsonObject.notificationSended) && !jsonObject.notificationSended){
         $rootScope.$broadcast('callSuccess', 'Documento reemplazado correctamente y se produjo un error al enviar la notificación.');
       } else {
         $rootScope.$broadcast('callSuccess', 'Documento reemplazado correctamente.');
       }
       
       $rootScope.$broadcast('removeDocumentRejectedNotification', $scope.message);
       $("#file"+fileIndex).val("");

     }).catch(function(responseError) {
       $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: reenvio de notificación)');
       $("#file"+fileIndex).val("");
     })
   }

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
    
    $scope.isVisor = function() {
      if(tokenManager.checkIfTokenExist() && tokenManager.getUserRole() === -2)
        return true;
      else
        return false;
    } 
    
    $scope.validateVideo = function() {
        $state.go('videoTable', { openVideoDetails : ''+$scope.operationuuid, videoState: ''+$scope.state});
    }

    $scope.seeVideo = function() {
        $state.go('viewVideoConference', { openVideoDetails : ''+$scope.operationuuid, videoState: ''+$scope.state});
    }

    
    $scope.cancelOp = function () {

      $http({
        method: 'GET',
        url: 'services/operations/cancelop/'+$scope.operationuuid,
      }).then(function successCallback(response) {
        console.log(response);
        $rootScope.$broadcast('callSuccess', 'Operación cancelada');
        $scope.isWaitingReview      = false;
        $scope.canResend            = false;
        $scope.canCancel            = false;
        $scope.canSee               = false;
        $scope.canValidate          = false;
        $scope.canFinalize          = false;
        $scope.canViewActa          = false;
        $scope.canResendVideoAccess = false;

        for (var i = $scope.operationsList.length - 1; i >= 0; i--) {
          if($scope.operationsList[i].uuid === $scope.operationuuid){
            $scope.operationsList[i].state = 99;
            break;
          }
        }

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
     	if( stateNum == 30 )
    		stateName = 'FIRMADO SIN VERIFICAR';
     	if( stateNum == 40 )
    		stateName = 'VALIDADA';
      if( stateNum == 41 )
        stateName = 'VALIDADA PARCIALMENTE';
     	if( stateNum == 50 )
    		stateName = 'DIGITALIZADA';
   	
       	return stateName;
    	
    }

 }]);

angular.module('O2DigitalSite').controller('NotificationReplacedDocController', function ($scope, $uibModalInstance) {
 
     $scope.yes = function () {
         $uibModalInstance.close();
     };
 
     $scope.no = function () {
         $uibModalInstance.dismiss();
     };
 });
 

angular.module('O2DigitalSite').controller('docActaController', function ($scope, $rootScope, $uibModalInstance, tokenManager, operationuuid) {

    console.log(operationuuid);
    $scope.documentUrl = "webapp/web/viewer.html?file=" + $rootScope.url +"services/repository/actabyoperationuuid/" + tokenManager.getDomainId() + "/" + tokenManager.getToken() + "/" + operationuuid + "#zoom=page-fit";

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

angular.module('O2DigitalSite').controller('docActaGlobalController', function ($scope, $rootScope, $uibModalInstance, tokenManager, multipleUuid) {

    console.log(multipleUuid);
    $scope.documentUrl = "webapp/web/viewer.html?file=" + $rootScope.url + "services/repository/actaGlobalbyoperationuuid/" + tokenManager.getDomainId() + "/" + tokenManager.getToken() + "/" + multipleUuid + "#zoom=page-fit";

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});