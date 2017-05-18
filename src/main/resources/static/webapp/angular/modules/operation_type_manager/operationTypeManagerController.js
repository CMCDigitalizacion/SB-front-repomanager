const TYPOLOGY_PHRASE = "PHRASE";
const TYPOLOGY_CHECK = "CHECK";

angular.module('O2DigitalSite').controller('OperationTypeManagerController',
    ['$rootScope','$scope', '$window', '$http', '$q', '$stateParams', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'CUObject', 'TablesInstances', '$uibModal', '$state', 'operationRESTServices', 'domainRESTServices', '$timeout', 'tokenManager', '$sce', 'sweet',
    function($rootScope, $scope, $window, $http, $q, $stateParams, $compile, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, CUObject, TablesInstances, $uibModal, $state, operationRESTServices, domainRESTServices, $timeout, tokenManager, $sce, sweet){
        CUObject.setOperationTypeID($stateParams.id);

        $scope.tinymceOptions = {
            onChange: function (e) {
                // put logic here for keypress and cut/paste changes
            },
            inline: false,
            plugins: [
                "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
            ],

            toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | mybutton | customfields",
            toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
            toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",

            menubar: false,
            toolbar_items_size: 'small',
            skin: 'lightgray',
            theme: 'modern',
            language: 'es'
        };

        $scope.customlabels = [
                       {label:'Página Inicial'},
                       {label:'Página Selección Certificado'},
                       {label:'Página Acceso'},
                       {label:'Página Conformidad'},
                       {label:'Página Subida Documentos'},
                       {label:'Página Ver Contratos'},
                       {label:'Página Firmar Contratos'},
            	       {label:'Página Firmar Contratos en un paso'},
            	       {label:'Popup mostrar/firmar contrato'},
            	       {label:'Página Resumen'},
            	       {label:'Página Resumen Alternativa'},
            	       {label:'Página Verificación'},
                       {label:'Diálogo Vídeo Identificación'},
                       {label:'Página Vídeo Identificación'},
                       {label:'Diálogo Videoconferencia'},                       
                       {label:'Página Videoconferencia'},
                       {label:'Página Fima Masiva'},
                       {label:'Rechazar operación'},                       
                       {label:'Encuesta'},
                       {label:'Mensajes de información'}
                   ];

    $rootScope.languages = [
                	       {name: 'Castellano', isocode : 'es-es', urlimg : ''},
                	       {name: 'English', isocode : 'en-en', urlimg : ''}
                	   ];

    $scope.currentlabel = 'Página Inicial';
    $rootScope.currentlanguage = 'es-es';

    $scope.dtOptionsQuestions = DTOptionsBuilder.newOptions().withOption('ordering', false).
	                                                             withOption('searching', false).
	                                                             withOption('lengthChange', false).
	                                                             withOption('info', false).
	                                                             withOption('paging', false);
	   $scope.dtColumnsQuestions = [
	       DTColumnDefBuilder.newColumnDef(0).notSortable(),
	       DTColumnDefBuilder.newColumnDef(1).notSortable(),
	       DTColumnDefBuilder.newColumnDef(2).notSortable()
	   ];

	   // $scope.customize.questions = [];
	   $scope.addQuestion = function() {
	     var modalInstance = $uibModal.open({
	       animation: true,
	       size: 'lg',
	       templateUrl: 'modalAddQuestions.html',
	       controller: 'AddQuestionModal',
	       windowClass: 'dialogGeneral',
	       resolve : {
	         questionObject : function() {
	             return undefined;
	         }
	       }
	     });


	     modalInstance.result.then(
	       function(success) { // called by close
	         // if(angular.isUndefined($scope.customize.questions)){
	         //   $scope.customize.questions = [];
	         // }
	         $scope.customize.questions.push(success);
	       },
	       function(error) { // called by dismiss

	       }
	     );
	   }

	   $scope.editQuestion = function(index) {
       var qo = angular.copy($scope.customize.questions[index]);
	     var modalInstance = $uibModal.open({
	       animation: true,
	       size: 'lg',
	       templateUrl: 'modalAddQuestions.html',
	       controller: 'AddQuestionModal',
	       windowClass: 'dialogGeneral',
	       resolve : {
	         questionObject : function() {
	             return qo;
	         }
	       }
	     });

	     modalInstance.result.then(
	       function(success) { // called by close
	         $scope.customize.questions.splice(index, 1, success);
	       },
	       function(error) { // called by dismiss

	       }
	     );
	   }

	   $scope.removeQuestion = function(index) {
	     $scope.customize.questions.splice(index, 1);
	   }

    $scope.isDoc = true;

    $scope.setAdvancedOptionsTab = function() {
        resetTabs();
        $scope.isAdvanced = true;
    }

    $scope.setDocTab = function () {
        resetTabs();
        $scope.isDoc = true;
    }

    $scope.setGeneralTab = function () {
        resetTabs();
        $scope.isGeneral = true;
    }

    $scope.setConditionTab = function() {
        resetTabs();
        $scope.isCondition = true;
    }

    $scope.setFieldTab = function() {
        resetTabs();
        $scope.isFields = true;
    }

    $scope.setLimitsTab = function() {
        resetTabs();
        $scope.isLimits = true;
    }

    $scope.setPlantillaTab = function() {
        resetTabs();
        $scope.isPlantilla = true;
    }

    $scope.setRemindersTab = function() {
        resetTabs();
        $scope.isReminders = true;
    }

    $scope.setTemplateTab = function() {
        resetTabs();
        $scope.isTemplate = true;
    }

    $scope.setMultilevelTab = function() {
        resetTabs();
        $scope.isMultilevel = true;
    }

    function resetTabs(){
        $scope.isGeneral    = false;
        $scope.isCondition  = false;
        $scope.isTemplate   = false;
        $scope.isReminders  = false;
        $scope.isFields     = false;
        $scope.isPlantilla  = false;
        $scope.isLimits     = false;
        $scope.isDoc        = false;
        $scope.isMultilevel = false;
        $scope.isAdvanced   = false;
    }

    $scope.templateListObject = {}

    $scope.modified = false;
	$scope.policyHasBeenSaved = true;
    $scope.isnew = false;

    var deferredDocsTypeToSign;
    var deferredDocsTypeToUpload;
    var deferredCondType;
    var deferredAuth;
    var deferredLimits;
    var deferredNotifications;
    var deferredIdentifierArray;
    var deferredAdvancedOptions;
    var deferredNotificationsTypeArray;
    var deferredSignaturesTypeArray;
    var deferredGeneralInfoOperation;
    var deferredRemindersTypeArray;
    var deferredCustomMessages;
    var deferredReminders;
    var deferredTemplate;
    var deferredActionArray;

    $scope.docsTypeToSign = {};
    $scope.docsTypeToUpload = {};
    $scope.reminderList = {};
    $scope.dtInstanceDocsSign = {};
    $scope.dtInstanceDocsUpload = {};
    $scope.dtInstanceReminders = {};


    $scope.dtInstanceDocsSignCallback = dtInstanceDocsSignCallback;
    $scope.dtInstanceDocsUploadCallback = dtInstanceDocsUploadCallback;
    $scope.dtInstanceLimitCallback = dtInstanceLimitCallback;
    $scope.dtInstanceConditionCallback = dtInstanceConditionCallback;
    $scope.dtInstanceNotificationsCallback = dtInstanceNotificationsCallback;
    $scope.dtInstanceRemindersCallback = dtInstanceRemindersCallback;

    $scope.condType = {};
    $scope.dtInstanceCondition;

    $scope.auth;
    $scope.authRetrieved = {};
    $scope.authfields = [];
    $scope.dtInstanceAuth = {};

    $scope.limits = [];
    $scope.dtInstanceLimit = {};

    $scope.notifications = [];
    $scope.dtInstanceNotifications = {};

    $scope.authField = {};
    $scope.additionalaction = {};

    $scope.signlevels = {};
    $scope.doctoSignArray = [];

    $scope.signatureTypes = [];

    $scope.addAuth = function (authField) {
        $scope.authfields.push(authField);
    }

    function dtInstanceRemindersCallback (dtInstance) {
        $scope.dtInstanceReminders = dtInstance;
    }

    function dtInstanceDocsSignCallback(dtInstance) {
        $scope.dtInstanceDocsSign = dtInstance;
    }

    function dtInstanceDocsUploadCallback(dtInstance){
        $scope.dtInstanceDocsUpload = dtInstance;
    }

    function dtInstanceLimitCallback(dtInstance){
        $scope.dtInstanceLimit = dtInstance;
        deferredLimits.resolve();
    }

    function dtInstanceConditionCallback(dtInstanceCond){
        $scope.dtInstanceCondition = dtInstanceCond;
    }

    function dtInstanceNotificationsCallback(dtInstance){
        $scope.dtInstanceNotifications = dtInstance;
        deferredNotifications.resolve();
    }


    /**
        Function used to make unique all the checkboxes of the Auth tab.
    **/
    $scope.deselectOther = function (allOpt, OptSelected, formAuthOpt) {
    	var name = OptSelected.$name;

        if($scope.formAuthOpt.acceso.$name !== name && allOpt.acceso === 'ACCESS'){
            $scope.authOpt.acceso = '';
        }
        else if($scope.formAuthOpt.firma.$name !== name && allOpt.firma === 'SIGN'){
            $scope.authOpt.firma = '';
        }
        else if($scope.formAuthOpt.juntos.$name !== name && allOpt.juntos === 'BOTH'){
            $scope.authOpt.juntos = '';
        }
        else if($scope.formAuthOpt.separados.$name !== name && allOpt.separados === 'SEPARATES'){
            $scope.authOpt.separados = '';
        }
        else if($scope.formAuthOpt.accesoCert.$name !== name && allOpt.accesoCert === 'ACCESSANDCERT'){
            $scope.authOpt.accesoCert = '';
        }
        else if($scope.formAuthOpt.noOne.$name !== name && allOpt.noOne === 'NONE'){
            $scope.authOpt.noOne = '';
        }
        else if($scope.formAuthOpt.accesoVideo.$name !== name && allOpt.accesoVideo === 'ACCESSANDVIDEO'){
            $scope.authOpt.accesoVideo = '';
        }

        if(OptSelected.$viewValue==false){
        	formAuthOpt.$dirty=false;
        }
        else{
        	formAuthOpt.$dirty=true;
        }
    }



    $scope.fillTables = function(){

        var getRemindersTypeArray = function () {

            deferredRemindersTypeArray = $q.defer();
            operationRESTServices.getRemindersType().then(
                function (responseSuccess) {
                    var responseResolved = {}
                    responseResolved.status = responseSuccess.status;
                    responseResolved.data = responseSuccess.data;
                    deferredRemindersTypeArray.resolve(responseResolved);
                },
                function (responseError) {
                     var responseRejected = {}
                    responseRejected.status = responseError.status;
                    responseRejected.data = responseError.data;
                    responseRejected.from = "Getting the array of reminder's type."
                    deferredRemindersTypeArray.reject(responseRejected);
                }
            )

            return deferredRemindersTypeArray.promise;
        }

        var getCustomMessagesObject = function () {
        	deferredCustomMessages = $q.defer();

        	operationRESTServices.getLanguages().then(
                    function (responseSuccess) {
                        var responseResolved = {}
                        responseResolved.status = responseSuccess.status;
                        responseResolved.data = responseSuccess.data;
                        $rootScope.languages = responseSuccess.data;
                        deferredCustomMessages.resolve(responseResolved);
                    },
                    function (responseError) {
                         var responseRejected = {}
                        responseRejected.status = responseError.status;
                        responseRejected.data = responseError.data;
                        responseRejected.from = "Getting the languages."
                        deferredCustomMessages.reject(responseRejected);
                    }
            );

        	operationRESTServices.getCustomLanguageMessages($stateParams.id, 'es-es').then(
                function (responseSuccess) {
                    var responseResolved = {}
                    responseResolved.status = responseSuccess.status;
                    responseResolved.data = responseSuccess.data;
                    $scope.customize = responseSuccess.data;
                    deferredCustomMessages.resolve(responseResolved);
                },
                function (responseError) {
                     var responseRejected = {}
                    responseRejected.status = responseError.status;
                    responseRejected.data = responseError.data;
                    responseRejected.from = "Getting the custom messages."
                    deferredCustomMessages.reject(responseRejected);
                }
            )

            return deferredCustomMessages.promise;
        }

        var getSignaturesTypeArray = function () {

            deferredSignaturesTypeArray = $q.defer();

            $http({
              method: 'GET',
              url: 'services/operationtype/listofsignaturetype'
            }).then(function successCallback (responseSuccess) {
            	var responseResolved = {}
                responseResolved.status = responseSuccess.status;
                responseResolved.data = responseSuccess.data;
                deferredSignaturesTypeArray.resolve(responseResolved);
            }, function errorCallback (responseError) {
                var responseRejected = {}
                responseRejected.status = responseError.status;
                responseRejected.data = responseError.data;
                responseRejected.from = "Getting the array of signature's type."
                deferredSignaturesTypeArray.reject(responseRejected);
            });

            return deferredSignaturesTypeArray.promise;
        }

        var getSignaturesTypeForMultipleArray = function () {

            $http({
              method: 'GET',
              url: 'services/operationtype/listofmultiplesignaturetype'
            }).then(function successCallback (responseSuccess) {
            	$scope.signatureTypes = responseSuccess.data;
            });

            return deferredSignaturesTypeArray.promise;
        }

        var getGeneralInfoOperationByID = function () {

            deferredGeneralInfoOperation = $q.defer();

            $http({
              method: 'GET',
              url: 'services/operationtype/generalinfo/'+$stateParams.id
            }).then(function successCallback (responseSuccess) {
                var responseResolved = {}
                responseResolved.status = responseSuccess.status;
                responseResolved.data = responseSuccess.data;
                deferredGeneralInfoOperation.resolve(responseResolved);
            }, function errorCallback (responseError) {
                var responseRejected = {}
                responseRejected.status = responseError.status;
                responseRejected.data = responseError.data;
                responseRejected.from = "Getting the general information about the operation type"

                deferredGeneralInfoOperation.reject(responseRejected);
            });

            return deferredGeneralInfoOperation.promise;
        }

        var getNotificationsTypeArray = function () {

            deferredNotificationsTypeArray = $q.defer();

            $http({
              method: 'GET',
              url: 'services/notifications/typearray'
            }).then(function successCallback (responseSuccess) {
                var responseResolved = {}
                responseResolved.status = responseSuccess.status;
                responseResolved.data = responseSuccess.data;
                deferredNotificationsTypeArray.resolve(responseResolved);
            }, function errorCallback (responseError) {
                var responseRejected = {}
                responseRejected.status = responseError.status;
                responseRejected.data = responseError.data;
                responseRejected.from = "Getting the array of signature's type."
                deferredNotificationsTypeArray.reject(responseRejected);
            });

            return deferredNotificationsTypeArray.promise;
        }

        var fillTemplateTable = function () {
            deferredTemplate = $q.defer();

            $scope.dtOptionsTemplate = DTOptionsBuilder.newOptions()
                .withOption('createdRow', createdRow)
                .withOption('columnDefs', [{'targets':[0,2], sortable:false}])
                .withOption('order', [[ 1, "desc" ]])
                .withOption('ajax', function(data, callback, settings) {
                    operationRESTServices.getActaTemplateByDomainID(tokenManager.getDomainId(), $stateParams.id).then(
                        function successCallback(responseSuccess) {
                            callback(responseSuccess.data);
                            // templateListObject = responseSuccess.data;
                            var responseResolved = {}
                            responseResolved.status = responseSuccess.status;
                            responseResolved.data = responseSuccess.data;
                            deferredTemplate.resolve(responseResolved);
                        }, function errorCallback(responseError) {
                            var responseRejected = {}
                            responseRejected.status = responseError.status;
                            responseRejected.data = responseError.data;
                            deferredTemplate.reject(responseRejected);
                      });
                })
                .withPaginationType('simple_numbers');

                $scope.dtColumnsTemplate = [
                    DTColumnBuilder.newColumn(null)   .withTitle('')         .withClass('col-sm-1 center-text').renderWith(checkboxesTemplateHtml),
                    DTColumnBuilder.newColumn('name') .withTitle('Nombre')   .withClass('col-sm-9 center-text'),
                    DTColumnBuilder.newColumn(null)   .withTitle('Acciones') .withClass('col-sm-2 center-text').renderWith(templateActionsHtml)
                ];

                function templateActionsHtml (data, type, full, meta) {
                    if(data.exists)
                        return '<span ng-click="showActa(templateListObject['+ data.id +'])" class="glyphicon glyphicon-eye-open pointer-span"></span>';
                    else
                        return '<span class="glyphicon glyphicon-warning-sign" title="El fichero ' + data.name + ' no existe"></span>';
                }

                function checkboxesTemplateHtml (data, type, full, meta) {
                    $scope.templateListObject[data.id] = full;
                    return '<input type="checkbox" ng-model="templateListObject[' + data.id + '].used" ng-click="checkTemplate(templateListObject['+ data.id +'])">';
                }

                return deferredTemplate.promise;

        }

        var fillRemindersTable = function () {
            deferredReminders = $q.defer();

            $scope.dtOptionsReminders = DTOptionsBuilder.newOptions()
                .withOption('createdRow', createdRow)
                .withOption('ajax', function(data, callback, settings) {
                    operationRESTServices.getRemindersList($stateParams.id).then(
                        function successCallback(responseSuccess) {
                            callback(responseSuccess.data);
                            var responseResolved = {}
                            responseResolved.status = responseSuccess.status;
                            responseResolved.data = responseSuccess.data;
                            deferredReminders.resolve(responseResolved);
                        }, function errorCallback(responseError) {
                            var responseRejected = {}
                            responseRejected.status = responseError.status;
                            responseRejected.data = responseError.data;
                            deferredReminders.reject(responseRejected);
                      });
                })
                .withPaginationType('simple_numbers')

            $scope.dtColumnsReminders = [
                DTColumnBuilder.newColumn('reminderType')               .withTitle('Tipo de aviso'),
                DTColumnBuilder.newColumn('notificationTemplateId')     .withTitle('Tipo de plantilla'),
                DTColumnBuilder.newColumn('hoursSinceLastReminder')     .withTitle('Tiempo desde último aviso'),
                DTColumnBuilder.newColumn('hoursSinceFirstNotification').withTitle('Tiempo desde la notificación inicial'),
                DTColumnBuilder.newColumn(null)                         .withTitle('Acciones').notSortable().renderWith(actionRemindersHtml)
            ];

            function actionRemindersHtml(data, type, full, meta) {
                $scope.reminderList[meta.row] = full;
                return '<i class="fa fa-edit" ng-click="detallesReminder(reminderList['+ meta.row +'])"><span class="glyphicon glyphicon-edit pointer-span"></span></i>'+
                       '<i class="fa fa-edit" ng-click="deleteReminder(reminderList['+ meta.row +'])" confirm="¿Esta seguro que desea eliminar la política de recordatorio '+ data.reminderType +'?" ><span class="icon glyphicon glyphicon-trash pointer-span"></span></i>';

            }

            return deferredReminders.promise;
        }

        var fillIdentifierAuth = function () {

            deferredIdentifierArray = $q.defer();

            $http({
              method: 'GET',
              url: 'services/auth/type/listfieldsext/'+tokenManager.getDomainId()
            }).then(function successCallback (responseSuccess) {
                var responseResolved = {}
                responseResolved.status = responseSuccess.status;
                responseResolved.data = responseSuccess.data;
                deferredIdentifierArray.resolve(responseResolved);
            }, function errorCallback (responseError) {
                var responseRejected = {}
                responseRejected.status = responseError.status;
                responseRejected.data = responseError.data;
                responseRejected.from = "Getting the array of signature's type."
                deferredIdentifierArray.reject(responseRejected);
            });

            return deferredIdentifierArray.promise;
        }

        var fillAdvancedOptions = function () {

            deferredAdvancedOptions = $q.defer();

            operationRESTServices.getAdvancedOptions($stateParams.id).then(function successCallback (responseSuccess) {
                var responseResolved    = {}
                responseResolved.status = responseSuccess.status;
                responseResolved.data   = responseSuccess.data;
                deferredAdvancedOptions.resolve(responseResolved);
            }, function errorCallback (responseError) {
                var responseRejected    = {}
                responseRejected.status = responseError.status;
                responseRejected.data   = responseError.data;
                responseRejected.from   = "Getting the advanced options."
                deferredAdvancedOptions.reject(responseRejected);
            });

            return deferredAdvancedOptions.promise;
        }


        var fillActionAuth = function () {

            deferredActionArray = $q.defer();

            $http({
              method: 'GET',
              url: 'services/operationtype/listofadditionalactions'
            }).then(function successCallback (responseSuccess) {
                var responseResolved = {}
                responseResolved.status = responseSuccess.status;
                responseResolved.data = responseSuccess.data;
                CUObject.setAuthActionArrayObject(responseSuccess.data);
                deferredActionArray.resolve(responseResolved);
            }, function errorCallback (responseError) {
                var responseRejected = {}
                responseRejected.status = responseError.status;
                responseRejected.data = responseError.data;
                responseRejected.from = "Getting the array of additional action's type."
                deferredActionArray.reject(responseRejected);
            });

            return deferredActionArray.promise;
        }

        var fillDocsToSignTable = function(){

            deferredDocsTypeToSign = $q.defer();

            $scope.dtOptionsDocsSign = DTOptionsBuilder
                .newOptions()
                .withOption('createdRow', createdRow)
                .withOption('paging', false)
                .withOption('searching', false)
                .withOption('ajax', function(data, callback, settings) {
                    $http({
                      method: 'GET',
                      url: 'services/documents/type/tosign/ofoperationtype/'+$stateParams.id
                    }).then(function successCallback(responseSuccess) {
                    	CUObject.setDocumentsToSignList(responseSuccess.data);

                    	callback(responseSuccess.data);
                        var responseResolved = {}
                        responseResolved.status = responseSuccess.status;
                        responseResolved.data = responseSuccess.data;
                        deferredDocsTypeToSign.resolve(responseResolved);
                      }, function errorCallback(responseError) {
                        var responseRejected = {}
                        responseRejected.status = responseError.status;
                        responseRejected.data = responseError.data;
                        deferredDocsTypeToSign.reject(responseRejected);
                      });
                });

            $scope.dtColumnsDocsSign = [
                DTColumnBuilder.newColumn('code')             .withTitle('Referencia')        .renderWith(cutString)            .withClass('center-text'),
                DTColumnBuilder.newColumn('description')      .withTitle('Descripción')       .renderWith(cutString)            .withClass('center-text'),
                DTColumnBuilder.newColumn('name')             .withTitle('Nombre')            .renderWith(cutString)            .withClass('center-text'),
                DTColumnBuilder.newColumn('operationorsigner').withTitle('Operación/Firmante').renderWith(isOperationOrSigner)       .withClass('center-text'),
                DTColumnBuilder.newColumn('signorupload')     .withTitle('Firmar/Recoger')    .renderWith(isSignOrUpload)       .withClass('center-text'),
                DTColumnBuilder.newColumn('mandatory')        .withTitle('Requiere firma')    .renderWith(isMandatory)          .withClass('center-text'),
                DTColumnBuilder.newColumn('visiblesign')      .withTitle('Estático')          .renderWith(isSignVisible)        .withClass('center-text'),
                DTColumnBuilder.newColumn('signmultiple')     .withTitle('Firma múltiple')    .renderWith(isSignMultiple)       .withClass('center-text'),
                DTColumnBuilder.newColumn('transferible')     .withTitle('Exportable')        .renderWith(isTransferible)       .withClass('center-text'),
                DTColumnBuilder.newColumn('uploadMandatory')  .withTitle('Obligatorio')       .renderWith(isUploadMandatory)    .withClass('center-text'),
                DTColumnBuilder.newColumn('block')            .withTitle('Bloque - Orden')    .renderWith(positionFormatter)    .withClass('center-text'),
                DTColumnBuilder.newColumn(null)               .withTitle('Acciones')          .renderWith(actionsDocsSignHtml)  .withClass('center-text').notSortable(),
            ];

            function cutString(data, type, full, meta){
                if(data.length > 30){
                    var toReturn = data.substring(0, 30) + '...';
                    return toReturn;
                }
                else
                    return data;
            }

            function actionsDocsSignHtml(data, type, full, meta) {
                $scope.docsTypeToSign[meta.row] = full;
                if(full.visiblesign==0){
                	return '<i class="fa fa-edit" ng-click="detallesDoc(docsTypeToSign['+ meta.row +'])"><span class="glyphicon glyphicon-edit pointer-span"></span></i>'+
                	'<i class="fa fa-edit" ng-click="deleteDoc(docsTypeToSign['+ meta.row +'])" confirm="¿Esta seguro que desea eliminar el documento con código ' + data.code + '?"><span class="icon glyphicon glyphicon-trash pointer-span"></span></i>';
                }
                else if (full.visiblesign === 1 && !full.code.startsWith('STATIC ')) {
                    return '<i class="fa fa-edit" ng-click="detallesVisiblesignDoc(docsTypeToSign['+ meta.row +'])"><span class="glyphicon glyphicon-edit pointer-span"></span></i>'+
                    '<i class="fa fa-edit" ng-click="deleteDoc(docsTypeToSign['+ meta.row +'])" confirm="¿Esta seguro que desea eliminar el documento con código ' + data.code + '?"><span class="icon glyphicon glyphicon-trash pointer-span"></span></i>';
                }
                else if (full.visiblesign === 1 && full.code.startsWith('STATIC ') && !full.exists) {
                    return '<i class="fa fa-edit"><span class="glyphicon glyphicon-warning-sign" title="El fichero ' + full.code + ' no existe"></span></i>'+
                    '<i class="fa fa-edit" ng-click="detallesVisiblesignDoc(docsTypeToSign['+ meta.row +'])"><span class="icon glyphicon glyphicon-edit pointer-span"></span></i>'+
                    '<i class="fa fa-edit" ng-click="deleteDoc(docsTypeToSign['+ meta.row +'])" confirm="¿Esta seguro que desea eliminar el documento con código ' + data.code + '?"><span class="icon glyphicon glyphicon-trash pointer-span"></span></i>';
                }
                else if (full.visiblesign === 1 && full.code.startsWith('STATIC ') && full.exists) {
                    return '<i class="fa fa-edit" ng-click="showStaticDocModal(docsTypeToSign['+ meta.row +'])"><span class="glyphicon glyphicon-eye-open pointer-span"></span></i>'+
                    '<i class="fa fa-edit" ng-click="detallesVisiblesignDoc(docsTypeToSign['+ meta.row +'])"><span class="icon glyphicon glyphicon-edit pointer-span"></span></i>'+
                    '<i class="fa fa-edit" ng-click="deleteDoc(docsTypeToSign['+ meta.row +'])" confirm="¿Esta seguro que desea eliminar el documento con código ' + data.code + '?"><span class="icon glyphicon glyphicon-trash pointer-span"></span></i>';
                }

            }



            function isSignMultiple (data, type, full, meta) {
                if (full.signmultiple === 0)
                    return '<span>No</span>';
                return '<span>Si</span>';
            }

            function isTransferible (data, type, full, meta) {
                if (full.transferible === 0)
                    return '<span>No</span>';
                return '<span>Si</span>';
            }

            function isUploadMandatory (data, type, full, meta) {
                if (angular.isUndefined(full.uploadMandatory) || full.uploadMandatory === 0)
                    return '<span>No</span>';
                return '<span>Si</span>';
            }

            function isMandatory (data, type, full, meta) {
                if (full.mandatory === 0)
                    return '<span>No</span>';
                else if (full.mandatory === 1)
                    return '<span>Si</span>';
                else if(full.mandatory === 2)
                    return '<span>Solo lectura</span>';
            }

            function isSignOrUpload (data, type, full, meta) {
                if(full.signorupload === 0)
                    return '<span>Firmar</span>';
                return '<span>Recoger</span>';
            }

            function isSignVisible (data, type, full, meta) {
                if(full.visiblesign === 1 && full.code.startsWith('STATIC '))
                    return '<span>Si</span>';
                return '<span>No</span>';
            }

            function positionFormatter(data, type, full, meta) {
                return '<span>' + full.block + ' - ' + full.order + '</span>';
            }
            
            function isOperationOrSigner(data, type, full, meta) {
            	if (full.operationorsigner === 1)
            		return '<span>Firmante</span>';
            	return '<span>Operación</span>';
            }

            return deferredDocsTypeToSign.promise;
        }

        var fillDocsToUploadTable = function () {

            deferredDocsTypeToUpload = $q.defer();

            $scope.dtOptionsDocsUpload = DTOptionsBuilder
            .newOptions()
            .withOption('createdRow', createdRow)
            .withOption('paging', false)
            .withOption('searching', false)
            .withOption('ajax', function(data, callback, settings) {
                $http({
                  method: 'GET',
                  url: 'services/documents/type/toupload/ofoperationtype/'+$stateParams.id
                }).then(function successCallback(responseSuccess) {
                	CUObject.setDocumentsToUploadList(responseSuccess.data);

                	callback(responseSuccess.data);
                    var responseResolved = {}
                    responseResolved.status = responseSuccess.status;
                    responseResolved.data = responseSuccess.data;
                    deferredDocsTypeToUpload.resolve(responseResolved);
                  }, function errorCallback(responseError) {
                    var responseRejected = {}
                    responseRejected.status = responseError.status;
                    responseRejected.data = responseError.data;
                    responseRejected.from = 'Tabla Documentos para Recoger';
                    deferredDocsTypeToUpload.reject(responseRejected);
                  });
            });

            $scope.dtColumnsDocsUpload = [
                DTColumnBuilder.newColumn('code')         .withTitle('Código')        .withClass('center-text'),
                DTColumnBuilder.newColumn('description')  .withTitle('Descripción')   .withClass('center-text'),
                DTColumnBuilder.newColumn('name')         .withTitle('Nombre')        .withClass('center-text'),
                DTColumnBuilder.newColumn('mandatory')    .withTitle('Obligatorio')   .withClass('center-text')   .renderWith(isMandatory),
                DTColumnBuilder.newColumn('signorupload') .withTitle('Firmar/Recoger').withClass('center-text')   .renderWith(isSignOrUpload),
                DTColumnBuilder.newColumn(null)           .withTitle('Acciones')      .withClass('center-text')   .renderWith(actionsDocsUploadHtml).notSortable()
            ];

            function actionsDocsUploadHtml(data, type, full, meta) {
                $scope.docsTypeToUpload[meta.row] = full;
                return '<i class="fa fa-edit" ng-click="detallesDoc(docsTypeToUpload['+ meta.row +'])"><span class="glyphicon glyphicon-edit pointer-span"></span></i>'+
                       '<i class="fa fa-edit" ng-click="deleteDoc(docsTypeToUpload['+ meta.row +'])"  confirm="¿Esta seguro que desea eliminar el documento con código ' + data.code + '?"><span class="icon glyphicon glyphicon-trash pointer-span"></span></i>';
            }

            function isMandatory (data, type, full, meta) {
                if (full.mandatory === 0)
                    return '<span>No</span>'

                return '<span>Si</span>'
            }

            function isSignOrUpload (data, type, full, meta) {
                if(full.signorupload === 0)
                    return '<span>Firmar</span>'

                return '<span>Recoger</span>'

            }

            return deferredDocsTypeToUpload.promise;
        }

        var fillAuthTable = function(){

            deferredAuth = $q.defer();

            $scope.dtOptionsAuth = DTOptionsBuilder.newOptions().withPaginationType('simple_numbers');
            $scope.dtColumnsAuth = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5),
                DTColumnDefBuilder.newColumnDef(6),
                DTColumnDefBuilder.newColumnDef(7).renderWith(additionalactionsFormatterHtml),
                DTColumnDefBuilder.newColumnDef(8).withTitle('Acciones').notSortable()
            ];

            function additionalactionsFormatterHtml (data, type, full, meta) {
                var stringLabel='';
                if(data!=undefined && data!==''){

                	var actionsarray = jQuery.parseJSON(data);

                	angular.forEach(actionsarray, function(item){
                        console.log(item.identifier + " " + item.step);
                        angular.forEach(CUObject.getAuthActionArrayObject(), function(method, index) {
                            if (method.action === item.identifier) {
                            	if(stringLabel!=''){
                            		stringLabel+='<br/>';
                            	}
                            	stringLabel += method.info;
                                return;
                            }
                          });
                    });


                }
                return stringLabel;

            }

            $http({
              method: 'GET',
              url: 'services/auth/metadata/ofoperationtype/'+$stateParams.id
            }).then(function successCallback(response) {
                if(response.data.length > 0){
                    $scope.auth = response.data[0];

                    CUObject.setAuthRetrieved(response.data[0]);
                    $scope.authRetrieved.additionalValidation = response.data[0].additionalValidation;
                    $scope.authRetrieved.canUpdateDocs        = response.data[0].canUpdateDocs;
                    $scope.authRetrieved.allowMasiva          = response.data[0].allowMasiva;
                    $scope.authRetrieved.certificatePolicy    = response.data[0].certificatePolicy;
                    $scope.authRetrieved.operationTypeId      = response.data[0].operationTypeId;
                    $scope.authfields                         = response.data[0].fields;
                    $scope.authOpt                            = {};
                    $scope.authOpt.certificatePolicy          = response.data[0].certificatePolicy;
                    $scope.authOpt.otpPolicy                  = response.data[0].otpPolicy;
                    $scope.authOpt.signersMultiple            = response.data[0].signersMultiple;
                    $scope.authOpt.additionalValidation       = response.data[0].additionalValidation;
                    $scope.authOpt.canUpdateDocs              = response.data[0].canUpdateDocs;
                    $scope.authOpt.allowMasiva                = response.data[0].allowMasiva;

                    //Check otpPolicy
                    if($scope.authOpt.otpPolicy===undefined || $scope.authOpt.otpPolicy === ''){
                    	$scope.authOpt.otpPolicy = "NONE";
                    }

                }
                else{
                	$scope.authOpt = {};
                	$scope.authOpt.otpPolicy = "NONE";
                }
                deferredAuth.resolve();
              }, function errorCallback(response) {

              });

            return deferredAuth.promise;
        }

        var fillLimitsTable = function(){

            deferredLimits = $q.defer();

            $scope.dtOptionsLimit = DTOptionsBuilder.newOptions().withPaginationType('simple_numbers').withOption('columnDefs', [{'targets':[2], sortable:false}]);
            $scope.dtColumnsLimit = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2).notSortable()
            ];

            $http({
              method: 'GET',
              url: 'services/limits/metadata/ofoperationstype/'+$stateParams.id
            }).then(function successCallback(response) {

                    $scope.limits = response.data;
                    $scope.limitList = response.data;
                    deferredLimits.resolve();

              }, function errorCallback(response) {
                    deferredLimits.reject()
              });

            return deferredLimits.promise;
        };

        var fillConditionTable = function(){

            deferredCondType = $q.defer();

            $scope.dtOptionsCondition = DTOptionsBuilder.newOptions().withPaginationType('simple_numbers').withOption('columnDefs',
            		[{'targets':[3], 'render':
            			function ( data, type, row ) {
	            			var stringLabel='';
	                        if(data!=undefined && data!==''){

	                        	if(data=='welcome'){
	                        		stringLabel = 'Pantalla de bienvenida';
	                        	}
	                        	else if(data=='selectCertificate'){
	                        		stringLabel = 'Pantalla de selección de certificado';
	                        	}
	                        	else if(data=='access'){
	                        		stringLabel = 'Pantalla de acceso';
	                        	}
	                        	else if(data=='conformity'){
	                        		stringLabel = 'Pantalla de datos';
	                        	}
	                        	else if(data=='requiredDocuments'){
	                        		stringLabel = 'Pantalla de documentos requeridos';
	                        	}
	                        	else if(data=='signatureDocuments'){
	                        		stringLabel = 'Pantalla de documentos de firma';
	                        	}
	                        	else if(data=='signature'){
	                        		stringLabel = 'Pantalla de firma';
	                        	}
	                        	else if(data=='resume'){
	                        		stringLabel = 'Pantalla de resumen';
	                        	}
                                else if(data=='videorecord'){
                                    stringLabel = 'Video identificación';
                                }
                                else if(data=='videoconference'){
                                    stringLabel = 'Video conferencia';
                                }
                                else if(data=='videoconferenceAdmin'){
                                    stringLabel = 'Vídeo conferencia administración';
                                }
                                else if(data=='popupvideorecord'){
                                    stringLabel = 'Dialogo Inicio Video Identificación';
                                }
                                else if(data=='popupvideoconference'){
                                    stringLabel = 'Dialogo Inicio Video conferencia';
                                }
	                        	else {
	                        		stringLabel = '';
	                        	}
	                        }
	                        return stringLabel;
                     	},
                     },
                     {'targets':[5], sortable:false}]);
            $scope.dtColumnsCondition = [
                DTColumnDefBuilder.newColumnDef(0).withClass('center-text col-sm-1'),
                DTColumnDefBuilder.newColumnDef(1).withClass('center-text'),
                DTColumnDefBuilder.newColumnDef(2).withClass('center-text'),
                DTColumnDefBuilder.newColumnDef(3).withClass('center-text').renderWith(stepsFormatterHtml),
                DTColumnDefBuilder.newColumnDef(4).withClass('center-text col-sm-1'),
                DTColumnDefBuilder.newColumnDef(5).withClass('col-sm-1')
            ];

            function stepsFormatterHtml (data, type, full, meta) {
                var stringLabel='';
                if(data!=undefined && data!==''){

                	if(data.step=='welcome'){
                		stringLabel = 'Pantalla de bienvenida';
                	}
                	else if(data.step=='selectCertificate'){
                		stringLabel = 'Pantalla de selección de certificado';
                	}
                	else if(data.step=='access'){
                		stringLabel = 'Pantalla de acceso';
                	}
                	else if(data.step=='conformity'){
                		stringLabel = 'Pantalla de datos';
                	}
                	else if(data.step=='requiredDocuments'){
                		stringLabel = 'Pantalla de documentos requeridos';
                	}
                	else if(data.step=='signatureDocuments'){
                		stringLabel = 'Pantalla de documentos de firma';
                	}
                	else if(data.step=='signature'){
                		stringLabel = 'Pantalla de firma';
                	}
                	else if(data.step=='resume'){
                		stringLabel = 'Pantalla de resumen';
                	}
                	else {
                		stringLabel = '';
                	}
                }
                return stringLabel;

            }

            $http({
              method: 'GET',
              url: 'services/conditions/metadata/ofoperationstype/'+$stateParams.id
            }).then(function successCallback(response) {

                    $scope.condType = JSON.parse(response.data.data);
                    CUObject.setConditionsList($scope.condType);
                    var objectToReturn = {};
                    objectToReturn.retrievedConditionsSuccessfully = response.data.retrievedConditionsSuccessfully;
                    deferredCondType.resolve(objectToReturn);

              }, function errorCallback(response) {
                    deferredCondType.reject()
              });


            return deferredCondType.promise;
        }

        var fillNotificationTable = function(){

            deferredNotifications = $q.defer();

            $scope.dtOptionsNotifications = DTOptionsBuilder.newOptions().withPaginationType('simple_numbers').withOption('columnDefs', [{'targets':[2], sortable:false}]);

            $scope.dtColumnsNotifications = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2).notSortable(),
            ];

            $http({
              method: 'GET',
              url: 'services/notifications/templates/ofoperationtype/'+$stateParams.id
            }).then(function successCallback(response) {

                    $scope.notifications = response.data;
                    CUObject.setNotificationArray($scope.notifications);
                    deferredNotifications.resolve();

              }, function errorCallback(response) {
                    deferredNotifications.reject()
              });

            return deferredNotifications.promise;
        }

        var getBiodocsTypeArray = function () {

        	domainRESTServices.getDomainData(tokenManager.getDomainId()).then(
                function (responseSuccess) {
                	CUObject.setBiosignDocsArray(responseSuccess.data.bioDocs);
                }
            )

        }

        var getSignLevelsOperationByID = function () {

            $http({
              method: 'GET',
              url: 'services/multiple/signlevelsdata/'+$stateParams.id
            }).then(function successCallback (responseSuccess) {
            	$scope.signlevels = responseSuccess.data;
            	var emptyArray = [];

            	//Fill tables with OPERATION TYPE data and mark coincidences
            	angular.forEach($scope.signlevels, function(signlevel, index){
            		var signatureTypesmod = angular.copy(emptyArray);
          	      	angular.forEach($scope.signatureTypes, function(signatureType, index){
	            	     //HAS SIGNLEVEL THIS SIGNATURETYPE
	            		var signlevelcontainsit = false;
	            		angular.forEach(signlevel.signatureTypes, function(signlevelin, index){
	            			if(signlevelin.label===signatureType.label){
	            				signlevelcontainsit = true;
	            			}
	            		});
	            		var signatureTypeindex = {};
	            		signatureTypeindex.label                             =signatureType.label;
	            		signatureTypeindex.selected                          =signlevelcontainsit;
	            		signatureTypesmod.push(signatureTypeindex);
	            	});
	            	$scope.signlevels[index].signatureTypes=signatureTypesmod;

	            	//Prefill docstoSignArray
	            	$scope.doctoSignArray = angular.copy(emptyArray);
	            	angular.forEach(CUObject.getDocumentsToSignList(),function(item) {
                		$scope.doctoSignArray.push(item);
                	});
	            	angular.forEach(CUObject.getDocumentsToUploadList(),function(item) {
                		$scope.doctoSignArray.push(item);
                	});

	            	var docToSignmod = angular.copy(emptyArray);
          	      	angular.forEach($scope.doctoSignArray, function(docToSign, index){
	            	    //HAS SIGNLEVEL THIS DOC
	            		var signlevelcontainsit = false;
	            		angular.forEach(signlevel.docsTypeList, function(docToSignin, index){
	            			if(docToSign.code===docToSignin.code){
	            				signlevelcontainsit = true;
	            			}
	            		});
	            		var docToSignindex = {};
	            		docToSignindex.name              = docToSign.name;
	            		docToSignindex.description       = docToSign.description;
	            		docToSignindex.code              = docToSign.code;
                        docToSignindex.mandatory         = docToSign.mandatory;
	            		docToSignindex.uploadMandatory   = docToSign.uploadMandatory;
	            		docToSignindex.signorupload      = docToSign.signorupload;
	            		docToSignindex.selected          = signlevelcontainsit;
	            		docToSignindex.operationorsigner = docToSign.operationorsigner;
	            		docToSignmod.push(docToSignindex);
	            	});
	            	$scope.signlevels[index].docsTypeList=docToSignmod;

	            	var preConditionsmod = angular.copy(emptyArray);
          	      	angular.forEach($scope.condType, function(preCondition, index){
	            	    //HAS SIGNLEVEL THIS DOC
	            		var signlevelcontainsit = false;
	            		angular.forEach(signlevel.preConditionsList, function(preConditionsin, index){
	            			if(preCondition.id===preConditionsin.id){
	            				signlevelcontainsit = true;
	            			}
	            		});
	            		var preConditionindex = {};
	            		preConditionindex.id           = preCondition.id;
	            		preConditionindex.name         = preCondition.name;
	            		preConditionindex.label        = preCondition.label;
	            		preConditionindex.url          = preCondition.url;
	            		preConditionindex.mandatory    = preCondition.mandatory;
	            		preConditionindex.order        = preCondition.order;
	            		preConditionindex.html         = preCondition.html;
	            		preConditionindex.fileHTMLPath = preCondition.fileHTMLPath;
	            		preConditionindex.selected     = signlevelcontainsit;
	            		preConditionindex.typology     = preCondition.typology;
	            		preConditionindex.phrase       = preCondition.phrase;
	            		preConditionsmod.push(preConditionindex);
	            	});
	            	$scope.signlevels[index].preConditionsList=preConditionsmod;

            	});

            }, function errorCallback (responseError) {
            	$rootScope.$broadcast('callError', "Getting the sign levels data about the operation type");
            });

            $scope.dtSignLevelSignatureOptions = DTOptionsBuilder.newOptions()
	        	.withOption('paging'    , false)
	        	.withOption('info'      , false)
	        	.withOption('ordering'  , false)
	        	.withOption('searching' , false);

            $scope.dtSignLevelSignatureColumnDefs = [
                                               DTColumnDefBuilder.newColumnDef(0).withTitle(null)           .withClass('col-sm-1 center-text'),
                                               DTColumnDefBuilder.newColumnDef(1).withTitle('Tipo de firma').withClass('center-text')
                                           ];

            $scope.dtSignLevelDocOptions = DTOptionsBuilder.newOptions()
            	.withOption('paging'    , false)
            	.withOption('info'      , false)
            	.withOption('ordering'  , false)
            	.withOption('searching' , false);

            $scope.dtSignLevelDocColumnDefs = [
                                          DTColumnDefBuilder.newColumnDef(0).withTitle(null)                  .withClass('col-xs-1 center-text'),
                                          DTColumnDefBuilder.newColumnDef(1).withTitle('Referencia')		  .withClass('col-xs-3 center-text'),
                                          DTColumnDefBuilder.newColumnDef(2).withTitle('Nombre')              .withClass('col-xs-3 center-text'),
                                          DTColumnDefBuilder.newColumnDef(3).withTitle('Firmar/Recoger')      .withClass('col-xs-2 center-text'),
                                          DTColumnDefBuilder.newColumnDef(4).withTitle('Op./Fir.')  		  .withClass('col-xs-2 center-text'),
                                          DTColumnDefBuilder.newColumnDef(5).withTitle('Obligatorio')         .withClass('col-xs-1 center-text'),
                                      ];

            function isMandatory (data, type, full, meta) {
                if (full.uploadMandatory === 0)
                    return '<span>No</span>';

                return '<span>Si</span>';
            }

            function isSignOrUpload (data, type, full, meta) {
                if(data === "FIRMAR")
                    return '<span>Firmar</span>';

                return '<span>Recoger</span>';

            }

            $scope.dtSignLevelPreconditionOptions= DTOptionsBuilder.newOptions()
        		.withOption('paging'    , false)
        		.withOption('info'      , false)
        		.withOption('ordering'  , false)
        		.withOption('searching' , false);

            $scope.dtSignLevelPreconditionColumnsDef = [
                            DTColumnDefBuilder.newColumnDef(0).withTitle(null)         .withClass('col-sm-1 center-text'),
                            DTColumnDefBuilder.newColumnDef(1).withTitle('Etiqueta')   .withClass('center-text'),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('Obligatorio').withClass('center-text'),
            ]


        }

        $scope.showActa = function(actaToShow) {

            var modalShowActa = $uibModal.open({
              animation: true,
              size: 'lg',
              templateUrl: 'modalShowActa.html',
              controller: 'ShowActaModalController',
              windowClass: 'dialogGeneral',
              resolve: {
                acta: function() {
                    return actaToShow;
                }
              }
            });

            modalShowActa.rendered.then(function() {
                var bodyHeight = $("#body").height();
                $timeout(function() {
                    $("#fileViewer").height(bodyHeight - 220);
                }, 100)
            });

        }

        $scope.showStaticDocModal = function(docToShow) {
        
            var modalShowStaticDoc = $uibModal.open({
              animation: true,
              size: 'lg',
              templateUrl: 'modalStaticDocument.html',
              controller: 'ShowStaticDocModalController',
              windowClass: 'dialogGeneral',
              resolve: {
                doc: function() {
                    return docToShow;
                }
              }
            });

            modalShowStaticDoc.rendered.then(function() {
                var bodyHeight = $("#body").height();
                $timeout(function() {
                    $("#fileViewer").height(bodyHeight - 220);
                }, 100)
            });
        }

        $scope.collapseSignLevelPanel = function(ev) {
        	var element = ev.srcElement ? ev.srcElement : ev.target;
        	var panel = element.parentNode.parentNode;
            if(!panel.hasClass('panel-collapsed')) {
        		panel.parents('.panel').find('.panel-body').slideUp();
        		panel.addClass('panel-collapsed');
        		panel.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        	} else {
        		panel.parents('.panel').find('.panel-body').slideDown();
        		panel.removeClass('panel-collapsed');
        		panel.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        	}
        }

        $q.allSettled([fillIdentifierAuth(), getNotificationsTypeArray(), getSignaturesTypeArray(), getGeneralInfoOperationByID(), getRemindersTypeArray(), fillActionAuth(), getCustomMessagesObject(),
                       fillTemplateTable(), fillDocsToSignTable(), fillDocsToUploadTable(), fillRemindersTable(), fillAuthTable(), fillConditionTable(), fillLimitsTable(), fillNotificationTable(), getSignaturesTypeForMultipleArray(), getBiodocsTypeArray(), fillAdvancedOptions()]).then(function(responseArray){
            var errorArray = [];
            var retrievedConditionsSuccessfully = true;
            console.log('All the ajax returned! Checking for some error...');
            angular.forEach(responseArray, function (response, index) {
                if (response.state === 'fulfilled') {
                    if(index === 0){
                        CUObject.setAuthIdentifierArrayObject(response.value.data);
                    } else if(index === 1){
                        CUObject.setNotificationTypeArray(response.value.data);
                    } else if(index === 2){
                        $scope.signatureType = response.value.data;
                    } else if(index === 3){
                        $scope.operation = response.value.data;
                    } else if(index === 4){
                        CUObject.setRemindersTypeArray(response.value.data);
                    } else if(index === 5){
                        CUObject.setAuthActionArrayObject(response.value.data);
                    } else if(index === 12){
                        retrievedConditionsSuccessfully = response.value.retrievedConditionsSuccessfully;
                    } else if (index === 17) {
                    	if (response.value.data.tags == null && response.value.data.tags == undefined)
                    		response.value.data.tags = [];
                        $scope.advanced = response.value.data;
                    }
                } else
                    errorArray.push(response.reason);

            })

            if (errorArray.length > 0){
                var listError = ''
                angular.forEach(errorArray, function (error, index) {
                    if(errorArray.length == 1)
                        listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
                    else if(errorArray.length -1 === index)
                        listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
                    else
                        listError = listError + error.data.failure + ' (desde: ' + error.from + ')  ---  ';
                })
                $rootScope.$broadcast('callError', listError);
            } else{
            	getSignLevelsOperationByID();

                if (retrievedConditionsSuccessfully) {
                    $rootScope.$broadcast('callSuccess', 'Cargado');
                } else
                    $rootScope.$broadcast('callSuccess', 'La operación se ha cargado correctamente PERO algunas (o todas) condiciones no se han podido recuperar correctamente.');

                $rootScope.$broadcast('rootChange', 'Administración / Configuración General / Operación '+$scope.operation.name)
            }



        });

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }
    }

    $scope.checkTemplate = function (selectedItem) {
        $scope.modified = true;
        angular.forEach($scope.templateListObject, function (element, index) {
            if(selectedItem.id !== element.id && element.used === true)
                element.used = false;
        })
    }

    $scope.saveTemplate = function () {
        var template;
        angular.forEach($scope.templateListObject, function (element, index) {
            if(element.used === true)
                template = element;
        })

        operationRESTServices.saveActaTemplateByOperationTypeID($stateParams.id, template).then(
            function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'GUARDADO');
                $scope.modified = false;
            },
            function (responseError) {
                $rootScope.$broadcast('callError', responseError.failure + ' (desde: saveTemplate');
            }
        )
    }

    $scope.saveGeneralInfo = function (operationObject, customLabelsObject) {
        console.log(operationObject);
        var operation = {}
        operation.name = operationObject.name;
        operation.signatureType = operationObject.signatureType;
        var deferredNameAndType = $q.defer();
        var deferredCustomLabels = $q.defer();

        function saveNameAndSignature(){
            operationRESTServices.modifyOperationNameAndSignatureType($stateParams.id, operation).then(function (responseSuccess) {
                deferredNameAndType.resolve(responseSuccess.status);
                // $rootScope.$broadcast('callSuccess', 'GUARDADO');
                // $rootScope.$broadcast('rootChange', 'Administración / Configuración General / Operación '+$scope.operation.name)
            }, function (responseError) {
                var responseRejected = {}
                responseRejected.status = responseError.status;
                responseRejected.data = responseError.data;
                responseRejected.from = "Getting the general information about the operation type"
                deferredNameAndType.reject(responseRejected);
                // $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveGeneralInfo)');
            })
            return deferredNameAndType.promise;
        }

        function saveCustomLabelsObject(){
            operationRESTServices.saveCustomLanguageLabels($stateParams.id, $scope.currentlanguage, customLabelsObject).then(function (responseSuccess) {
                deferredCustomLabels.resolve(responseSuccess.status);
                // $rootScope.$broadcast('callSuccess', 'GUARDADO');
                // $rootScope.$broadcast('rootChange', 'Administración / Configuración General / Operación '+$scope.operation.name)
            }, function (responseError) {
                var responseRejected = {}
                responseRejected.status = responseError.status;
                responseRejected.data = responseError.data;
                responseRejected.from = "Getting the general information about the operation type"
                deferredNameAndType.reject(responseRejected);
                deferredCustomLabels.reject(responseRejected);
                // $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveGeneralInfo)');
            })
            return deferredCustomLabels.promise;
        }

        $q.allSettled([saveNameAndSignature(), saveCustomLabelsObject()]).then(
            function (responseArray) {
                var errorArray = [];
                angular.forEach(responseArray, function (response, index) {
                    if (response.state !== 'fulfilled') errorArray.push(response.reason);
                })

                if (errorArray.length > 0){
                    var listError = ''
                    angular.forEach(errorArray, function (error, index) {
                        if(errorArray.length == 1)
                            listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
                        else if(errorArray.length -1 === index)
                            listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
                        else
                            listError = listError + error.data.failure + ' (desde: ' + error.from + ')  ---  ';
                    })
                    $rootScope.$broadcast('callError', listError);
                } else{
                    $rootScope.$broadcast('callSuccess', 'Guardado');
                    $rootScope.$broadcast('rootChange', 'Administración / Configuración General / Operación '+operation.name);
                }
            })
    }

    $scope.saveAdvancedOptions = function(advancedOptions) {
        console.log(advancedOptions);
        
        // Convert the tags string in array
        if (advancedOptions.tags.constructor === Array)
        	advancedOptions.tags = advancedOptions.tags.toString();
        
        if (advancedOptions.tags != null && advancedOptions.tags != undefined && advancedOptions.tags.length > 0) {
        	var tags = advancedOptions.tags.split(',');
            for (var foo = 0; foo < tags.length; foo++) {
            	tags[foo] = tags[foo].trim().toUpperCase();
            }
            advancedOptions.tags = tags;
        } else {
        	advancedOptions.tags = [];
        }
        
        operationRESTServices.saveAdvancedOptions($stateParams.id, advancedOptions).then(function(responseSuccess) {
             $rootScope.$broadcast('callSuccess', 'Opciones avanzadas guardadas correctamente.');
        }).catch(function(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure);
        })
    }

    $scope.saveDefaultAdvancedOptions = function() {
        operationRESTServices.saveDefaultAdvancedOptions($stateParams.id).then(function(responseSuccess) {
            $scope.advanced = responseSuccess.data;
            $rootScope.$broadcast('callSuccess', 'Opciones avanzadas restablecidas correctamente.');
        }).catch(function(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure);
        })
    }

    $scope.detallesReminder = function (reminder) {
        var reminderObject = {};
        if(!angular.isUndefined(reminder)){
            reminderObject.id = reminder.id;
            reminderObject.reminderType = reminder.reminderType;
            reminderObject.operationState = reminder.operationState;
            reminderObject.hoursSinceLastReminder = reminder.hoursSinceLastReminder;
            reminderObject.hoursSinceFirstNotification = reminder.hoursSinceFirstNotification;
            reminderObject.notificationTemplateId = reminder.notificationTemplateId;
        }

        CUObject.setReminderObject(reminderObject);
        TablesInstances.setInstanceReminderTable($scope.dtInstanceReminders);

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'modalReminder.html',
          controller: 'ReminderDialogController',
          windowClass: 'dialogGeneral'
        });
    }

    $scope.deleteReminder = function (reminder) {
    	operationRESTServices.deleteReminder($stateParams.id, reminder.id).then(
            function (responseSuccess) {
                $scope.dtInstanceReminders.reloadData();
                $rootScope.$broadcast('callSuccess', 'El aviso con id: '+reminder.id+' -- ha sido borrado correctamente.');
            },
            function (responseError) {
                $scope.dtInstanceDocsSign.reloadData();
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteReminder)');
            }
        );

    }

    $scope.detallesDoc = function(doc){
        var docObject = {};
        if(!angular.isUndefined(doc)){
        	$scope.isnew = false;
            docObject = angular.copy(doc);
        }
        else{
        	$scope.isnew = true;
        }

        CUObject.setDocObject(docObject);
        TablesInstances.setInstanceDocTableToSign($scope.dtInstanceDocsSign);
        TablesInstances.setInstanceDocTableToUpload($scope.dtInstanceDocsUpload);

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'modalDocuments.html',
          controller: 'DocDialogController',
          windowClass: 'dialogGeneral',
          resolve: {
            docSelected: function() {
                return docObject;
            }
          }
        });

        modalInstance.result.then(function(successResponse){
    		if($scope.isnew){
            	angular.forEach($scope.signlevels, function(signlevel, index){
            		var docToSignindex = {};
            		angular.copy(CUObject.getDocObject(), docToSignindex)
            		signlevel.docsTypeList.push(docToSignindex);
            	});
            }
            else{
            	angular.forEach($scope.signlevels, function(signlevel, index){
            		angular.forEach(signlevel.docsTypeList, function(docToSignin, index){
	            		if(CUObject.getDocObject().code===docToSignin.code){
                            docToSignin.name            = CUObject.getDocObject().name;
                            docToSignin.description     = CUObject.getDocObject().description;
                            docToSignin.code            = CUObject.getDocObject().code;
                            docToSignin.mandatory       = CUObject.getDocObject().mandatory;
                            docToSignin.uploadMandatory = CUObject.getDocObject().uploadMandatory;
                            docToSignin.signorupload    = CUObject.getDocObject().signorupload;
                            docToSignin.visiblesign     = CUObject.getDocObject().visiblesign;
                            docToSignin.operationorsigner = CUObject.getDocObject().operationorsigner;
	            		}
	            	});
            	});
            }});
    }

    $scope.detallesVisiblesignDoc = function(doc){

    	var docObject = {};
        if(!angular.isUndefined(doc)){
        	$scope.isnew = false;
            docObject = angular.copy(doc);
        }
        else{
        	$scope.isnew = true;
        }

        CUObject.setDocObject(docObject);
        TablesInstances.setInstanceDocTableToSign($scope.dtInstanceDocsSign);
        TablesInstances.setInstanceDocTableToUpload($scope.dtInstanceDocsUpload);

        var modalInstance = $uibModal.open({
          animation   : true,
          size        : 'lg',
          templateUrl : 'modalVisiblesingDocuments.html',
          controller  : 'VisiblesignDocDialogController',
          windowClass : 'dialogGeneral',
          resolve     : {
            docSelected: function() {
                return docObject;
            }
          }
        });

        modalInstance.result.then(
            	function(successResponse){
            		var docObject = CUObject.getDocObject();
            		if($scope.isnew){
                    	angular.forEach($scope.signlevels, function(signlevel, index){
                    		var docToSignindex             = {};
    	            		docToSignindex.name              = CUObject.getDocObject().name;
    	            		docToSignindex.description       = CUObject.getDocObject().description;
    	            		docToSignindex.code              = CUObject.getDocObject().code;
    	            		docToSignindex.mandatory         = CUObject.getDocObject().mandatory;
                            docToSignindex.uploadMandatory   = CUObject.getDocObject().uploadMandatory;
    	            		docToSignindex.signorupload      = CUObject.getDocObject().signorupload;
    	            		docToSignindex.visiblesign       = CUObject.getDocObject().visiblesign;
    	            		docToSignindex.operationorsigner = CUObject.getDocObject().operationorsigner;
    	            		docToSignindex.selected        = false;

    	            		signlevel.docsTypeList.push(docToSignindex);
                    	});
                    }
                    else{
                    	angular.forEach($scope.signlevels, function(signlevel, index){
                    		angular.forEach(signlevel.docsTypeList, function(docToSignin, index){
        	            		if(CUObject.getDocObject().code===docToSignin.code){
        	            			docToSignin.name              = CUObject.getDocObject().name;
        	            			docToSignin.description       = CUObject.getDocObject().description;
        	            			docToSignin.code              = CUObject.getDocObject().code;
                                    docToSignin.mandatory         = CUObject.getDocObject().mandatory;
        	            			docToSignin.uploadMandatory   = CUObject.getDocObject().uploadMandatory;
        	            			docToSignin.signorupload      = CUObject.getDocObject().signorupload;
        	            			docToSignin.visiblesign       = CUObject.getDocObject().visiblesign;
        	            			docToSignin.operationorsigner = CUObject.getDocObject().operationorsigner;
        	            		}
        	            	});
                    	});
                    }
            	}
            );
    }

    $scope.deleteDoc = function (document) {
    	operationRESTServices.deleteDocumentFromOperationType($stateParams.id, encodeURIComponent(document.code)).then(
            function (responseSuccess) {
                $scope.dtInstanceDocsSign.reloadData();
                $scope.dtInstanceDocsUpload.reloadData();

                angular.forEach($scope.signlevels, function(signlevel, index){
            		angular.forEach(signlevel.docsTypeList, function(docToSignin, index){
	            		if(document.code===docToSignin.code){
	            			signlevel.docsTypeList.splice(index, 1);
	            		}
	            	});
            	});
                $rootScope.$broadcast('callSuccess', document.name+' -- borrado correctamente.');
            },
            function (responseError) {
                $scope.dtInstanceDocsSign.reloadData();
                $scope.dtInstanceDocsUpload.reloadData();
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteDoc)');

            }
        );

    }

    $scope.detallesAuth = function (auth, index) {

        var authTemp = {};
        if(!angular.isUndefined(auth)){

            authTemp = angular.copy(auth);

            CUObject.setAuthIndexObject(index);
        }
        CUObject.setAuthObject(authTemp);
        CUObject.setAuthArrayObject($scope.authfields);

        TablesInstances.setInstanceAuthTable($scope.dtInstanceAuth)
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'modalAuth.html',
          controller: 'AuthDialogController',
          windowClass: 'dialogGeneral'
        });
    }

    $scope.deleteAuth = function (index, label) {
    	$scope.authfields.splice(index, 1);

	        $http({
	              method: 'POST',
	              url: 'services/auth/type/save/onlyfields/'+$stateParams.id,
	              data: JSON.stringify($scope.authfields)
	            }).then(function successCallback(response) {
	                $rootScope.$broadcast('callSuccess', 'El campo con etiqueta ' + label + ' se ha borrado correctamente.');

	              }, function errorCallback(responseError) {
	                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteAuth)');

	              });



    }

     $scope.deleteCond = function(cond){
    	 operationRESTServices.deleteCond(cond, $stateParams.id).then(
	            function (responseSuccess) {
	                angular.forEach($scope.condType, function (condition, index) {
	                    if(cond.id === condition.id) $scope.condType.splice(index, 1);
	                });

	                //RELOAD signlevel config
	                var emptyArray = [];

	            	angular.forEach($scope.signlevels, function(signlevel, index){
	            		var preConditionsmod = angular.copy(emptyArray);
	          	      	angular.forEach($scope.condType, function(preCondition, index){
		            	    var signlevelcontainsit = false;
		            		angular.forEach(signlevel.preConditionsList, function(preConditionsin, index){
		            			if(preCondition.id===preConditionsin.id){
		            				signlevelcontainsit=preConditionsin.selected;
		            			}
		            		});
		            		var preConditionindex = {};
    	            		preConditionindex.id           = preCondition.id;
    	            		preConditionindex.name         = preCondition.name;
    	            		preConditionindex.step         = preCondition.step;
    	            		preConditionindex.label        = preCondition.label;
    	            		preConditionindex.url          = preCondition.url;
    	            		preConditionindex.mandatory    = preCondition.mandatory;
    	            		preConditionindex.order        = preCondition.order;
    	            		preConditionindex.html         = preCondition.html;
    	            		preConditionindex.fileHTMLPath = preCondition.fileHTMLPath;
    	            		preConditionindex.selected     = signlevelcontainsit;
                            preConditionindex.typology     = preCondition.typology;
                            preConditionindex.phrase       = preCondition.phrase;
    	            		preConditionsmod.push(preConditionindex);

		            	});
		            	$scope.signlevels[index].preConditionsList=preConditionsmod;

	            	});

	                $rootScope.$broadcast('callSuccess', cond.label+' -- borrado correctamente.');
	            },
	            function (responseError) {
	                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteCond)');
	            }
	        );

    }

    $scope.detallesCond = function(cond){
        var condTemp = {};
        
        $scope.showInputPhrase = false;

        if(!angular.isUndefined(cond)){
            condTemp.id        = cond.id;
            condTemp.label     = cond.label;
            condTemp.mandatory = cond.mandatory;
            condTemp.name      = cond.name;
            condTemp.step      = cond.step;
            condTemp.order     = cond.order;
            condTemp.url       = cond.url;
            condTemp.html      = cond.html;
            condTemp.typology  = cond.typology;            	
            condTemp.phrase    = cond.phrase;
        }

        CUObject.setConditionsObject(condTemp);
        TablesInstances.setInstanceCondTable($scope.dtInstanceCondition)
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'modalCondition.html',
          controller: 'ConditionDialogController',
          windowClass: 'dialogGeneral'
        });

        modalInstance.result.then(
        	function(successResponse){

        		//RELOAD signlevel config
                var emptyArray = [];

            	angular.forEach($scope.signlevels, function(signlevel, index){
            		var preConditionsmod = angular.copy(emptyArray);
          	      	angular.forEach($scope.condType, function(preCondition, index){
	            	    var signlevelcontainsit = false;
	            		angular.forEach(signlevel.preConditionsList, function(preConditionsin, index){
	            			if(preCondition.id===preConditionsin.id){
	            				signlevelcontainsit=preConditionsin.selected;
	            			}
	            		});
	            		var preConditionindex = {};
	            		preConditionindex.id           = preCondition.id;
	            		preConditionindex.name         = preCondition.name;
	            		preConditionindex.step         = preCondition.step;
	            		preConditionindex.label        = preCondition.label;
	            		preConditionindex.url          = preCondition.url;
	            		preConditionindex.mandatory    = preCondition.mandatory;
	            		preConditionindex.order        = preCondition.order;
	            		preConditionindex.html         = preCondition.html;
	            		preConditionindex.fileHTMLPath = preCondition.fileHTMLPath;
	            		preConditionindex.selected     = signlevelcontainsit;
                        preConditionindex.typology     = preCondition.typology;
                        preConditionindex.phrase       = preCondition.phrase;
	            		preConditionsmod.push(preConditionindex);

	            	});
	            	$scope.signlevels[index].preConditionsList=preConditionsmod;

            	});
        	}
        );
    }

    //To show limit's detail.
    $scope.detallesLimit = function(limit, index){
        var limitTemp = {}

        //if the we need to modify the limit, we copy the entire object in order to do not work on the scope object itself.
        if(!angular.isUndefined(limit))
            limitTemp = angular.copy(limit, limitTemp);

        //we open a modal in order to modify the
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl : 'modalLimit.html',
          controller  : 'LimitDialogController',
          windowClass : 'dialogGeneral',
          resolve     : {
            limitObject: function () {
                return limitTemp;
            }
          }
        });

        modalInstance.result.then(function (objectReturned) {
            //the limit has been saved correctly.

            //if it is not new
            if(!objectReturned.isNew){
                angular.forEach($scope.limitList, function(limitObject, index) {
                    if(limitObject.id === objectReturned.limit.id){
                        $scope.limitList.splice(index, 1, objectReturned.limit)
                        return;
                    }
                })
            } else //if it is new
                $scope.limitList.push(objectReturned.limit);

        }, function (responseError) {
            if(angular.isDefined(responseError))
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: detallesLimit)');
        });
    }

    //To delete a limit object.
    $scope.deleteLimit = function (limit) {
    	operationRESTServices.deleteLimit($stateParams.id, limit.id).then(
            function (responseSuccess) {
                angular.forEach($scope.limitList, function(limitObject, index) {
                    if(limit.id === limitObject.id)
                        $scope.limitList.splice(index, 1);
                    return;
                })
                $rootScope.$broadcast('callSuccess', 'La política de límites '+limit.name+' ha sido borrada correctamente.');
            },
            function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteLimit)');
            }
        );
    }

    $scope.detallesNotification = function (not, index) {
        var notificationTemp = {}
        console.log(not);
        if (!angular.isUndefined(not)){
            notificationTemp.id               = not.id;
            notificationTemp.body             = not.body;
            notificationTemp.creationdate     = not.creationdate;
            notificationTemp.extra            = not.extra;
            notificationTemp.modificationdate = not.modificationdate;
            notificationTemp.name             = not.name;
            notificationTemp.notiftype        = not.notiftype;
            notificationTemp.operationtypeid  = not.operationtypeid;
            notificationTemp.subject          = not.subject;

        };

        CUObject.setNotificationObject(notificationTemp);
        TablesInstances.setInstanceNotificationTable($scope.dtInstanceNotifications);

         var modalInstance = $uibModal.open({
          animation   : true,
          size        : 'lg',
          templateUrl : 'modalNotification.html',
          controller  : 'NotificationDialogController',
          resolve     : {
            notificationsList: function () {
              return $scope.notifications;
            }
          },
          windowClass : 'dialogGeneral'
        });
    }

    $scope.deleteNotification = function (notification, index) {
    		operationRESTServices.deleteNotificationFromOperationType(tokenManager.getDomainId(), notification.id).then(
	            function (responseSuccess) {
	                angular.forEach($scope.notifications, function (not, index) {
	                    if(notification.id === not.id) $scope.notifications.splice(index, 1);
	                })
	                $rootScope.$broadcast('callSuccess', notification.notiftype+' -- borrado correctamente.');
	            },
	            function (responseError) {
	                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteNotification)');

	            }
	        );

    }

    $scope.saveAuthOpt = function (authOpt) {
        if (authOpt === undefined) {
            authOpt = {};
        }

        authOpt.operationTypeId = $scope.authRetrieved.operationTypeId;
        authOpt.fields = $scope.authfields;

        var arrayOfAuths = [];
        arrayOfAuths.push(authOpt);

        $http({
          method: 'POST',
          url: 'services/auth/type/save/'+$stateParams.id,
          data: JSON.stringify(arrayOfAuths)
        }).then(function successCallback(response) {
            CUObject.setAuthRetrieved($scope.auth);
            $scope.formCertificatePolicy.$setPristine();
            $scope.formAuthOpt.$setPristine();
            $rootScope.$broadcast('callSuccess', 'GUARDADO');

          }, function errorCallback(responseError) {
            CUObject.setAuthRetrieved($scope.auth);
            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveAuthOpt)');

          });

    }

    $scope.addSignLevelPanel = function () {
    	var newSignLevel = {};
    	newSignLevel.levelOrder        = $scope.signlevels.length + 1;
    	newSignLevel.signatureTypes    = [];
    	newSignLevel.docsTypeList      = [];
    	newSignLevel.preConditionsList = [];

    	var emptyArray = [];
    	var signatureTypesmod = angular.copy(emptyArray);
	      	angular.forEach($scope.signatureTypes, function(signatureType, index){
    	    var signatureTypeindex      = {};
    		signatureTypeindex.label    = signatureType.label;
    		signatureTypeindex.selected = false;
    		signatureTypesmod.push(signatureTypeindex);
    	});
	    newSignLevel.signatureTypes=signatureTypesmod;

	    //Prefill docstoSignArray
    	$scope.doctoSignArray = angular.copy(emptyArray);
    	angular.forEach(CUObject.getDocumentsToSignList(),function(item) {
    		$scope.doctoSignArray.push(item);
    	});
    	angular.forEach(CUObject.getDocumentsToUploadList(),function(item) {
    		$scope.doctoSignArray.push(item);
    	});

    	var docToSignmod = angular.copy(emptyArray);
	      	angular.forEach($scope.doctoSignArray, function(docToSign, index){
    	    var docToSignindex              = {};
    		docToSignindex.name             = docToSign.name;
    		docToSignindex.description      = docToSign.description;
    		docToSignindex.code             = docToSign.code;
            docToSignindex.mandatory        = docToSign.mandatory;
    		docToSignindex.uploadMandatory  = docToSign.uploadMandatory;
    		docToSignindex.signorupload     = docToSign.signorupload;
    		docToSignindex.selected         = false;
    		docToSignindex.operationorsigner = docToSign.operationorsigner;
    		docToSignmod.push(docToSignindex);
    	});
	    newSignLevel.docsTypeList=docToSignmod;

    	var preConditionsmod = angular.copy(emptyArray);
	      	angular.forEach($scope.condType, function(preCondition, index){
    	    var preConditionindex          = {};
    		preConditionindex.id           = preCondition.id;
    		preConditionindex.name         = preCondition.name;
    		preConditionindex.label        = preCondition.label;
    		preConditionindex.url          = preCondition.url;
    		preConditionindex.mandatory    = preCondition.mandatory;
    		preConditionindex.order        = preCondition.order;
    		preConditionindex.html         = preCondition.html;
    		preConditionindex.fileHTMLPath = preCondition.fileHTMLPath;
    		preConditionindex.selected     = false;
            preConditionindex.typology     = preCondition.typology;
            preConditionindex.phrase       = preCondition.phrase;
    		preConditionsmod.push(preConditionindex);
    	});
	    newSignLevel.preConditionsList=preConditionsmod;

    	$scope.signlevels.push(newSignLevel);
    }


    $scope.deleteSignLevelPanel = function (signlevel) {

    	//alert($scope.signlevels.length + ' ' + signlevel.levelOrder);
    	$scope.signlevels.splice(signlevel.levelOrder-1, 1);
    	angular.forEach($scope.signlevels, function(signlevel, index){
    		signlevel.levelOrder = index+1;
    	});
    }



    $scope.saveSignLevel = function () {

        var consistencyOperation = checkMultiOperationConsistency($scope.signlevels);

        if(!consistencyOperation.signTypeSelected){
            sweet.show({
                title: '',
                confirmButtonColor: '#F27474',
                text: 'No existen firmas asociadas en alguno de los niveles.',
                confirmButtonText: 'Cerrar',
                type: 'error'
            });
        } else if(!consistencyOperation.isBiometricWithDocs && consistencyOperation.isBiometricLevel){
            //If the level is biometric AND it does not have any biometric doc associated, showing the error popup.
            sweet.show({
                title: '',
                confirmButtonColor: '#F27474',
                text: 'No existen documentos biométricos asociados en alguno de los niveles de firma biométrica.',
                confirmButtonText: 'Cerrar',
                type: 'error'
            });
        } else if(!consistencyOperation.isSignWithDocs && !consistencyOperation.isBiometricLevel){
            //If the level is NOT biometric AND it does not have any doc associated, showing the warning popup.
            sweet.show({
                title: '',
                showCancelButton   : true,
                confirmButtonColor : '#F8BD86',
                text               : 'Hay niveles sin documentos asociados.',
                confirmButtonText  : 'Guardar',
                cancelButtonText   : 'Cancelar',
                type               : 'warning',
                closeOnConfirm     : true,
                closeOnCancel      : true
            }, function(isConfirm) {
                if (isConfirm) {
                    //saving the configuration.
                    saveLevels();
                }
            });
        } else {
            //The level has at least one doc associated, we will save.
            saveLevels();
        }

    }

    function saveLevels() {

        var signlevelsPost = [];
        angular.forEach($scope.signlevels, function(signlevel, index){
            var newSignLevel               = {};
            newSignLevel.levelOrder        = signlevel.levelOrder;
            newSignLevel.signatureTypes    = [];
            newSignLevel.docsTypeList      = [];
            newSignLevel.preConditionsList = [];

            var emptyArray = [];
            var signatureTypesmod = angular.copy(emptyArray);
            angular.forEach(signlevel.signatureTypes, function(signatureType, index){
                if(signatureType.selected){
                    var signatureTypeindex      = {};
                    signatureTypeindex.label    = signatureType.label;
                    signatureTypeindex.selected = false;
                    signatureTypesmod.push(signatureTypeindex);
                }
            });
            newSignLevel.signatureTypes=signatureTypesmod;

            var docToSignmod = angular.copy(emptyArray);
            angular.forEach(signlevel.docsTypeList, function(docToSign, index){
                if(docToSign.selected){
                    var docToSignindex             = {};
                    docToSignindex.name            = docToSign.name;
                    docToSignindex.description     = docToSign.description;
                    docToSignindex.code            = docToSign.code;
                    docToSignindex.mandatory       = docToSign.mandatory;
                    docToSignindex.uploadMandatory = docToSign.uploadMandatory;
                    docToSignindex.signorupload    = docToSign.signorupload;
                    docToSignindex.operationorsigner = docToSign.operationorsigner;
                    docToSignindex.selected        = false;
                    docToSignmod.push(docToSignindex);
                }
            });
            newSignLevel.docsTypeList=docToSignmod;

            var preConditionsmod = angular.copy(emptyArray);
            angular.forEach(signlevel.preConditionsList, function(preCondition, index){
                if(preCondition.selected){
                    var preConditionindex = {};
                    preConditionindex.id           = preCondition.id;
                    preConditionindex.name         = preCondition.name;
                    preConditionindex.label        = preCondition.label;
                    preConditionindex.url          = preCondition.url;
                    preConditionindex.mandatory    = preCondition.mandatory;
                    preConditionindex.order        = preCondition.order;
                    preConditionindex.html         = '';
                    preConditionindex.fileHTMLPath = preCondition.fileHTMLPath;
                    preConditionindex.selected     = false;
                    preConditionindex.typology     = preCondition.typology;
                    preConditionindex.phrase       = preCondition.phrase;
                    preConditionsmod.push(preConditionindex);
                }
            });
            newSignLevel.preConditionsList=preConditionsmod;

            signlevelsPost.push(newSignLevel);
        });

        $http({
          method: 'POST',
          url: 'services/multiple/signlevelsdata/save/'+$stateParams.id,
          data: JSON.stringify(signlevelsPost)
        }).then(function successCallback(response) {
            $rootScope.$broadcast('callSuccess', 'GUARDADO');

          }, function errorCallback(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveSignLevel)');

          });
    }

    $scope.goBackToTheDomainManger = function () {
        var domainID = tokenManager.getDomainId();
        $state.go('domain_with_id', { id :  domainID, openOperations : true});
    }

    $scope.loadCustomMessagesLang = function () {
    	var isocode = 'es';
    	if(angular.isUndefined($scope.currentlanguage)==false){
    		isocode=$scope.currentlanguage;
    	}
        deferredCustomMessages = $q.defer();
        operationRESTServices.getCustomLanguageMessages($stateParams.id, isocode).then(
            function (responseSuccess) {
                var responseResolved    = {}
                responseResolved.status = responseSuccess.status;
                responseResolved.data   = responseSuccess.data;
                $scope.customize        = responseSuccess.data;
                deferredCustomMessages.resolve(responseResolved);
            },
            function (responseError) {
                 var responseRejected   = {}
                responseRejected.status = responseError.status;
                responseRejected.data   = responseError.data;
                responseRejected.from   = "Getting the custom messages."
                deferredCustomMessages.reject(responseRejected);
            }
        )

        return deferredCustomMessages.promise;
    }

    $scope.deselectSignIfBio = function(arrayOfSignType, selected, signTypeSelected, documentsLevel) {

        var isBiometric = false;

        angular.forEach(arrayOfSignType, function(sign, index) {
            if(sign.label.toLowerCase().indexOf('biometrica') !== -1 && sign.selected)
                isBiometric = true;
        })

        if(isBiometric){
            angular.forEach(documentsLevel, function(doc, index) {
                if(!doc.code.startsWith('BIO ') && !doc.code.startsWith('STATIC BIO ') && doc.selected)
                    doc.selected = false;
            })
        }

        // //The biometric sign has been selected then we deselect all the others.
        // if (signTypeSelected.toLowerCase().indexOf('biometrica') !== -1 && selected){
        //     angular.forEach(arrayOfSignType, function(sign, index) {
        //         if(sign.label.toLowerCase().indexOf('biometrica') === -1 && sign.selected)
        //             sign.selected = false;
        //     })
        // } else if(signTypeSelected.toLowerCase().indexOf('biometrica') === -1 && selected && isBiometric){

        //     angular.forEach(arrayOfSignType, function(sign, index) {
        //         if(sign.label.toLowerCase().indexOf(signTypeSelected.toLowerCase()) !== -1 && sign.selected){
        //             sign.selected = false;
        //         }
        //     })
        // }
    }

    $scope.deselectDocsIfBio = function(arrayOfDocs, selected, codeSelected, signLevel) {

        var isBiometric = false;

        angular.forEach(signLevel, function(sign, index) {
            if(sign.label.toLowerCase().indexOf('biometrica') !== -1 && sign.selected)
                isBiometric = true;
        })

        if(isBiometric){
            if (!codeSelected.startsWith('BIO ') && !codeSelected.startsWith('STATIC BIO ') && selected) {
                angular.forEach(arrayOfDocs, function(doc, index) {
                    if(doc.code === codeSelected)
                        doc.selected = false;
                })
            }
        }
    }

    $scope.checkIfBio = function(arrayOfSignType) {

        var isBiometric = false;

        angular.forEach(arrayOfSignType, function(sign, index) {
            if(sign.label.toLowerCase().indexOf('biometrica') !== -1 && sign.selected)
                isBiometric = true;
        })

        return isBiometric;
    }
}]);

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('DocDialogController',
    ['$scope', 'CUObject', 'TablesInstances', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'operationRESTServices', 'docSelected',
    function($scope, CUObject, TablesInstances, $uibModalInstance, $stateParams, $http, $rootScope, operationRESTServices, docSelected){

        $scope.doc = docSelected;
        $scope.doc.mandatory         = ""+$scope.doc.mandatory;
        $scope.doc.signorupload      = ""+$scope.doc.signorupload;
        $scope.doc.visiblesign       = ""+$scope.doc.visiblesign;
        $scope.doc.uploadMandatory   = ""+$scope.doc.uploadMandatory;
        $scope.doc.transferible      = ""+$scope.doc.transferible;
        $scope.doc.signmultiple      = ""+$scope.doc.signmultiple;
        $scope.doc.operationorsigner = ""+$scope.doc.operationorsigner;

        var oldBlock;
        var oldOrder;

        if($scope.doc.order === 0 || $scope.doc.block === 0){
            $scope.doc.order = undefined;
            $scope.doc.block = undefined;
        } else {
            oldOrder = ""+$scope.doc.order;
            oldBlock = ""+$scope.doc.block;
            $scope.doc.order = ""+$scope.doc.order;
            $scope.doc.block = ""+$scope.doc.block;
        }

        if (typeof $scope.doc.name === 'undefined')
        {
            $scope.isnew                 = true;
            $scope.doc.mandatory         = "0";
            $scope.doc.signorupload      = "0";
            $scope.doc.visiblesign       = "0";
            $scope.doc.order             = "1";
            oldOrder                     = "1";
            $scope.doc.block             = "1";
            oldBlock                     = "1";
            $scope.doc.uploadMandatory   = "0";
            $scope.doc.transferible      = "0";
            $scope.doc.signmultiple      = "0";
            $scope.doc.operationorsigner = "0";
        }
        else{
        	$scope.isnew = false;
        }
        
        if (parseInt($scope.doc.operationorsigner) == 1) {
        	$scope.doc.signmultiple = '0';
    		$scope.disableMultiple = true;	
        } else
        	$scope.disableMultiple = false;	

        $scope.setBlockOrder = function(listValue) {

            if(listValue === '1'){
                $scope.doc.order = '0';
                $scope.doc.block = '0';
            }

            if(listValue === '0'){
                $scope.doc.block = oldBlock;
                $scope.doc.order = oldOrder;
            }
        }
        $scope.saveDoc = function (doc) {
            doc.mandatory         = parseInt(doc.mandatory);
            doc.signorupload      = parseInt(doc.signorupload);
            doc.order             = parseInt(doc.order);
            doc.block             = parseInt(doc.block);
            doc.uploadMandatory   = parseInt(doc.uploadMandatory);
            doc.transferible      = parseInt(doc.transferible);
            doc.signmultiple      = parseInt(doc.signmultiple);
            doc.visiblesign       = 0;
            doc.operationorsigner = parseInt(doc.operationorsigner);

            operationRESTServices.saveDocType($stateParams.id, doc).then(function successCallback(response) {
                TablesInstances.getInstanceDocTableToSign().reloadData();
                TablesInstances.getInstanceDocTableToUpload().reloadData();
                CUObject.setDocObject(doc);
                $uibModalInstance.close('');
                $rootScope.$broadcast('callSuccess', 'GUARDADO');

              }, function errorCallback(responseError) {
                $uibModalInstance.dismiss('');
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: DocDialogController)');
              });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
        
        // Permit the sign multiple if the type of document is operation
        $scope.permitSignMultiple = function(operationSigner) {
        	
        	if (parseInt(operationSigner) == 1) {
        		$scope.doc.signmultiple = '0';
        		$scope.disableMultiple = true;
        	} else 
        		$scope.disableMultiple = false;
        }

}])

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('VisiblesignDocDialogController',
    ['$scope', 'CUObject', 'TablesInstances', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'operationRESTServices', 'docSelected',
    function($scope, CUObject, TablesInstances, $uibModalInstance, $stateParams, $http, $rootScope, operationRESTServices, docSelected){

    	$scope.biosignDocsArray = CUObject.getBiosignDocsArray();

    	$scope.doc                   = angular.copy(docSelected);
        $scope.doc.mandatory         = ""+$scope.doc.mandatory;
        $scope.doc.signorupload      = ""+$scope.doc.signorupload;
        $scope.doc.visiblesign       = ""+$scope.doc.visiblesign;
        $scope.doc.uploadMandatory   = ""+$scope.doc.uploadMandatory;
        $scope.doc.transferible      = ""+$scope.doc.transferible;
        $scope.doc.signmultiple      = ""+$scope.doc.signmultiple;
        $scope.doc.operationorsigner = ""+$scope.doc.operationorsigner;

        if($scope.doc.order === 0 || $scope.doc.block === 0){
            $scope.doc.order = undefined;
            $scope.doc.block = undefined;
        } else {
            $scope.doc.order = ""+$scope.doc.order;
            $scope.doc.block = ""+$scope.doc.block;
        }

        if (typeof $scope.doc.name === 'undefined')
        {
            $scope.isnew                 = true;
            $scope.doc.mandatory         = "0";
            $scope.doc.signorupload      = "0";
            $scope.doc.visiblesign       = "1";
            $scope.doc.order             = "1";
            $scope.doc.block             = "1";
            $scope.doc.uploadMandatory   = "0";
            $scope.doc.transferible      = "0";
            $scope.doc.signmultiple      = "0";
            $scope.doc.operationorsigner = "0";
        }
        else{
        	$scope.isnew = false;
        	
        	if (parseInt($scope.doc.operationorsigner) == 1) {
        		$scope.doc.signmultiple = '0';
        		$scope.disableMultiple = true;
        	} else 
        		$scope.disableMultiple = false;
        }

        $scope.saveVisiblesignDoc = function (doc) {

            doc.mandatory         = parseInt(doc.mandatory);
            doc.signorupload      = parseInt(doc.signorupload);
            doc.order             = parseInt(doc.order);
            doc.block             = parseInt(doc.block);
            doc.uploadMandatory   = parseInt(doc.uploadMandatory);
            doc.transferible      = parseInt(doc.transferible);
            doc.signmultiple      = parseInt(doc.signmultiple);
            doc.operationorsigner = parseInt(doc.operationorsigner)
            doc.visiblesign       = 1;

            operationRESTServices.saveDocType($stateParams.id, doc).then(function successCallback(response) {
                TablesInstances.getInstanceDocTableToSign().reloadData();
                TablesInstances.getInstanceDocTableToUpload().reloadData();
                CUObject.setDocObject(doc);
                $uibModalInstance.close('');
                $rootScope.$broadcast('callSuccess', 'GUARDADO');

              }, function errorCallback(responseError) {
                $uibModalInstance.dismiss('');
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: VisiblesignDocDialogController)');
              });
        }

        $scope.cancel = function () {
        	$uibModalInstance.dismiss('');
        }

        // Permit the sign multiple if the type of document is operation
        $scope.permitSignMultiple = function(operationSigner) {

        	if (parseInt(operationSigner) == 1) {
        		$scope.doc.signmultiple = '0';
        		$scope.disableMultiple = true;
        	} else 
        		$scope.disableMultiple = false;
        }
    }])

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('AuthDialogController',
    ['$rootScope', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'CUObject', 'TablesInstances', '$uibModalInstance', '$stateParams', '$http',
    function($rootScope, $scope, DTOptionsBuilder, DTColumnDefBuilder, CUObject, TablesInstances, $uibModalInstance, $stateParams, $http){
        $scope.identifierArray = CUObject.getAuthIdentifierArrayObject();
        $scope.actionArray = CUObject.getAuthActionArrayObject();

        $scope.dtOptionsModalAuth = DTOptionsBuilder.newOptions()
        	.withOption('searching', false)
        	.withOption('ordering', false)
        	.withOption('paging', false);

        $scope.dtColumnsModalAuth = [
                                DTColumnDefBuilder.newColumnDef(1).renderWith(additionalactionsmodalFormatterHtml),
                                DTColumnDefBuilder.newColumnDef(2).withTitle('Acciones').notSortable()];

        function additionalactionsmodalFormatterHtml (data, type, full, meta) {
        	var stringLabel='';
        	if(data!=undefined && data!==''){
        		angular.forEach(CUObject.getAuthActionArrayObject(), function(method, index) {
        			if (method.action === data) {
        				stringLabel = method.label;
        				return;
        			}
                });



            }
            return stringLabel;

        }

        $scope.isReadOnly = false;


        var isNew = (angular.isUndefined(CUObject.getAuthObject().identifier) &&
                     angular.isUndefined(CUObject.getAuthObject().label));
        var authOb = CUObject.getAuthObject();
        if (!isNew) {
            $scope.identifier = authOb;
            $scope.field = {};
            $scope.field.label = "";
            $scope.field.label = authOb.label;
            $scope.auth = authOb.auth;
            $scope.field.resumen = authOb.resumen;
            $scope.field.type = authOb.type;
            $scope.field.order = authOb.order;
            $scope.field.isMandatory = authOb.isMandatory;

            if($scope.identifier.identifier.toLowerCase() === 'cellphone' || $scope.identifier.identifier.toLowerCase() === 'operationid'){
                $scope.field.isMandatory = 'Y';
                $scope.isReadOnly = true;
                $scope.isTypeReadOnly = true;
            } else {
                $scope.isReadOnly = false;
                $scope.isTypeReadOnly = false;
            }


            if(
                $scope.identifier.identifier.toLowerCase() === 'cp'       || $scope.identifier.identifier.toLowerCase() === 'city'  ||
                $scope.identifier.identifier.toLowerCase() === 'address'  || $scope.identifier.identifier.toLowerCase() === 'email' ||
                $scope.identifier.identifier.toLowerCase() === 'lastname' || $scope.identifier.identifier.toLowerCase() === 'name'  ||
                $scope.identifier.identifier.toLowerCase() === 'nif'      || $scope.identifier.identifier.toLowerCase() === 'cellphone'
            ) {
                $scope.field.type = 'SIGNER';
                $scope.isTypeReadOnly = true;
            } else if($scope.identifier.identifier.toLowerCase() === 'operationid'  || $scope.identifier.identifier.toLowerCase() === 'uuid' ||
                      $scope.identifier.identifier.toLowerCase() === 'multipleuuid' || $scope.identifier.identifier.toLowerCase() === 'optype'){
                $scope.field.type = 'OPERATION';
                $scope.isTypeReadOnly = true;
            }

            if(!angular.isObject( authOb.additionalactions) || angular.isUndefined( authOb.additionalactions ))
                $scope.field.additionalactions = [];
            else
                $scope.field.additionalactions = authOb.additionalactions;
            $scope.additionalaction = {};
        } else {
            $scope.field = {};
            $scope.field.additionalactions = [];
            $scope.additionalaction = {};
        }


        $scope.checkIfIsMandatory = function(label) {
            console.log(label);
            if(label.identifier.toLowerCase() === 'cellphone' || label.identifier.toLowerCase() === 'operationid' ){
                $scope.field.isMandatory = 'Y';
                $scope.isReadOnly = true;
                $scope.isTypeReadOnly = true;

            } else {
                $scope.isReadOnly = false;
                $scope.isTypeReadOnly = false;
            }

            if(
                label.identifier.toLowerCase() === 'cp'       || label.identifier.toLowerCase() === 'city'  ||
                label.identifier.toLowerCase() === 'address'  || label.identifier.toLowerCase() === 'email' ||
                label.identifier.toLowerCase() === 'lastname' || label.identifier.toLowerCase() === 'name'  ||
                label.identifier.toLowerCase() === 'nif'      || label.identifier.toLowerCase() === 'cellphone'
            ) {
                $scope.field.type = 'SIGNER';
                $scope.isTypeReadOnly = true;
            } else if(label.identifier.toLowerCase() === 'operationid'  || label.identifier.toLowerCase() === 'uuid' ||
                      label.identifier.toLowerCase() === 'multipleuuid' || label.identifier.toLowerCase() === 'optype'){
                $scope.field.type = 'OPERATION';
                $scope.isTypeReadOnly = true;
            }

        }

        $scope.dtModalAuthAdd = function () {
        	$scope.additionalaction.step = $scope.additionalaction.identifier.step;
            $scope.additionalaction.className = $scope.additionalaction.identifier.className;
            $scope.additionalaction.identifier = $scope.additionalaction.identifier.action;
        	$scope.field.additionalactions.push(angular.copy($scope.additionalaction));
        }
        $scope.dtModalAuthRemove = function (index) {
        	$scope.field.additionalactions.splice(index, 1);
        }

        $scope.saveAuth = function (field, identifierObject, auth, actionObject, action ) {

            field.identifier = identifierObject.identifier;
            field.auth = auth;
            field.defaultValue = identifierObject.defaultValue;

            console.log(field);
            if(isNew)
                CUObject.getAuthArrayObject().push(field);
            else
                CUObject.getAuthArrayObject().splice(CUObject.getAuthIndexObject(), 1, field);

            $http({
              method: 'POST',
              url: 'services/auth/type/save/onlyfields/'+CUObject.getOperationTypeID(),
              data: JSON.stringify(CUObject.getAuthArrayObject())
            }).then(function successCallback(response) {
                $uibModalInstance.dismiss('');
                $rootScope.$broadcast('callSuccess', 'GUARDADO');

              }, function errorCallback(responseError) {
                $uibModalInstance.dismiss('');
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: AuthDialogController)');

              });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
}])

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('LimitDialogController',
    ['$scope', 'CUObject', 'TablesInstances', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'limitObject', 'operationRESTServices',
    function($scope, CUObject, TablesInstances, $uibModalInstance, $stateParams, $http, $rootScope, limitObject, operationRESTServices){

        console.log(limitObject);
        console.log(CUObject.getOperationTypeID());
        var isNew = (angular.isUndefined(limitObject.name) &&
                     angular.isUndefined(limitObject.id));

        $scope.limit = limitObject;
        var index = CUObject.getLimitIndexObject();
        $scope.saveLimit = function (limit) {
            console.log(limit);

            operationRESTServices.saveLimit(CUObject.getOperationTypeID(), limit).then(
                function(responseSuccess) {
                    console.log(responseSuccess);
                    var objectToReturn = {
                        limit : responseSuccess.data,
                        isNew : isNew
                    }
                    $uibModalInstance.close(objectToReturn);
                },
                function(responseError){
                    console.log(responseError);
                    $uibModalInstance.dismiss(responseError);
                }
            )

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        }
}])

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('ConditionDialogController',
    ['$scope', 'CUObject', 'TablesInstances', '$uibModalInstance', '$stateParams', '$http', '$rootScope',
    function($scope, CUObject, TablesInstances, $uibModalInstance, $stateParams, $http, $rootScope){
    	
        $scope.cond = CUObject.getConditionObject();
        $scope.cond.mandatory = ""+CUObject.getConditionObject().mandatory;
        if ($scope.cond.mandatory === 'undefined')
            $scope.cond.mandatory = "0";
        
         if ($scope.cond.typology == TYPOLOGY_PHRASE) {
        	 $scope.cond.typology = true;        	 
        	 $scope.showInputPhrase = true;
         }

        $scope.saveCond = function (cond) {
            cond.mandatory = parseInt(cond.mandatory);
            
            if (cond.typology == true) 
            	cond.typology = TYPOLOGY_PHRASE;
            else
            	cond.typology = TYPOLOGY_CHECK;
            
            console.log(cond);
            $http({
              method: 'POST',
              url: 'services/conditions/type/save/'+$stateParams.id,
              data: JSON.stringify(cond)
            }).then(function successCallback(response) {
                var isModified = false;
                angular.forEach(CUObject.getConditionsList(), function (condition, index) {
                    if(condition.id === response.data.id){
                        CUObject.getConditionsList().splice(index, 1, response.data)
                        isModified = true;
                    }
                })

                if(!isModified) CUObject.getConditionsList().push(response.data);

                $uibModalInstance.close('');
                $rootScope.$broadcast('callSuccess', 'GUARDADO');
              }, function errorCallback(responseError) {
                $uibModalInstance.dismiss('');
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: ConditionDialogController)');

              });
            cond.mandatory = ""+cond.mandatory;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }

        $scope.tinymceOptions = {
            onChange: function(e) {
            // put logic here for keypress and cut/paste changes
            },
            inline: false,
            plugins: [
                    "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                    "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
                    ],

                    toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | mybutton",
                    toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
                    toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
                    extended_valid_elements:
                    // "@[id|class|title|style]," +
                    // "a[name|href|target|title|alt|ng-click]," +
                    "input[name|href|type|target|title|alt|ng-click|ng-model|ng-value|ng-change]," ,
                    // "#p,blockquote,-ol,-ul,-li,br,img[src|height|width],-sub,-sup,-b,-i,-u," +
                    // "-span,hr,h1,h2,h3,h4,h5,h6," + 
                    // "form[style|name|novalidate|", 
                    menubar: false,
                    toolbar_items_size: 'small',
                    skin: 'lightgray',
                    theme : 'modern',
                    language: 'es',
            setup: function (editor) {
                editor.addButton('mybutton', {
                    type: 'listbox',
                    text: 'Campos',
                    icon: false,
                    onselect: function (e) {
                        editor.insertContent(this.value());
                    },
                    values: [
                    { text: '+ nombre', value: '&nbsp;##name##&nbsp;##lastname##' },
                    { text: '+ id. operación', value: '&nbsp;##operationid##&nbsp;' },
                    { text: '+ link firma', value: '&nbsp;##url##&nbsp; ' },
                    { text: '+ clave acceso ', value: '&nbsp;##accessotp##&nbsp; ' },
                    { text: '+ clave firma ', value: '&nbsp;##signotp##&nbsp; ' },
                    { text: '+ link verificación ', value: '&nbsp;##verifyurl##&nbsp; ' }

                    ]
                });
            },
        };
}])

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('ReminderDialogController',
    ['$scope', 'CUObject', 'TablesInstances', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'operationRESTServices',
    function($scope, CUObject, TablesInstances, $uibModalInstance, $stateParams, $http, $rootScope, operationRESTServices){
        $scope.reminderTypeArray = CUObject.getRemindersTypeArray();
        $scope.notificationTypeArray = CUObject.getNotificationTypeArray();

        $scope.reminder = CUObject.getReminderObject();

        $scope.saveReminder= function (reminder) {
            console.log(reminder);
            operationRESTServices.saveReminder(reminder, CUObject.getOperationTypeID()).then(
                function (responseSuccess) {
                    TablesInstances.getInstanceReminderTable().reloadData();
                    $uibModalInstance.close('');
                    $rootScope.$broadcast('callSuccess', 'GUARDADO');
                },
                function (responseError) {
                    $uibModalInstance.dismiss('');
                    $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: ReminderDialogController)');
                }
            )
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
}])

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('NotificationDialogController',
    ['$scope', 'CUObject', 'TablesInstances', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'notificationsList', 'domainServices',
    function($scope, CUObject, TablesInstances, $uibModalInstance, $stateParams, $http, $rootScope, notificationsList, domainServices){
        var isNew = (angular.isUndefined(CUObject.getNotificationObject().notiftype) &&
                     angular.isUndefined(CUObject.getNotificationObject().name));

        $scope.notification = CUObject.getNotificationObject();
        $scope.notificationTypeArray = CUObject.getNotificationTypeArray();

        $scope.extraFields = domainServices.getExtraFields();

        $scope.saveNotification = function (notification) {
            console.log(notification);
            $http({
              method: 'POST',
              url: 'services/notifications/template/save/'+$stateParams.id,
              data: JSON.stringify(notification)
            }).then(function successCallback(response) {
                if (isNew) notificationsList.push(response.data)
                else {
                    angular.forEach(notificationsList, function (not, index) {
                        if(response.data.id === not.id) notificationsList.splice(index, 1, response.data)
                    })
                }

                CUObject.setNotificationArray(notificationsList);
                $uibModalInstance.dismiss('');
                $rootScope.$broadcast('callSuccess', 'GUARDADO');

              }, function errorCallback(responseError) {
                $uibModalInstance.dismiss('');
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: NotificationDialogController)');

              });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }

        $scope.getExtraFieldsDinamically = function() {
          var values = [];
          angular.forEach($scope.extraFields, function(extraField) {
           var value = {};
           value.text = extraField.label;
            value.value = '&nbsp;##' + extraField.identifier + '##&nbsp;';
            values.push(value);
          });
          return values;
        }

        $scope.tinymceOptions = {
                onChange: function(e) {
                  // put logic here for keypress and cut/paste changes
                },
                inline: false,
                plugins: [
                          "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                          "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                          "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
                        ],

                toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | mybutton | customfields",
                toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
                toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",

                menubar: false,
                toolbar_items_size: 'small',
                skin: 'lightgray',
                theme : 'modern',
                language: 'es',
                setup: function (editor) {
                    editor.addButton('mybutton', {
                      type: 'listbox',
                      text: 'Campos',
                      icon: false,
                      onselect: function (e) {
                        editor.insertContent(this.value());
                      },
                      values: [

                        { text: '+ nombre', value: '&nbsp;##name##&nbsp;##lastname##' },
                        { text: '+ id. operación', value: '&nbsp;##operationid##&nbsp;' },
                        { text: '+ link firma', value: '&nbsp;##url##&nbsp; ' },
                        { text: '+ clave acceso ', value: '&nbsp;##accessotp##&nbsp; ' },
                        { text: '+ clave firma ', value: '&nbsp;##signotp##&nbsp; ' },
                        { text: '+ link verificación ', value: '&nbsp;##verifyurl##&nbsp; ' },
                        { text: '+ link video identificación ', value: '&nbsp;##urlvideoaccess##&nbsp; ' },
                        { text: '+ link descarga de acta ', value: '&nbsp;##urlactdownload##&nbsp; ' },
                        { text: '+ clave acceso videoid ', value: '&nbsp;##otpvideo##&nbsp; ' },
                        { text: '+ código único ', value: '&nbsp;##cuv##&nbsp; ' }

                      ]
                    }),
                    editor.addButton('customfields', {
                      type: 'listbox',
                      text: 'Campos adicionales',
                      icon: false,
                      onselect: function (e) {
                        editor.insertContent(this.value());
                      },
                      values: $scope.getExtraFieldsDinamically(),
                    });
                  },
              };
}])


angular.module('O2DigitalSite').controller('AddQuestionModal',
    ['$scope', 'TablesInstances', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'questionObject', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',
    function($scope, TablesInstances, $uibModalInstance, $stateParams, $http, $rootScope, questionObject, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

      $scope.dtOptionsAnswer = DTOptionsBuilder.newOptions().withOption('ordering', false).
                                                             withOption('searching', false).
                                                             withOption('lengthChange', false).
                                                             withOption('info', false).
                                                             withOption('paging', false);
      $scope.dtColumnsAnswer = [
          DTColumnDefBuilder.newColumnDef(0).notSortable(),
          DTColumnDefBuilder.newColumnDef(1).notSortable(),
          DTColumnDefBuilder.newColumnDef(2).notSortable()
      ];

      $scope.question = {};
      $scope.question.options = [];


      if(!angular.isUndefined(questionObject)) {
        console.log(questionObject);
        $scope.question.questionCode = questionObject.questionCode;
        $scope.question.questionText = questionObject.questionText;
        $scope.question.options      = questionObject.options;
      }

      $scope.noEmptyAnswerFields = function() {
        if(angular.isDefined($scope.question.option)) {
          if(!angular.isUndefined($scope.question.option.optionCode) && !angular.isUndefined($scope.question.option.optionText)) {
            return false;
          } else {
            return true;
          }
        }
      }

      $scope.saveAnswer = function(data) {
        $scope.question.options.push(data);
        $scope.question.option = {};
      }

      $scope.removeAnswer = function(index) {
        console.log('eliminando respuesta: ' + index);
        $scope.question.options.splice(index, 1);
      }

      $scope.saveQuestion = function(data) {
        delete data.option;
        $scope.question.questionCode = data.questionCode;
        $scope.question.questionText = data.questionText;
        var questionToReturn         = {};
        questionToReturn             = $scope.question;
        $uibModalInstance.close(questionToReturn);
      }

      $scope.closeSurveyModal = function() {
        $uibModalInstance.dismiss('closeSurveyModal');
      }

      $scope.checkLenghtAnswers = function() {
        if($scope.question.options.length > 1 && angular.isDefined($scope.question.questionCode) && angular.isDefined($scope.question.questionText)) {
          return false;
        } else {
          return true;
        }
      }
}]);
