var a;
angular.module('O2DigitalSite').controller('DomainManagerController', ['$scope', '$window', '$http', '$state', '$stateParams', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$timeout', '$rootScope', 'domainServices', 'domainRESTServices', 'CUObject', 'domainTables', '$uibModal', 'tokenManager', 'DefaultTSA',
 function($scope, $window, $http, $state, $stateParams, $compile, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $timeout, $rootScope, domainServices, domainRESTServices, CUObject, domainTables, $uibModal, tokenManager, DefaultTSA){
	
	console.log('In the domainManagerController');
	console.log('the id of the domain is: '+ $stateParams.id);
	console.log('Open operations: '+ $stateParams.openOperations);
	$scope.fromOperation = $stateParams.openOperations;
	$scope.setClearChache = "?" + new Date().getTime();
	$scope.extraInfoModified = false;

	$scope.userRole = tokenManager.getUserRole();
	$scope.userIdFromToken = tokenManager.getUserIdFromToken();

	$rootScope.$broadcast('rootChange', 'Administración / Configuración General');

	$rootScope.$on('$routeChangeSuccess', function() {
    	$modalInstance.dismiss('cancel');
	});

	$scope.operations              = [];
	$scope.operationsList          = [];
	$scope.filesQueue              = [];
	$scope.isLoaded                = false;
	$scope.disableTsa              = false;
	$scope.disableFileCertUpload   = false;
	$scope.fileSelected            = false;
	$scope.isValidIntermediateCert = false;
	$scope.fileLTVSelected         = false;
	$scope.isSMSJSONValid          = true;
	$scope.fileLTV;
	$scope.fileP12;


  // colors for signature web applitation
  $scope.signatureColors = {};

  $scope.checkBlackColor = function(color) {
      if(angular.isDefined(color)) {
          var c = color.substring(1);      // strip #
          var rgb = parseInt(c, 16);   // convert rrggbb to decimal
          var r = (rgb >> 16) & 0xff;  // extract red
          var g = (rgb >>  8) & 0xff;  // extract green
          var b = (rgb >>  0) & 0xff;  // extract blue

          var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

          if (luma < 120) { // grey and black colors.
            return true;
          } else {
            return false;
          }
      } else {
         return true; // white background by default
      }
  }

	var regexWhiteSpaces = /^$|\s+/;
	var domainRetrieved;
	var logoBig;
	var logoMedium;
	var logoSmall;
	var cssFile;
	var actaFile;
	var domainID;


	function dtInstanceOpCallback (dtInstance) {
		$scope.dtInstanceOp = dtInstance;
	}

	function dtInstanceUsersCallback (dtInstance) {
		$scope.dtInstanceUser = dtInstance;
	}
	
	$scope.uploadedFile = function(element){
		var modified = false;
		var logo ="";

		if (element.id === "logoBig"){
			logoBig = element.files[0].name;
			logo ="big";
		}
		else if(element.id === "logoMedium"){
			logoMedium = element.files[0].name;
			logo = "medium";
		}
		else if(element.id === "logoLittle"){
			logoSmall = element.files[0].name;
			logo = "little";
		}
		else if(element.id === "cssFile"){
			cssFile = element.files[0].name;
			$('#previewcssfile').text(cssFile)

		}

	   	var reader = new FileReader();
	   	reader.onload = function(event){
	   		$scope.imageSrc  = event.target.result;
   			$('#preview'+ logo).html("<img class='imgdimension' src='"+event.target.result+"' />");
	   	}
	   	reader.readAsDataURL(element.files[0]);

		angular.forEach($scope.filesQueue, function(fileObject, index){
			if (element.id === fileObject.id) {
				fileObject.file = element.files[0];
				modified = true;
			}
		});
		if (!modified) {
			$scope.filesQueue.push({
				id : element.id,
				file : element.files[0]
			});
		};
	}

	$scope.edit = function (operationsTypeObject) {
		CUObject.setDomainID(tokenManager.getDomainId());
		$state.go('manage_operation', { id : operationsTypeObject.id})
	};

	$scope.copy = function(operationTypeToCopy) {

		domainRESTServices.copyOperationType(tokenManager.getDomainId(), operationTypeToCopy.id).then(function(responseSuccess) {
			$scope.operationsList = JSON.parse(responseSuccess.data.data);
			if (responseSuccess.data.copiedConditionsSuccessfully) {
				$rootScope.$broadcast('callSuccess', 'Operación copiada correctamente');
			} else {
				$rootScope.$broadcast('callSuccess', 'La operación se ha copiado correctamente pero algunas condiciones no se han podido copiar.');
			}
		}).catch(function(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: copy operation type)');
		})
	}

	$scope.delete = function (operationTypeObject) {

		$http({
			  method: 'DELETE',
			  url: 'services/domain/delete/operationtype/'+tokenManager.getDomainId()+'/'+operationTypeObject.id,
			}).then(function successCallback(response) {
			    console.log(response);
			    $scope.operationsList = response.data;
			    domainServices.setOperationList(response.data);
			    $rootScope.$broadcast('callSuccess', 'BORRADA CORRECTAMENTE');

			  }, function errorCallback(responseError) {
	            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: delete operation type)');

			  });

	}

	$scope.saveGraphicFiles = function () {
		domainRESTServices.uploadStyleFiles($scope.filesQueue, tokenManager.getDomainId(), logoBig, logoMedium, logoSmall, cssFile, $scope.signatureColors).then(
			function (responseSuccess) {
				$scope.setClearChache = "?" + new Date().getTime();
				$rootScope.$broadcast('callSuccess', 'GUARDADO');
				$rootScope.$broadcast('imgChange');
				$rootScope.$broadcast('changeStyle');

			},
			function (responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveGraphicFiles)');
			}
		)
	};

	$scope.tryTsa = function(domainCertificates) {

		if(angular.isNull(domainCertificates.tsaUsername))
			domainCertificates.tsaUsername = '';
		if(angular.isNull(domainCertificates.tsaPassword))
			domainCertificates.tsaPassword = '';

		domainRESTServices.testTSAConf(domainCertificates, tokenManager.getDomainId()).then(function (responseSuccess) {
        	$rootScope.$broadcast('callSuccess', 'La configuración TSA es correcta.');
		}).catch(function (responseError) {
        	$rootScope.$broadcast('callError', responseError.data.failure);
		})
	}

	$scope.saveDefaultTsa = function(isChecked) {

		if (isChecked){
			$scope.domainCertificates.tsaURL      = DefaultTSA.url;
			$scope.domainCertificates.tsaUsername = DefaultTSA.username;
			$scope.domainCertificates.tsaPassword = '';
		} else {
			$scope.domainCertificates.tsaURL      = ''
			$scope.domainCertificates.tsaUsername = ''
			$scope.domainCertificates.tsaPassword = '';
		}
	}

	$scope.setDefaultCert = function(isChecked) {
		if (isChecked) {
			$scope.domainCertificates.certificate   = $scope.certificateDefault.info;
			$scope.domainCertificates.certificatePK = $scope.certificateDefault.validity;
			$scope.fileSelected = false;
		} else {
			$scope.domainCertificates.certificate   = $scope.certificateRetrieved.info;
			$scope.domainCertificates.certificatePK = $scope.certificateRetrieved.validity;
			if(angular.isDefined($scope.fileP12))
				$scope.fileSelected = true;
		}
	}

	$scope.saveP12Cert = function (domainCertificates) {

		domainRESTServices.uploadP12File($scope.fileP12, domainCertificates.certificatePass, tokenManager.getDomainId() ).then(function(responseSuccess) {
			refreshDomainFields(responseSuccess);
			$scope.isValidIntermediateCert = true;
			$rootScope.$broadcast('callSuccess', 'El certificado ' + $scope.fileP12.name + ' ha sido guardado correctamente');
		}).catch(function(responseError) {
			$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveP12Cert)');
		})

    }

	$scope.uploadedP12File = function (element) {
		if(element.files.length > 0){
			$scope.fileSelected = true;
			$scope.fileP12      = element.files[0];
			$scope.fileP12.path = element.files[0].name;
		} else{
			$scope.fileSelected = false;
			$scope.fileP12      = undefined
		}

		$scope.$apply();
	}

	$scope.saveLTVCert = function (domainCertificates) {

		domainRESTServices.uploadLTVFile($scope.fileLTV, tokenManager.getDomainId() ).then(function(responseSuccess) {
			refreshDomainFields(responseSuccess);
			$rootScope.$broadcast('callSuccess', 'El certificado ' + $scope.fileP12.name + ' ha sido guardado correctamente');
		}).catch(function(responseError) {
			$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveLTVCert)');
		})

    }

	$scope.uploadLTVCert = function(element) {
		if(element.files.length > 0){
			$scope.fileLTVSelected = true;
			$scope.fileLTV      = element.files[0];
			$scope.fileLTV.path = element.files[0].name;
		} else{
			$scope.fileLTVSelected = false;
			$scope.fileLTV      = undefined
		}

		$scope.$apply();
	}

	$scope.saveCertInfo = function (domainCertTsaFields, disableFileCertUpload, disableTsa) {
		console.log(disableFileCertUpload);

		if(angular.isNull(domainCertTsaFields.tsaUsername))
			domainCertTsaFields.tsaUsername = '';
		if(angular.isNull(domainCertTsaFields.tsaPassword))
			domainCertTsaFields.tsaPassword = '';

		var domainCertificates = {}
		if(disableFileCertUpload){
			domainCertificates.certificate   = "";
			domainCertificates.certificatePK = "";
		} else {
			domainCertificates.certificate     = domainCertTsaFields.certificate;
			domainCertificates.certificatePK   = domainCertTsaFields.certificatePK;
			domainCertificates.certificatePass = domainCertTsaFields.certificatePass;
		}

		domainCertificates.tsaURL      = domainCertTsaFields.tsaURL;
		domainCertificates.tsaUsername = domainCertTsaFields.tsaUsername;
		domainCertificates.tsaPassword = domainCertTsaFields.tsaPassword;

		domainRESTServices.saveCertificatesConf(domainCertificates, tokenManager.getDomainId()).then(function (responseSuccess) {
			$rootScope.$broadcast('callSuccess', 'GUARDADO');
			refreshDomainFields(responseSuccess);
		}).catch(function(responseError) {
        	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveCertInfo)');
		})
	};

	$scope.editca = function (allowedCa) {
		var caObject = {}

		caObject.cn = allowedCa.cn;
		caObject.domainid = allowedCa.domainid;
		caObject.id = allowedCa.id;
		caObject.info = allowedCa.info;
		caObject.mapping = allowedCa.mapping;
		caObject.name = allowedCa.name;

        domainServices.setAllowedCAObject(caObject);

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'caModal.html',
          controller: 'CaModalController',
          windowClass: 'dialogGeneral'
        });
	};

	$scope.deleteca = function (allowedCaObject) {
		$http({
			  method: 'DELETE',
			  url: 'services/domain/delete/allowedca/'+tokenManager.getDomainId()+'/'+allowedCaObject.id,
			}).then(function successCallback(response) {
			    $scope.allowedCaList = response.data;
			    domainServices.setAllowedCaList($scope.allowedCaList);
			    $rootScope.$broadcast('callSuccess', 'BORRADA CORRECTAMENTE');

			  }, function errorCallback(responseError) {
	            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: delete operation type)');

			  });

	}


	$scope.editacta = function (actaObject) {
		console.log(actaObject)
		var actaObjectTemp = {}
		actaObjectTemp.domainid = actaObject.domainid
		actaObjectTemp.extra = actaObject.extra
		actaObjectTemp.id = actaObject.id
		actaObjectTemp.name = actaObject.name
		actaObjectTemp.path = actaObject.path
		actaObjectTemp.used = actaObject.used

		domainServices.setActaObject(actaObjectTemp);

		var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'actaModal.html',
          controller: 'ActaModalController',
          windowClass: 'dialogGeneral'
        });

	};

	$scope.deleteacta = function (actaObject) {
		$http({
			  method: 'DELETE',
			  url: 'services/domain/delete/actatemplate/'+tokenManager.getDomainId()+'/'+actaObject.id,
			}).then(function successCallback(response) {
			    console.log(response);
			    $scope.actasList = response.data;
			    domainServices.setActasList($scope.actasList);
			    $rootScope.$broadcast('callSuccess', 'BORRADA CORRECTAMENTE');

			  }, function errorCallback(responseError) {
				if(responseError.status==406) {
					$rootScope.$broadcast('callError', 'La plantilla de acta no puede ser eliminada debido a que está asociada a tipos de operación.');
				}
				else{
		            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: delete acta template)');
				}

			  });

	}

	$scope.editusersgroup = function (usersGroup) {
		var usersGroupObject = {}

		usersGroupObject.id = usersGroup.id;
		usersGroupObject.domainID = usersGroup.domainID;
		usersGroupObject.groupadmin = usersGroup.groupadmin;
		usersGroupObject.parentid = usersGroup.parentid;
		if(usersGroup.id>0){
			usersGroupObject.groupName = usersGroup.groupName;
			usersGroupObject.childrens = usersGroup.childrens;
		}
		else{
			usersGroupObject.groupName='';
		}
        domainServices.setUsersGroupObject(usersGroupObject);

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'md',
          templateUrl: 'usersgroupModal.html',
          controller: 'UsersGroupModalController',
          windowClass: 'dialogGeneral'
        });
	};


	$scope.loadDomainData = function () {

		$scope.dtInstanceOpCallback = dtInstanceOpCallback;
		$scope.dtInstanceOp;

		$scope.dtInstanceUserCallback = dtInstanceUsersCallback;
		$scope.dtInstanceUser;

		//BioDocs table instance
		$scope.dtInstanceBioDocs = {};

		$scope.dtOptionsOp = DTOptionsBuilder.newOptions()
		.withOption('aLengthMenu', [5, 10])
		.withPaginationType('simple_numbers');
	    $scope.dtColumnsOp = [
	        DTColumnDefBuilder.newColumnDef(0),
	        DTColumnDefBuilder.newColumnDef(1),
	        DTColumnDefBuilder.newColumnDef(2),
	        DTColumnDefBuilder.newColumnDef(3).withTitle('Acciones').notSortable()
	    ];

	    //Options for the BioDocs table.
	    $scope.dtOptionsBioDocs = DTOptionsBuilder.newOptions()
			.withOption('aLengthMenu', [5, 10])
			.withPaginationType('simple_numbers');
		//Column's definition for the bio docs.
	    $scope.dtColumnsBioDocs = [
	        DTColumnDefBuilder.newColumnDef(0).withClass('col-sm-4 center-text'),
	        DTColumnDefBuilder.newColumnDef(1).withClass('col-sm-4 center-text'),
	        DTColumnDefBuilder.newColumnDef(2).withClass('col-sm-2 center-text'),
	        DTColumnDefBuilder.newColumnDef(3).withClass('col-sm-1 center-text'),
	        DTColumnDefBuilder.newColumnDef(4).withTitle('Acciones').notSortable()
	    ];

	    $scope.dtOptionsUser = DTOptionsBuilder.newOptions()
		.withOption('aLengthMenu', [5, 10])
	    .withPaginationType('simple_numbers');
	    $scope.dtColumnsUser = [
	        DTColumnDefBuilder.newColumnDef(0),
	        DTColumnDefBuilder.newColumnDef(1),
	        DTColumnDefBuilder.newColumnDef(2),
	        DTColumnDefBuilder.newColumnDef(3),
	        DTColumnDefBuilder.newColumnDef(4),
	        DTColumnDefBuilder.newColumnDef(5).notVisible(),
	        DTColumnDefBuilder.newColumnDef(6).notVisible(),
	        DTColumnDefBuilder.newColumnDef(7).notVisible(),
	        DTColumnDefBuilder.newColumnDef(8).notVisible(),
	        DTColumnDefBuilder.newColumnDef(9).withTitle('Acciones').notSortable()
	    ];
	    
	    $scope.importLDAPUser = false;

	    $scope.domainID = tokenManager.getDomainId();
		
		domainRESTServices.getDomainData(tokenManager.getDomainId()).then(
				function (responseSuccess) {
					$scope.domainData = responseSuccess.data;
					
					refreshDomainFields(responseSuccess);
					
					if (responseSuccess.data.advancedOptions.useLDAP) {
						$scope.importLDAPUser = true;
					}
			    	$rootScope.$broadcast('callSuccess', 'Cargado');
				},
				function (responseError) {
					$scope.domainData = {};
					$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: get domain data)');
				}
		)
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

	$scope.deleteDoc = function(documentToDelete) {
		domainRESTServices.deleteBioDoc(documentToDelete).then(
			function(responseSuccess) {
				$rootScope.$broadcast('callSuccess', 'El documento ' + documentToDelete.documentname + ' ha sido borrado correctamente.');
				$scope.bioDocs = responseSuccess.data;
				domainServices.setBioDocsList($scope.bioDocs);

			},
			function(responseError) {
				$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteDoc)');
			}
		)
	}

	//Implementing the 'add bio doc' functionality.
	$scope.openDocModal = function(documentSelected) {
		console.log(documentSelected)
		var doc = angular.copy(documentSelected);
		var modalBioDocs = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'bioDocsModal.html',
          controller: 'BioDocsController',
          windowClass: 'dialogGeneral',
          resolve: {
          	docSelected: function() {
          		return doc;
          	},
          	idDomain: function() {
          		return tokenManager.getDomainId();
          	}
          }
        });

        modalBioDocs.result.then(
        	function(arrayOfDocs) {
        		//Modal closed, take the array returned and setted as bioDocs.
        		$scope.bioDocs = arrayOfDocs;
        		domainServices.setBioDocsList($scope.bioDocs);
        	},
        	function(){

        	}
        )
	}

	$scope.editUser = function (user) {

		var userObject = angular.copy(user);

		if(!angular.isUndefinedOrNull(userObject)){
			userObject.userpassword = undefined;
			userObject.role = "" + userObject.role;
			userObject.state = "" + userObject.state;
			userObject.groupid = "" + userObject.groupid;
		}
		
        domainTables.setUserTable($scope.dtInstanceReminders);

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'userModal.html',
		  controller: 'UserController',
          windowClass: 'dialogGeneral',
		  backdrop: false,
		  resolve: {
			user: function () {
				return userObject;
			}
		  }
        });

        modalInstance.result.then(
        	//The user has been saved/modified correctly.
        	function(responseSuccess) {
        		$scope.usersList = domainServices.getUserList();
        	},
        	//Something bad occurred.
        	function(responseError) {
				if(!angular.isUndefinedOrNull(responseError.data))
        			$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: editUser)');
        	}
        )
	}
	
	$scope.importUser = function () {
		
		 var modalInstance = $uibModal.open({
	          animation: true,
	          size: 'lg',
	          templateUrl: 'importUserModal.html',
	          controller: 'ImportUserController',
	          windowClass: 'dialogGeneral'
	        });

	        modalInstance.result.then(
	        	//The user has been saved/modified correctly.
	        	function() {
	        		domainRESTServices.getDomainUsers($scope.domainID).then(
	        				function (ResponseSuccess) {
	        					$scope.usersList = ResponseSuccess.data;
	        				},
	        				function (ResponseError) {
	        					$rootScope.$broadcast('callError', ResponseError.data.failure + ' (desde: getDomainUsers)')
	        				}
	        		);
	        	},
	        	//Something bad occurred.
	        	function() {
	        		//Modal dismiss
	        	}
	        )
	}

	$scope.deleteUser = function(user){
		domainRESTServices.deleteDomainUser(user.id).then(
				function (successCallback) {
					$rootScope.$broadcast('callSuccess', 'Usuario: '+ user.useremail+' borrado correctamente!');
					angular.forEach($scope.usersList, function (userValue, index) {
						if(userValue.id === user.id)
							$scope.usersList.splice(index, 1);
					})
				},
				function (errorCallback) {
					$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteUser)');
				}
			);

	}
	
	$scope.extraModified = function() {
		$scope.extraInfoModified = true;
	}

	$scope.addExtraInfo = function () {
		var arrayExtras = angular.copy($scope.extraFields);
		arrayExtras.push({
			identifier : "",
			value : "",
			label :"",
			defaultValue : ""
		});
		$scope.extraFields = arrayExtras;
		$scope.extraInfoModified = true;

	}

	$scope.removeExtraInfo = function (indexToRemove) {
		$scope.extraFields.splice(indexToRemove, 1);
		var arrayExtras = angular.copy($scope.extraFields);
		$scope.extraFields = arrayExtras;
		$scope.extraInfoModified = true;
	}

	$scope.saveGeneralInfo = function (domainGeneralInfoFields) {
		var domainGeneral = {}
		domainGeneral.configurationID = domainGeneralInfoFields.configurationID;
		domainGeneral.domainName = domainGeneralInfoFields.domainName;


		domainRESTServices.saveGeneralInfo(domainGeneral, tokenManager.getDomainId()).then(
			function (responseSuccess) {
				$rootScope.$broadcast('callSuccess', 'GUARDADO');
				refreshDomainFields(responseSuccess);
			},
			function (responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveGeneralInfo)');

			}
		)
	};

	$scope.saveStorageConf = function (domainStorageFields) {
		var domainStorage = {}
		domainStorage.encryptionLevel = domainStorageFields.encryptionLevel;
		domainStorage.sizeLimit = domainStorageFields.sizeLimit;
		domainStorage.totalSizeLimit = domainStorageFields.totalSizeLimit;
		domainStorage.basePath = domainStorageFields.basePath;
		domainStorage.storageType = domainStorageFields.storageType;
		domainStorage.stusername = domainStorageFields.stusername;
		domainStorage.stpassword = domainStorageFields.stpassword;

		domainRESTServices.saveStorageConf(domainStorage, tokenManager.getDomainId()).then(
			function (responseSuccess) {
				$rootScope.$broadcast('callSuccess', 'GUARDADO');
				refreshDomainFields(responseSuccess);
			},
			function (responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveStorageInfo)');

			}
		)
	};

	$scope.saveEmailInfo = function (domainEmailFields) {

		if(angular.isNull(domainEmailFields.emailUsername))
			domainEmailFields.emailUsername = '';
		if(angular.isNull(domainEmailFields.emailPassword))
			domainEmailFields.emailPassword = '';

		var domainEmail = {}
		domainEmail.emailReplyTo    = domainEmailFields.emailReplyTo;
		domainEmail.emailSender     = domainEmailFields.emailSender;
		domainEmail.emailServer     = domainEmailFields.emailServer;
		domainEmail.emailServerType = domainEmailFields.emailServerType;
		domainEmail.emailUsername   = domainEmailFields.emailUsername;
		domainEmail.emailPassword   = domainEmailFields.emailPassword;

		domainRESTServices.saveEmailConf(domainEmail, tokenManager.getDomainId()).then(
			function (responseSuccess) {
				$rootScope.$broadcast('callSuccess', 'GUARDADO');
				refreshDomainFields(responseSuccess);
			},
			function (responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveEmailConfig)');

			}
		)
	};

	$scope.saveUrlInfo = function (domainURLFields) {
		var domainURLInfo = {}
		domainURLInfo.esignUrl        = domainURLFields.esignUrl;
		domainURLInfo.serverDomain    = domainURLFields.serverDomain;
		domainURLInfo.availableFunct1 = domainURLFields.availableFunct1;
		domainURLInfo.availableFunct2 = domainURLFields.availableFunct2;
		domainURLInfo.availableFunct3 = domainURLFields.availableFunct3;
		domainURLInfo.availableFunct4 = domainURLFields.availableFunct4;

		domainRESTServices.saveURLConf(domainURLInfo, tokenManager.getDomainId()).then(
			function (responseSuccess) {
				$rootScope.$broadcast('callSuccess', 'GUARDADO');
				refreshDomainFields(responseSuccess);
			},
			function (responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveUrlInfo)');

			}
		)
	};

	$scope.tryEmailInfo = function(domainEmailFields) {

		if(angular.isNull(domainEmailFields.emailUsername))
			domainEmailFields.emailUsername = '';
		if(angular.isNull(domainEmailFields.emailPassword))
			domainEmailFields.emailPassword = '';

		var emailFields = angular.copy(domainEmailFields);

		var modalBioDocs = $uibModal.open({
          animation: true,
          size: 'sm',
          templateUrl: 'tryEmailModal.html',
          controller: 'TesterEmail',
          windowClass: 'dialogGeneral',
          resolve: {
          	domainEmailInfo: function() {
          		return emailFields;
          	},
          	idDomain: function() {
          		return tokenManager.getDomainId();
          	}
          }
        });
	}

	$scope.trySMSInfo = function(domainSmsFields) {
		var domainSMSInfo = angular.copy(domainSmsFields);
		var modalBioDocs = $uibModal.open({
          animation: true,
          size: 'sm',
          templateUrl: 'trySmsModal.html',
          controller: 'TesterSms',
          windowClass: 'dialogGeneral',
          resolve: {
          	domainSMSInfo: function() {
          		return domainSMSInfo;
          	},
          	idDomain: function() {
          		return tokenManager.getDomainId();
          	}
          }
        });

	}

	$scope.saveSMSInfo = function (domainSmsFields) {
		console.log(domainSmsFields);
		var domainSMSInfo = {}
		domainSMSInfo.smsServerType = domainSmsFields.smsServerType;
		domainSMSInfo.smsServer     = domainSmsFields.smsServer;
		domainSMSInfo.smsSender     = domainSmsFields.smsSender;
		domainSMSInfo.smsReplyTo    = domainSmsFields.smsReplyTo;
		domainSMSInfo.smsUsername   = domainSmsFields.smsUsername;
		domainSMSInfo.smsPassword   = domainSmsFields.smsPassword;

		domainRESTServices.saveSMSConf(domainSMSInfo, tokenManager.getDomainId()).then(
			function (responseSuccess) {
				$rootScope.$broadcast('callSuccess', 'GUARDADO');
				refreshDomainFields(responseSuccess);
			},
			function (responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveSMSInfo)');

			}
		)
	};

	$scope.generateSMSJSONObject = function(jsonString) {
		try{
			JSON.parse(jsonString);
			$scope.domainSms.smsConfiguration = JSON.parse(jsonString);
			$scope.isSMSJSONValid = true;
		} catch(e){
			$scope.domainSms.smsConfiguration = {};
			$scope.isSMSJSONValid = false;
		}
	}

	$scope.saveExtraInfo = function (domainExtraFields) {

		// Check if the domain extra fields contain some whitespaces in the identifier value, if so we replace that whitespaces with underscores.
		for (var i = domainExtraFields.length - 1; i >= 0; i--) {
			if (regexWhiteSpaces.test(domainExtraFields[i].identifier)){
				domainExtraFields[i].identifier = domainExtraFields[i].identifier.split(' ').join('_')
			}
		}

		domainRetrieved.extraFields = JSON.stringify(domainExtraFields);


		domainRESTServices.saveExtraFieldsConf(domainExtraFields, tokenManager.getDomainId()).then(
			function (responseSuccess) {
				$rootScope.$broadcast('callSuccess', 'GUARDADO');
				refreshDomainFields(responseSuccess);
			},
			function (responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveExtraInfo)');

			}
		)
	};

	$scope.saveNewOp = function (newOp, addOperationTypeForm) {

		$http({
		  method: 'POST',
		  url: 'services/domain/save/operationtype/ofdomain/'+tokenManager.getDomainId(),
		  data: JSON.stringify(newOp)
		}).then(function successCallback(response) {
		    console.log(response);
		    $scope.operationsList = response.data;
		    domainServices.setOperationList(response.data);
	    	$rootScope.$broadcast('callSuccess', 'SAVED');
	    	addOperationTypeForm.$setPristine();
	    	newOp.name = "";

		  }, function errorCallback(responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveNewOp)');
	    		newOp.name = "";
		    	addOperationTypeForm.$setPristine();


		  });

	}

	function saveDomain (domain) {
		$http({
		  method: 'POST',
		  url: 'services/domain/save/'+tokenManager.getDomainId(),
		  data: JSON.stringify(domain)
		}).then(function successCallback(response) {
		    domainRetrieved = response.data;
		    $scope.domainInfo = domainRetrieved;
		    $scope.domainStorage = domainRetrieved;
		    $scope.domainCertificates = domainRetrieved;
		    $scope.domainEmail = domainRetrieved;
		    $scope.domainUrl = domainRetrieved;
		    $scope.domainExtra = domainRetrieved;
		    $scope.domainSms = domainRetrieved;
	    	$rootScope.$broadcast('callSuccess', 'SAVED');


		  }, function errorCallback(responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveDomain)');

		  });
	}


	$scope.saveAllowedCa = function (newAllowedCa, addAllowedCaForm) {

		$http({
		  method: 'POST',
		  url: 'services/domain/save/allowedca/ofdomain/'+tokenManager.getDomainId(),
		  data: JSON.stringify(newAllowedCa)
		}).then(function successCallback(response) {
		    console.log(response);
		    $scope.allowedCaList = response.data;
		    domainServices.setAllowedCaList($scope.allowedCaList);
	    	$rootScope.$broadcast('callSuccess', 'SAVED');
	    	addAllowedCaForm.$setPristine();
	    	newAllowedCa.name = "";

		  }, function errorCallback(responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveAllowedCa)');
            	newAllowedCa.name = "";
            	addAllowedCaForm.$setPristine();


		  });

	};

	$scope.checkNumberOfFiles = function(isValid) {
		if($scope.actaFiles.length === 0 || !isValid)
			return true;
		else
			return false;
	}

	$scope.actaFiles = [];

	$scope.uploadedActaFile = function(element, form) {
		if(element.files[0].type === 'application/pdf'){
			$scope.$apply(function($scope) {
				$scope.actaFiles[0] = element.files;
			});
		} else {
			$rootScope.$broadcast('callError', 'El fichero seleccionado no es un pdf (?!)');
			$scope.actaFiles = [];
		}
	}

	$scope.openStaticDocModal = function(documentSelected) {
		var doc = angular.copy(documentSelected);
		var modalBioDocs = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'staticDocsModal.html',
          controller: 'StaticDocsController',
          windowClass: 'dialogGeneral',
          resolve: {
          	docSelected: function() {
          		return doc;
          	},
          	idDomain: function() {
          		return tokenManager.getDomainId();
          	}
          }
        });

        modalBioDocs.result.then(
        	function(arrayOfDocs) {
        		//Modal closed, take the array returned and setted as bioDocs.
        		$scope.bioDocs = arrayOfDocs;
        		domainServices.setBioDocsList($scope.bioDocs);
        	},
        	function(){
        		//Modal dismissed
        	}
        )
	}


	$scope.saveNewActa = function (newActa, addActaForm) {

		var fd = new FormData();
		 angular.forEach($scope.actaFiles,function(file){
			 fd.append('file',file[0]);
			 });
		fd.append("datos", JSON.stringify(newActa));

		$http.post("services/domain/save/newactatemplate/ofdomain/"+tokenManager.getDomainId(), fd, {
				withCredentials : false,
			       headers : {
			        'Content-Type' : undefined
			       },
			       transformRequest : angular.identity
		}).then(function successCallback(response) {
		    console.log(response);
		    $scope.actasList = response.data;
		    domainServices.setActasList($scope.actasList);
	    	$rootScope.$broadcast('callSuccess', 'Acta guardada correctamente.');
	    	addActaForm.$setPristine();
	    	$('#actaFile').val(null);
	    	$scope.actaFiles = [];
	    	newActa.name = null;
	    	// newAllowedCa.name = "";

		  }, function errorCallback(responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveNewActa)');
		  });

	};
	
	$scope.saveLDAPConfig = function(ldapServer) {
		
		domainRESTServices.saveLDAPConf(ldapServer, tokenManager.getDomainId()).then(
			function (responseSuccess) {
				$rootScope.$broadcast('callSuccess', 'GUARDADO');
				refreshDomainFields(responseSuccess);
			},
			function (responseError) {
            	$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveLDAPconfig)');
			}
		)
	}
	
	$scope.tryLDAPConection = function(ldapServer) {
		
		domainRESTServices.testLdapConnection(ldapServer, tokenManager.getDomainId()).then(function (responseSuccess) {
        	$rootScope.$broadcast('callSuccess', 'La configuración del LDAP es correcta.');
		}).catch(function (responseError) {
        	$rootScope.$broadcast('callError', responseError.data.failure);
		})
	}		


	function refreshDomainFields (response) {
		domainRetrieved              = response.data;
    	$scope.disableFileCertUpload = domainRetrieved.usingDefaultCert;
	    $scope.domainInfo            = domainRetrieved;
	    $scope.domainStorage         = domainRetrieved;
	    $scope.domainCertificates    = domainRetrieved;

	    $scope.certificateDefault   = {};
	    $scope.certificateRetrieved = {};

	    $scope.certificateRetrieved.info     = angular.copy(domainRetrieved.certificate)
	    $scope.certificateRetrieved.validity = angular.copy(domainRetrieved.certificatePK)

	    $scope.certificateDefault.info     = angular.copy(domainRetrieved.certificateDefaultInfo);
	    $scope.certificateDefault.validity = angular.copy(domainRetrieved.certificateDefaultValidity);

	    if(($scope.domainCertificates.tsaURL === DefaultTSA.url || $scope.domainCertificates.tsaURL === '') && ($scope.domainCertificates.tsaUsername === DefaultTSA.username || $scope.domainCertificates.tsaUsername === '')){
	    	$scope.disableTsa = true;
	    	$scope.saveDefaultTsa($scope.disableTsa);
	    }


		$scope.object = JSON.parse(domainRetrieved.logos);
		if(domainRetrieved.logos === "{}" || domainRetrieved.logos.indexOf('primaryColor') == -1) {
			$scope.object.primaryColor = '#1999E7';
		}
		if(domainRetrieved.logos === "{}" || domainRetrieved.logos.indexOf('accentColor') == -1) {
			$scope.object.accentColor = '#B0BEC5';
		}
		if($scope.object.primaryColor.indexOf('undefined') !== -1) {
			$scope.signatureColors.primaryColor = '#1999E7';
		} else {
			$scope.signatureColors.primaryColor = JSON.parse(domainRetrieved.logos).primaryColor;
		}
		if($scope.object.accentColor.indexOf('undefined') !== -1) {
			$scope.signatureColors.accentColor  = '#B0BEC5';
		} else {
	    	$scope.signatureColors.accentColor  = JSON.parse(domainRetrieved.logos).accentColor;
		}
	    

	    $scope.domainEmail                = domainRetrieved;
	    $scope.domainUrl                  = domainRetrieved;
	    $scope.extraFields                = domainRetrieved.extraFields;
	    $scope.listOfSmsServerType        = domainRetrieved.listOfSmsServerType;
	    $scope.listOfEmailServerType      = domainRetrieved.listOfEmailServerType;
	    $scope.domainSms                  = domainRetrieved;
	    $scope.domainSms.smsConfiguration = JSON.parse(domainRetrieved.smsServerType);
	    $scope.actasList                  = response.data.actasList;
	    $scope.allowedCaList              = response.data.allowedCasList;
	    $scope.operationsList             = response.data.operationsTypeList;
	    $scope.usersList                  = response.data.users;
	    $scope.bioDocs                    = response.data.bioDocs;
	    $rootScope.usersgroupsList        = response.data.usersgroups;
	    $rootScope.usersgroupsListTab     = response.data.usersgroupsTab;
	    $scope.ldapServer			  = domainRetrieved.advancedOptions.ldapServer;

	    domainServices.setUsersGroupList($rootScope.usersgroupsList);
	    domainServices.setUserList($scope.usersList);
	    domainServices.setAllowedCaList($scope.allowedCaList);
    	domainServices.setOperationList(response.data.operationsTypeList);
    	domainServices.setActasList($scope.actasList);
    	domainServices.setExtraFields($scope.extraFields);
    	domainServices.setBioDocsList($scope.bioDocs);
    	var logos = JSON.parse(response.data.logos);

    	if (angular.isUndefined(logos.cssFilePath)){
    		$scope.cssFile = 'Ningun CSS subido'
    	} else
    		$scope.cssFile = 'cssFile.css'



	    $scope.isLoaded = true;
	}
}]);

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('UserController',
    ['$scope', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'domainRESTServices', 'domainServices', 'tokenManager', '$timeout', 'user',
    function($scope, $uibModalInstance, $stateParams, $http, $rootScope, domainRESTServices, domainServices, tokenManager, $timeout, user){
        var isNew = angular.isUndefinedOrNull(user);

        $scope.checkIfAltering = function(){
        	return false;
        }

        $scope.hide = true;
        $scope.isNewUser = isNew;
        $scope.user = user;

        $scope.saveUser= function (user) {
        	user.domainid = parseInt(tokenManager.getDomainId());
            user.role = parseInt(user.role);
            user.state = parseInt(user.state);

            var pwdHashed = CryptoJS.SHA256(""+user.userpassword);
			var pwdHashedB64= pwdHashed.toString(CryptoJS.enc.Base64);
			user.userpassword = pwdHashedB64;

            domainRESTServices.saveDomainUser(tokenManager.getDomainId(), user).then(
            	function (successCallback) {
            		user.userpassword = '';
            		user.userpasswordrepeated = '';
            		user.id = parseInt(successCallback.data);
            		user.domainid = tokenManager.getDomainId();
                    
            		if(isNew)
            			domainServices.getUserList().push(user);
            		else {
            			angular.forEach(domainServices.getUserList(), function (userValue, index) {
            				if(userValue.id === user.id){
            					console.log(userValue)
            					domainServices.getUserList().splice(index, 1, user);
            				}
            			})
            		}
                    
					$rootScope.$broadcast('callSuccess', 'Usuario: '+ user.useremail+' creado correctamente!');
            		$uibModalInstance.close('');


            	},
            	function (responseError) {
            		 if(responseError.status === 409){
            		 	$scope.user.userpassword = user.userpasswordrepeated
                        $scope.response = responseError.data.failure;
                        $scope.hide = false;
                        $timeout(function() {
                          $scope.hide = true;
                        }, 6000);
                    } else {
                      $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveUser)');
                      $uibModalInstance.dismiss('');
                    }
            	}
            )

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
}]);


/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('ImportUserController',
    ['$scope', '$uibModalInstance', '$rootScope', 'domainRESTServices', 'tokenManager', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function($scope, $uibModalInstance, $rootScope, domainRESTServices, tokenManager, DTOptionsBuilder, DTColumnDefBuilder){
    	
    	//Options for the UsersLDAP table.
	    $scope.dtOptionsUsersLDAP = DTOptionsBuilder.newOptions()
			.withOption('aLengthMenu', [8])
			.withOption('bLengthChange', false)
			.withOption('searching', false)
			.withPaginationType('simple_numbers');
	    
		//Column's definition for the UsersLDAP.
	    $scope.dtColumnDefsUsersLDAP = [
	        DTColumnDefBuilder.newColumnDef(0).withClass('col-sm-1 center-text'),
	        DTColumnDefBuilder.newColumnDef(1).withClass('col-sm-4 center-text'),
	        DTColumnDefBuilder.newColumnDef(2).withClass('col-sm-4 center-text'),
	        DTColumnDefBuilder.newColumnDef(3).withClass('col-sm-3 center-text')
	    ];

	    $scope.successSearch = false;
        $scope.usersLDAPList = [];
        $scope.selectedLDAPUser = [];
        $scope.invalidSearch = true;
        

        // list of LDAP users
        $scope.searchLDAPUsers = function(filter) {
        	
        	if (filter == undefined){
        		$scope.successSearch = false;
        		$rootScope.$broadcast('callError', 'Debe indicar un filtro de búsqueda ' + ' (desde: searchLDAPUsers)');
        		$uibModalInstance.dismiss('');
        	}else{
        	
        	domainRESTServices.getUsersLdap(filter, tokenManager.getDomainId()).then(
                	function (ResponseSuccess) {
                		$scope.successSearch = true;
                		$scope.usersLDAPList = ResponseSuccess.data;
                	},
                	function (ResponseError) {
                		$scope.successSearch = false;
                		$rootScope.$broadcast('callError', ResponseError.data.failure + ' (desde: searchLDAPUsers)');
                		$uibModalInstance.dismiss('');
                	}
                );        	
        	}
        }
        
        $scope.disableImportButton = function (selectedUser){
        	
        	var cont = null;
        	angular.forEach(selectedUser, function(valueSelected, index) {
        		if (valueSelected)
        			cont++;
        	});
        	
        	if (cont == null)
        		return true;
        	else 
        		return false;
        }
        
        $scope.importSelectedUser = function (selectedLDAPUser) {
        	var lstUser = [];
        	
        	angular.forEach(selectedLDAPUser, function(value, index) {
        		if (value) {
        			$scope.usersLDAPList[index].domainid = parseInt(tokenManager.getDomainId());
        			$scope.usersLDAPList[index].groupid = $scope.user.groupid;
        			lstUser.push($scope.usersLDAPList[index]);        			
        		}
        	});
        	
        	domainRESTServices.saveUsersLdap(lstUser, tokenManager.getDomainId()).then(
        		function (ResponseSucces) {
        			
        			$uibModalInstance.close();
	    			$rootScope.$broadcast('callSuccess', 'La importación se ha realizado correctamente.');
        		},
        		function (ResponseError) {
        			$uibModalInstance.dismiss('');
        			$rootScope.$broadcast('callError', ResponseError.data.failure + ' (desde: importSelectedUser)');
        		}
        	);
        }
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
        
        $scope.countChart = function (searchLDAP){
        	if (searchLDAP.length >= 3){
        		 $scope.invalidSearch = false;
        	}else{
        		$scope.invalidSearch = true;
        	}
        	
        }
}]);

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('CaModalController',
    ['$scope', '$uibModalInstance', '$http', '$rootScope', 'domainRESTServices', 'domainServices',
    function($scope, $uibModalInstance, $http, $rootScope, domainRESTServices, domainServices){

    	$scope.ca = domainServices.getAllowedCAObject();

        $scope.saveCA= function (ca) {
            console.log(ca);
            domainRESTServices.modifyCaObject(ca).then(
            	function (responseSuccess) {
            		angular.forEach(domainServices.getAllowedCaList(), function (caObject, index) {
            			if(caObject.id === ca.id ){
            				caObject.name = ca.name;
            				caObject.mapping = ca.mapping;
            				caObject.cn = ca.cn;
            			}
            		})
		    		$uibModalInstance.dismiss('');
	    			$rootScope.$broadcast('callSuccess', 'SAVED');
            	},
            	function (responseError) {
            		$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveCA)');
            		$uibModalInstance.dismiss('');
            	}
            )
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
}]);



/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('ActaModalController',
    ['$scope', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'domainRESTServices', 'domainServices',
    function($scope, $uibModalInstance, $stateParams, $http, $rootScope, domainRESTServices, domainServices){
    	var file = undefined;
    	$scope.actatemplate = domainServices.getActaObject();

    	$scope.uploadedFile = function (element) {
    		file = element.files[0];
    		$scope.actatemplate.path = element.files[0].name;
    		$scope.$apply();
    	}



        $scope.saveActaTemplate = function (actatemplate) {
        	var fd = new FormData();
        	if(angular.isDefined(file)){
        		fd.append('file',file);
        	}

        	fd.append('datos', JSON.stringify(actatemplate))
        	$http.post("services/domain/modify/actatemplate/ofdomain/"+actatemplate.domainid, fd, {
					withCredentials : false,
			       	headers : {
				        'Content-Type' : undefined
			       	},
			       	transformRequest : angular.identity,
		       }).then(
        		function (responseSuccess) {
        			angular.forEach(domainServices.getActasList(), function (actaObject, index) {
        				if (responseSuccess.data.id === actaObject.id) {
        					actaObject.name = responseSuccess.data.name;
        					actaObject.path = responseSuccess.data.path;
        				}
        			})
        			$rootScope.$broadcast('callSuccess', 'SAVED');
        			$uibModalInstance.dismiss('');
        		},
        		function (responseError) {
        		}
        	)
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
}]);

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('UsersGroupModalController',
    ['$scope', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'domainRESTServices', 'domainServices','tokenManager',
    function($scope, $uibModalInstance, $stateParams, $http, $rootScope, domainRESTServices, domainServices, tokenManager){
    	$scope.usersgroup = domainServices.getUsersGroupObject();

    	$scope.saveUsersGroup = function (usersgroup) {
            console.log(usersgroup);
            domainRESTServices.saveDomainUsersGroup(tokenManager.getDomainId(), usersgroup).then(
            	function (responseSuccess) {
            		$rootScope.usersgroupsList = responseSuccess.data.usersgroups;
    			    domainServices.setUsersGroupList($rootScope.usersgroupsList);
    			    $rootScope.usersgroupsListTab = responseSuccess.data.usersgroupsTab;

    			    $uibModalInstance.dismiss('');
	    			$rootScope.$broadcast('callSuccess', 'SAVED');
            	},
            	function (responseError) {
            		$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveUsersgroup)');
            		$uibModalInstance.dismiss('');
            	}
            );
        }

    	$scope.deleteUsersGroup = function (usersgroup) {
            console.log(usersgroup);
            domainRESTServices.deleteDomainUsersGroup(tokenManager.getDomainId(), usersgroup.id).then(
            	function (responseSuccess) {
            		$rootScope.usersgroupsList = responseSuccess.data.usersgroups;
    			    domainServices.setUsersGroupList($rootScope.usersgroupsList);
    			    $rootScope.usersgroupsListTab = responseSuccess.data.usersgroupsTab;

            		$uibModalInstance.dismiss('');
	    			$rootScope.$broadcast('callSuccess', 'SAVED');
            	},
            	function (responseError) {
            		$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveUsersgroup)');
            		$uibModalInstance.dismiss('');
            	}
            );
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
}]);

/**
*   Controller for the BioDocs pill
*
*   Description
*/
angular.module('O2DigitalSite').controller('BioDocsController',
	function(
		$scope,
		$uibModalInstance,
		$http,
		$rootScope,
		domainRESTServices,
		docSelected,
		idDomain){


		console.log(docSelected);

		var bioPrefix    = 'BIO ';
		var staticPrefix = "STATIC BIO ";

		$scope.isNew;

		//Check if is new
		if (angular.isUndefined(docSelected)) $scope.isNew = true;
		else $scope.isNew = false;

		//If it is not new we set the scope object with the selected document and the signers.
		if (!$scope.isNew){
    		$scope.document = docSelected;
    		$scope.signers = formatMetadataForModal(JSON.parse(docSelected.metadata));
    	} else //otherwise we set the signers as an empty array.
    		$scope.signers = [];

    	//everytime we change the signer's number we have to refresh the view.
		$scope.changeIt = function (docSigners) {

    		if($scope.signers.length < docSigners){

		    	for(var i = $scope.signers.length; i < docSigners; i++){
    				var signer = {
			    		"pag":"",
			    		"x": "",
			    		"y": "",
			    		"label": ""
		    		}
    				$scope.signers.push(signer);
		    	}
    		} else if(angular.isUndefined(docSigners)){
    			$scope.signers = [];
    		} else{
    			var signersArrayLength = $scope.signers.length;
    			for(var i = docSigners; i < signersArrayLength; i++)
    				$scope.signers.pop();
    		}
		}


    	$scope.saveBioDoc = function (documentToSave) {

    		documentToSave.metadata  = JSON.stringify(formatMetadataForWS($scope.signers));
    		documentToSave.domainid  = parseInt(idDomain);
    		if (!documentToSave.reference.startsWith(bioPrefix) && !documentToSave.reference.startsWith(staticPrefix))
    			documentToSave.reference = bioPrefix.concat(documentToSave.reference);

    		domainRESTServices.saveBioDoc(documentToSave).then(
    			function(responseSuccess) {
    				if($scope.isNew)
    					$rootScope.$broadcast('callSuccess', 'El documento ' + documentToSave.documentname + ' ha sido guardado con exito.');
    				else
    					$rootScope.$broadcast('callSuccess', 'El documento ' + documentToSave.documentname + ' ha sido modificado con exito.');

    				$uibModalInstance.close(responseSuccess.data);

    			},
    			function(responseError) {
    				$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: BioDocsController)');
    				$uibModalInstance.dismiss('');
    			}
    		)

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }

        //Utility function to translate the signer for the modal.
        function formatMetadataForModal(metadata){
        	angular.forEach(metadata, function (signer, index) {
        		signer.x = parseInt(signer.x);
        		signer.y = parseInt(signer.y);
        		signer.pag = parseInt(signer.pag);
        	});

        	return metadata;
        }

		//Utility function to translate the signer for the Web Service.
        function formatMetadataForWS(metadata){
        	var newMetadata = []
        	angular.forEach(metadata, function (signer, index) {
        		var signerTemp = {}
                signerTemp = angular.copy(signer);
        		newMetadata.push(signerTemp);
        	});

        	return newMetadata;
        }
});


/**
*   Controller for the BioDocs pill
*
*   Description
*/
angular.module('O2DigitalSite').controller('StaticDocsController',
	function(
		$scope,
		$uibModalInstance,
		$http,
		$rootScope,
		domainRESTServices,
		docSelected,
		idDomain){

    	var prefix = "STATIC ";
		$scope.document        = {}
		$scope.isstaticbio     = false;
		$scope.positionsNumber = 1;
		$scope.signers         = [{
			"pag":"",
    		"x": "",
    		"y": "",
    		"label": ""
		}];

		var file = undefined;

		$scope.resetFields = function(checkValue) {
			if (!checkValue) {
				prefix = "STATIC ";
				$scope.positionsNumber = 1;
				$scope.signers         = [{
					"pag":"",
		    		"x": "",
		    		"y": "",
		    		"label": ""
				}];
			} else {
				prefix = "STATIC BIO ";
			}
		}

    	$scope.uploadDefaultFile = function(element) {
			file = element.files[0];
		}

		//everytime we change the signer's number we have to refresh the view.
		$scope.changeIt = function (docSigners) {

    		if($scope.signers.length < docSigners){

		    	for(var i = $scope.signers.length; i < docSigners; i++){
    				var signer = {
			    		"pag":"",
			    		"x": "",
			    		"y": "",
			    		"label": ""
		    		}
    				$scope.signers.push(signer);
		    	}
    		} else if(angular.isUndefined(docSigners)){
    			$scope.signers = [];
    		} else{
    			var signersArrayLength = $scope.signers.length;
    			for(var i = docSigners; i < signersArrayLength; i++)
    				$scope.signers.pop();
    		}
		}


    	$scope.saveDefaultDoc = function (documentToSave) {
    		documentToSave.uploadMandatory = "0";
    		if(!documentToSave.reference.startsWith(prefix))
    			documentToSave.reference = prefix + documentToSave.reference;

    		if ($scope.signers.length === 1 && $scope.signers[0].pag === '') {
    			documentToSave.metadata = '[]';
    		} else {
    			documentToSave.metadata = JSON.stringify(formatMetadataForWS($scope.signers));
    		}

    		domainRESTServices.uploadDefaultDocument(file, parseInt(idDomain), documentToSave.reference, documentToSave.uploadMandatory, documentToSave.metadata).then(
    			function(responseSuccess) {
					$rootScope.$broadcast('callSuccess', 'El documento ' + file.name + ' ha sido guardado con exito.');
    				$uibModalInstance.close(responseSuccess.data);

    			}
    		).catch(function(responseError) {
    			$rootScope.$broadcast('callError', responseError.data.failure);
    			$uibModalInstance.dismiss('');
    		})

        }



        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }

        //Utility function to translate the signer for the Web Service.
        function formatMetadataForWS(metadata){
        	var newMetadata = []
        	angular.forEach(metadata, function (signer, index) {
        		var signerTemp = {}
                signerTemp = angular.copy(signer);
        		newMetadata.push(signerTemp);
        	});

        	return newMetadata;
        }
});

/**
*   Controller for the BioDocs pill
*
*   Description
*/
angular.module('O2DigitalSite').controller('TesterSms',
	function(
		$scope,
		$uibModalInstance,
		$http,
		$rootScope,
		domainRESTServices,
		domainSMSInfo,
		idDomain){

    	$scope.sendSms = function (cellphone) {

    		domainRESTServices.testSMSConf(domainSMSInfo, parseInt(idDomain), cellphone).then(
    			function(responseSuccess) {
					$rootScope.$broadcast('callSuccess', '' + responseSuccess.data.message);
    				$uibModalInstance.close();

    			}
    		).catch(function(responseError) {
    			$rootScope.$broadcast('callError', responseError.data.failure);
    			$uibModalInstance.dismiss('');
    		})

        }



        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
});

/**
*   Controller for the BioDocs pill
*
*   Description
*/
angular.module('O2DigitalSite').controller('TesterEmail',
	function(
		$scope,
		$uibModalInstance,
		$http,
		$rootScope,
		domainRESTServices,
		domainEmailInfo,
		idDomain){

    	$scope.sendEmail = function (email) {

    		domainRESTServices.testEmailConf(domainEmailInfo, parseInt(idDomain), email).then(
    			function(responseSuccess) {
					$rootScope.$broadcast('callSuccess', '' + responseSuccess.data.message);
    				$uibModalInstance.close();

    			}
    		).catch(function(responseError) {
    			$rootScope.$broadcast('callError', responseError.data.failure);
    			$uibModalInstance.dismiss('');
    		})

        }



        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
});


/**
*   Controller for the BioDocs pill
*
*   Description
*/
angular.module('O2DigitalSite').controller('ShowActaModalController',
	function(
		$scope,
		$uibModalInstance,
		$http,
		$rootScope,
		tokenManager,
		acta){

    	if (angular.isDefined(acta.uuid) && acta.uuid !== '' && !angular.isNull(acta.uuid)) {
    		$scope.documentURL = "webapp/web/viewer.html?file=" + $rootScope.url + "services/domain/file/acta/" + tokenManager.getDomainId() + "/" + tokenManager.getToken() + '/' + acta.uuid;
    	} else {
    		$scope.documentURL = "webapp/web/viewer.html?file=" + $rootScope.url + "services/domain/file/acta/" + tokenManager.getDomainId() + "/" + tokenManager.getToken() + '/' + acta.id;
    	}

    	$scope.closeActaModal = function() {
    		$uibModalInstance.close();
    	}

});

/**
*   Controller for the BioDocs pill
*
*   Description
*/
angular.module('O2DigitalSite').controller('ShowStaticDocModalController',
	function(
		$scope,
		$uibModalInstance,
		$http,
		$rootScope,
		tokenManager,
		doc){

		$scope.documentURL = "webapp/web/viewer.html?file=" + $rootScope.url + "services/domain/file/static/" + tokenManager.getDomainId() + "/" + tokenManager.getToken() + '/' + doc.id + '/' + doc.code;

    	$scope.closeActaModal = function() {
    		$uibModalInstance.close();
    	}

});
