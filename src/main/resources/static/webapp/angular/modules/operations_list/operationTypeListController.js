angular.module('O2DigitalSite').controller('OperationTypeListController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'operationTypeManager', 'operationTypeServiceCallerESign', '$timeout', '$uibModal', 'sweet', '$log', '$q', 'tokenManager', 'domainRESTServices',
	function ($scope, $rootScope, $http, $state, $stateParams, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, operationTypeManager, operationTypeServiceCallerESign, $timeout, $uibModal, sweet, $log, $q, tokenManager, domainRESTServices) {

		$rootScope.$broadcast('rootChange', 'Solicitar Firma / Electrónica')

		var ua = window.navigator.userAgent;
		var isExplorer = false;
		if (ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1 || ua.indexOf('Edge/') > -1) {
			isExplorer = true;
		}

		var log = $log;

		var positionOfMandatoryFile = [];
		var files = [];
		var filesStatic = []
		var filesSigner = [];
		var filesStaticsSigner = [];
		var docNames = [];
		var staticDocNames = [];
		var docSignerNames = [];
		var staticDocSignerNames = [];

		var roleFirmante = -3;

		$scope.isLoaded = false;
		$scope.isLoadedMultiLevel = false;
		$scope.fields = [];
		$scope.toUpload = {};
		$scope.toUploadStatic = {};
		$scope.toUploadSigner = {};
		$scope.toUploadSignerStatic = {};
		$scope.operationFields = [];
		$scope.userFields = [];
		$scope.signatureBoxLabels = {};
		$scope.operationTypeSelected = undefined;
		$scope.operation = {};
		$rootScope.lstFirmantes = [];
		$scope.noneDefault = true;
		$scope.loggedUser;
		$scope.documents = [];
		$scope.documentsStatic = [];
		$scope.docSigner = [];
		$scope.docStaticsSigner = [];

		$scope.showPreviewDocument = [];

		// get logged user 
		domainRESTServices.getLoggedUser().then(
			function (responseSuccess) {
				$scope.loggedUser = responseSuccess.data;
			},
			function (responseError) {
				$rootScope.$broadcast('callError', responseError.data.failure + ' (desde: getLoggedUser)');
			}
		);


		$scope.loadOperationTypeList = function () {

			$scope.dtInstanceOperationTypeCallback = dtInstanceOperationTypeCallback;
			$scope.dtInstanceOperations = {};

			function dtInstanceOperationTypeCallback(dtInstance) {
				$scope.dtInstanceOperations = dtInstance;
			}

			$scope.dtOptionsOperations = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
				.withOption('paging', false);

			$scope.dtColumnsOperations = [
				DTColumnDefBuilder.newColumnDef(0).withClass('col-xs-1'),
				DTColumnDefBuilder.newColumnDef(1).withClass('col-xs-4'),
				DTColumnDefBuilder.newColumnDef(2).withClass('col-xs-2'),
				DTColumnDefBuilder.newColumnDef(3).withClass('col-xs-1').withTitle('Acciones').notSortable()
			];

			$scope.dtOptionsOperationsGrouped = DTOptionsBuilder.newOptions()
				.withOption('order', [[1, "asc"]])
				.withOption('stateSave', false)
				.withOption('stateDuration', false)
				.withOption('info', false)
				.withOption('paging', false)
				.withOption('searching', false);
			;
			$scope.dtColumnsOperationsGrouped = [
				DTColumnDefBuilder.newColumnDef(0).withClass('col-xs-4').notSortable(),
				DTColumnDefBuilder.newColumnDef(1).withClass('col-xs-1').notSortable(),
				DTColumnDefBuilder.newColumnDef(2).withClass('col-xs-4').notSortable(),
				DTColumnDefBuilder.newColumnDef(3).withClass('col-xs-2').notSortable(),
				DTColumnDefBuilder.newColumnDef(4).withClass('col-xs-1 center-text').notSortable()
			];


			$q.allSettled([operationTypeServiceCallerESign.getListOfOperationTypeByDomainID(tokenManager.getDomainId()), domainRESTServices.getDomainUsersByRoleAndSuper(tokenManager.getDomainId(), roleFirmante)]).then(function (responseArray) {
				var errorArray = [];
				angular.forEach(responseArray, function (response, index) {
					if (response.state !== 'fulfilled') {
						errorArray.push(response.reason);
					}
				});

				if (errorArray.length > 0) {
					var listError = ''
					angular.forEach(errorArray, function (error, index) {
						if (errorArray.length == 1)
							listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
						else if (errorArray.length - 1 === index)
							listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
						else
							listError = listError + error.data.failure + ' (desde: ' + error.from + ')  ---  ';
					})
					$rootScope.$broadcast('callError', listError);
				} else {

					$scope.operationTypeList = JSON.parse(responseArray[0].value.data.OperationTypeData);

					if (JSON.parse(responseArray[0].value.data.OperationGrouped)) {
						var newGrouped = JSON.parse(responseArray[0].value.data.OperationTypeDataGrouped);

						var listGroups = [];
						var cont = 0;
						var index = null;
						for (var groupName in newGrouped) {
							var objectToSave = {};
							if (groupName == "UNCATEGORIZED") {
								index = cont;
							}
							objectToSave.name = groupName;
							objectToSave.operation = newGrouped[groupName];

							listGroups.push(objectToSave);
							cont++;
						}

						if (index != null) {
							var uncategorized = listGroups[index];
							listGroups.splice(index, 1);

							listGroups.push(uncategorized);
						}

						$scope.operationTypeGrouped = listGroups;

						$scope.showOperationGrouped = true;
						$scope.showOperationList = false;
					} else {
						$scope.showOperationGrouped = false;
						$scope.showOperationList = true;
					}

					$scope.domainBeanAdvancedoptions = JSON.parse(responseArray[0].value.data.domainBeanAdvancedoptions);

					$rootScope.lstFirmantes = responseArray[1].value.data;

					$scope.isLoadedList = true;

					$rootScope.$broadcast('callSuccess', 'Operaci&oacute;n cargado carrectamente.')
				}
			});



		}

		$scope.multiple = false;

		/**
		 * It set the operationtype (EMAIL - WEB - SMS)
		 * @param {String} operationType - the operation type selected by the user.
		 */
		$scope.setOperationType = function (operationType) {
			$scope.operationTypeSelected = operationType;
		}

		/**
		 * It modifies the doc's array everytime you check or uncheck a checkbox. If you check it, this function will erase the file
		 * inside the file's array.
		 * @param  {checkValue} the value of the checkbox. It can be true or false.
		 * @param  {index} the index of the checkbox in the array.
		 */
		$scope.modifyDocsArray = function (checkValue, index) {
			//If it is true then we have to delete the file from the files array.
			if (checkValue) {
				if (angular.isDefined(files[index])) {
					//Deleting file from the array.
					$("#preview" + index).empty();
					$scope.showPreviewDocument[index] = false;
					if (isExplorer) {
						files.splice(index, 1, new Blob([""]));
						angular.forEach(docNames, function (staticDoc, indexStatic) {
							if (staticDoc.position === index) {
								var objectToPush = {
									name: "empty",
									position: index
								};
								docNames.splice(indexStatic, 1, objectToPush);
								return;
							}
						});

						$('#nameDoc' + index).html("DocumentName");
						$('#nameDoc' + index).addClass("notVisible");
					} else
						files.splice(index, 1, new File([""], "empty"));

				} else {
					if (isExplorer) {
						var newBlob = new Blob([""], {
							type: "application/pdf"
						});
						newBlob.name = "" + $scope.documents[index].code;
						newBlob.lastModifiedDate = new Date();
						files[index] = newBlob;
						docNames.push({
							name: "empty",
							position: index
						});
					} else {
						files[index] = new File([""], "empty");
					}
				}
			} else {
				delete files[index];
			}
		}

		/**
		 * It modifies the doc's array everytime you check or uncheck a checkbox. If you check it, this function will erase the file (only satatic documents)
		 * inside the file's array.
		 * @param  {checkValue} the value of the checkbox. It can be true or false.
		 * @param  {index} the index of the checkbox in the array.
		 */
		$scope.modifyStaticsDocsArray = function (checkValue, index) {
			//If it is true then we have to delete the file from the files array.
			if (checkValue) {

				var objectToPush = {
					name: "empty",
					position: index
				};

				if (angular.isDefined(filesStatic[index])) {
					//Deleting file from the array.
					if (isExplorer) {
						filesStatic.splice(index, 1, new Blob([""]));
						staticDocNames.splice(index, 1, objectToPush);
					} else
						filesStatic.splice(index, 1, new File([""], "empty"));

				} else {
					if (isExplorer) {
						var newBlob = new Blob([""], {
							type: "application/pdf"
						});
						newBlob.name = "" + $scope.documentsStatic[index].code;
						newBlob.lastModifiedDate = new Date();
						filesStatic[index] = newBlob;
						staticDocNames.push(objectToPush);
					} else {
						filesStatic[index] = new File([""], "empty");
					}
				}
			} else {
				var newBlob = new Blob([""], {
					type: "application/pdf"
				});
				newBlob.name = "" + $scope.documentsStatic[index].code;
				var objectToPush = {
					name: "" + $scope.documentsStatic[index].code,
					position: index
				};

				if (angular.isDefined(filesStatic[index])) {
					if (isExplorer) {
						filesStatic.splice(index, 1, newBlob);

						staticDocNames.splice(index, 1, objectToPush);
					} else
						filesStatic.splice(index, 1, new File([""], $scope.documentsStatic[index].code));
				} else {
					if (isExplorer) {
						newBlob.lastModifiedDate = new Date();
						filesStatic[index] = newBlob;
						staticDocNames.push(objectToPush);
					} else {
						filesStatic[index] = new File([""], $scope.documentsStatic[index].code);
					}
				}
			}
		}

		/**
		 * Function that collect all the data and call the service in order to (effectively)
		 * create a multilevel operation.
		 * @param  {Object} operationData - the operationData object, it contains all the input
		 * values inserted by the user
		 * @return {void}                 - it open a sweet modal that inform the user if the
		 * whether the operation has been created successfully or not.
		 */
		$scope.createMultilevelOperation = function (operationData) {
			var objectToSend = new FormData();

			// Documents operation 
			angular.forEach(files, function (file, index) {
				objectToSend.append($scope.documents[index].code, file);
			});

			angular.forEach(filesStatic, function (file, index) {
				objectToSend.append($scope.documentsStatic[index].code, file);
			});

			// Operation Documents
			objectToSend.append('docNames', JSON.stringify(docNames));
			objectToSend.append('staticDocNames', JSON.stringify(staticDocNames));

			// Signer Document
			objectToSend.append('docSignerNames', JSON.stringify(docSignerNames));
			objectToSend.append('staticDocSignerNames', JSON.stringify(staticDocSignerNames));

			var operationDataToSend = angular.copy(operationData);
			// sustituimos cualquier null o undefined por ""
			angular.forEach(operationDataToSend, function (valueTag, indexTag) {
				if (valueTag == undefined || valueTag == null) {
					operationDataToSend[indexTag] = "";
				}
			})
			objectToSend.append('operationdata', JSON.stringify(operationDataToSend));

			// Documents operation
			var docsDataToSend = angular.copy($scope.documents);
			objectToSend.append('documentsdata', JSON.stringify(docsDataToSend));
			var docsStaticDataToSend = angular.copy($scope.documentsStatic);
			objectToSend.append('documentsStaticdata', JSON.stringify(docsStaticDataToSend));

			// Documents signer
			var docsSignerToSend = angular.copy($scope.docSigner);
			objectToSend.append('documentssigner', JSON.stringify(docsSignerToSend));
			var docsStaticsSignerToSend = angular.copy($scope.docStaticsSigner);
			objectToSend.append('documentsStaticSigner', JSON.stringify(docsStaticsSignerToSend));


			var levelArray = [];
			angular.forEach($scope.level, function (levelObject, index) {
				var newLevelObject = {};
				newLevelObject.order = parseInt(index) + 1;
				newLevelObject.signers = angular.copy(levelObject);
				levelArray.push(newLevelObject);

				// document signer
				angular.forEach(levelObject, function (signer, index) {
					angular.forEach(signer.filesSigner, function (file, indexFile) {
						if ($scope.docSigner[indexFile] != null && $scope.docSigner[indexFile] != undefined)
							objectToSend.append($scope.docSigner[indexFile].code + " - " + signer.data.cellphone + " - " + signer.data.nif.toUpperCase(), file);
					});

					angular.forEach(signer.filesStaticsSigner, function (file, indexFile) {
						if ($scope.docStaticsSigner[indexFile] != null && $scope.docStaticsSigner[indexFile] != undefined)
							objectToSend.append($scope.docStaticsSigner[indexFile].code + " - " + signer.data.cellphone + " - " + signer.data.nif.toUpperCase(), file);
					});
				});
			});

			objectToSend.append('signersdata', JSON.stringify(levelArray));


			operationTypeServiceCallerESign.createMultilevelOperation(objectToSend).then(function (responseSuccess) {
				log.log('result : ', responseSuccess);
				sweet.show({
					title: '',
					text: 'La operación se ha creado con éxito.',
					confirmButtonText: 'Listado operaciones',
					cancelButtonText: 'Cerrar',
					animation: 'slide-from-top',
					confirmButtonColor: '#a5dc86',
					type: 'success',
					showCancelButton: true,
					closeOnConfirm: true,
				}, function (isConfirm) {
					if (isConfirm) {
						$scope.$apply(function () {
							$scope.closeOperationDetailsMultiLevel();
						});
					} else {
						$scope.$apply(function () {
							if ($scope.domainBeanAdvancedoptions.autogenerateIdOperation) {
								$scope.operationData.operationid = createOpCode();
							}
						});
					}
				});
			}).catch(function (responseError) {
				log.log('result error: ', responseError);
				sweet.show({
					title: '',
					text: '' + responseError.data.failure,
					confirmButtonText: 'Cerrar',
					confirmButtonColor: '#f27474',
					animation: 'slide-from-bottom',
					type: 'error',
				});
			})

		}

		/**
		 * Function used to set all the things in order to create a new multilevel operation.
		 * @param  {Object} operationTypeObject - is the object that contains all the 
		 * fields of the operation.
		 * @return {void} - it just set some mandatory values.
		 */
		$scope.newOperationMultilevel = function (operationTypeObject) {
			operationTypeServiceCallerESign.getOperationTypeByID(operationTypeObject.id).then(function (responseSuccess) {
				var consistencyOperation = checkMultiOperationConsistencyOnCreating(JSON.parse(responseSuccess.data.multiplesigndata))

				if (!consistencyOperation.isBiometricWithDocs && consistencyOperation.isBiometricLevel) {
					//If the level is biometric AND it does not have any biometric doc associated, showing the error popup.
					sweet.show({
						title: '',
						confirmButtonColor: '#F27474',
						text: 'No existen documentos biométricos asociados en alguno de los niveles de firma biométrica.',
						confirmButtonText: 'Cerrar',
						type: 'error'
					});
				} else if (!consistencyOperation.isSignWithDocs && !consistencyOperation.isBiometricLevel) {
					//If the level is NOT biometric AND it does not have any doc associated, showing the warning popup.
					sweet.show({
						title: '',
						showCancelButton: true,
						confirmButtonColor: '#F8BD86',
						text: 'Hay niveles sin documentos asociados.',
						confirmButtonText: 'Continuar',
						cancelButtonText: 'Cancelar',
						type: 'warning',
						closeOnConfirm: true,
						closeOnCancel: true
					}, function (isConfirm) {
						if (isConfirm) {
							//saving the configuration.
							setOperationData(responseSuccess, operationTypeObject, true);
						}
					});
				} else {
					//The level has at least one doc associated, we will save.
					setOperationData(responseSuccess, operationTypeObject, false);

				}

			}).catch(function (responseError) {
				$rootScope.$broadcast('callError', responseError.data.failure);
			})
		}

		function setOperationData(responseSuccess, operationTypeObject, applyToScope) {

			if (applyToScope) {
				$scope.$apply(function () {
					configTable();
				});

			} else {
				configTable();
			}

			function configTable() {
				$scope.userFields = [];
				$scope.operationFields = [];
				createFieldsArray(JSON.parse(responseSuccess.data.authmetadata));
				$scope.signatureBoxLabels = responseSuccess.data.signatureBoxLabelsForLevels;
				$scope.operationData.opClass = responseSuccess.data.id;
				$scope.operationData.domainid = responseSuccess.data.domainid;
				// if domain has checked autogenerateid, set it to value generation

				if ($scope.domainBeanAdvancedoptions.autogenerateIdOperation) {
					$scope.operationData.operationid = createOpCode();
				}

			}

			$scope.operation.operationType = 'EMAIL';
			$scope.setOperationType($scope.operation.operationType);

			$scope.multiplesigndata = JSON.parse(responseSuccess.data.multiplesigndata);
			$scope.allDocuments = JSON.parse(responseSuccess.data.documents);

			$scope.documents = filterOnlySignDocsOperation($scope.allDocuments);
			$scope.documents.sort(sortByBlock);
			$scope.documents.sort(sortByOrder);
			angular.forEach($scope.documents, function (document, index) {
				$scope.showPreviewDocument[index] = false;
			});

			$scope.documentsStatic = filterOnlySignStaticsDocsOperation($scope.allDocuments);
			$scope.documentsStatic.sort(sortByBlock);
			$scope.documentsStatic.sort(sortByOrder);

			setStaticDocs($scope.documentsStatic);

			$scope.dtOptionsUsers = DTOptionsBuilder
				.newOptions()
				.withOption('paging', false)
				.withOption('searching', false);

			$scope.dtColumnDefsUsers = [];
			$scope.optionsConfig = [];

			for (var i = 0; i < $scope.userFields.length; i++) {
				$scope.optionsConfig.push($scope.userFields[i].label);
				if ($scope.userFields[i].resumen == 'Y') {
					$scope.dtColumnDefsUsers.push(DTColumnDefBuilder.newColumnDef(i).withClass('center-text'));
				} else {
					$scope.dtColumnDefsUsers.push(DTColumnDefBuilder.newColumnDef(i).withClass('hidden'));
				}
			}
			$scope.optionsConfig.push("Tipología Firma");
			$scope.dtColumnDefsUsers.push(DTColumnDefBuilder.newColumnDef($scope.dtColumnDefsUsers.length).withClass('col-sm-2 center-text'));
			$scope.dtColumnDefsUsers.push(DTColumnDefBuilder.newColumnDef($scope.dtColumnDefsUsers.length).withClass('col-sm-1 center-text').withTitle('Acciones').notSortable());

			$scope.level = {};
			for (var i = 0; i < $scope.multiplesigndata.length; i++) {
				$scope.level[i] = [];
			}

			$scope.isLoadedList = false;
			$scope.isLoadedMultiLevel = true;

			$rootScope.$broadcast('rootChange', 'Solicitar Firma / Electrónica / ' + operationTypeObject.name)

		}

		function createOpCode() {
			//se cambia a este formato para obtener la fecha local(por si se usa de nuevo el botón de generar número de operación)
			return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace(/[^0-9]/g, "");
			//$scope.objetoForm.operationid = new Date().toISOString().substr(0, 19).replace('T', ' ').replace(/-/g , '').replace(/ /g , '').replace(/:/g , '');

		}

		function setStaticDocs(array) {
			angular.forEach(array, function (doc, index) {
				if (doc.code.indexOf('STATIC') == 0) {
					if (isExplorer) {
						var newBlob = new Blob([""], {
							type: "application/pdf"
						});
						newBlob.name = "" + doc.code;
						newBlob.lastModifiedDate = new Date();
						filesStatic[index] = newBlob;
						staticDocNames.push({
							name: "" + doc.code,
							position: index
						});
					} else {
						filesStatic[index] = new File([""], doc.code);
					}
				}
			});
		}

		/**
		 * Utility Function to filter only the sign operation documents
		 * @param  {Array of objects} arrayOfDocs - the array to filter.
		 * @return {Array of objects}
		 */
		function filterOnlySignDocsOperation(arrayOfDocs) {
			var arrayToReturn = [];
			angular.forEach(arrayOfDocs, function (doc, index) {
				if (doc.signorupload === 0 && (doc.operationorsigner == null || doc.operationorsigner == undefined || doc.operationorsigner === 0) && !doc.code.startsWith("STATIC"))
					arrayToReturn.push(angular.copy(doc));
			});
			return arrayToReturn;
		}

		/**
		 * Utility Function to filter only the sign statics documents operation 
		 * @param  {Array of objects} arrayOfDocs - the array to filter.
		 * @return {Array of objects}
		 */
		function filterOnlySignStaticsDocsOperation(arrayOfDocs) {

			var arrayToReturn = [];
			angular.forEach(arrayOfDocs, function (doc, index) {
				if (doc.signorupload === 0 && (doc.operationorsigner == null || doc.operationorsigner == undefined || doc.operationorsigner === 0) && doc.code.startsWith("STATIC"))
					arrayToReturn.push(angular.copy(doc));
			});
			return arrayToReturn;
		}

		/**
		 * Function to filter the sign and signer documents
		 * @param {Array of objects} arrayOfDocs - the array to filter.
		 * @return {Array of objects}
		 */
		function filterSignDocsSigner(docTypeList, arrayOfDocs) {
			var arrayToReturn = [];
			angular.forEach(docTypeList, function (docType, indexDocType) {
				angular.forEach(arrayOfDocs, function (doc, index) {
					if (doc.code == docType.code && doc.signorupload === 0 &&
						doc.operationorsigner === 1 && !doc.code.startsWith("STATIC"))
						arrayToReturn.push(angular.copy(doc));
				});
			});
			return arrayToReturn;
		}

		/**
		 * Function to filter the sign and signer static documents
		 * @param {Array of objects} arrayOfDocs - the array to filter.
		 * @return {Array of objects}
		 */
		function filterSignStaticsDocsSigner(docTypeList, arrayOfDocs) {
			var arrayToReturn = [];
			angular.forEach(docTypeList, function (docType, indexDocType) {
				angular.forEach(arrayOfDocs, function (doc, index) {
					if (doc.code == docType.code && doc.signorupload === 0 &&
						doc.operationorsigner === 1 && doc.code.startsWith("STATIC"))
						arrayToReturn.push(angular.copy(doc));
				});
			});
			return arrayToReturn;
		}

		/**
		 * Utility function to check if all the files have been setted or not.
		 * @return {boolean} - true if all the files are NOT setted, otherwise false.
		 */
		$scope.someFilesMissing = function () {
			var lengthFiles = 0;

			for (var i = files.length - 1; i >= 0; i--) {
				if (files[i] !== undefined)
					lengthFiles++;
			}

			for (var i = filesStatic.length - 1; i >= 0; i--) {
				if (filesStatic[i] !== undefined)
					lengthFiles++;
			}

			if (lengthFiles !== ($scope.documents.length + $scope.documentsStatic.length))
				return true;
			else
				return false;
		}

		/**
		 * Utility function to check if all the levels have at least one user.
		 * @return {boolean} - true if the level's user array is empty, otherwise false.
		 */
		$scope.someUserAdded = function () {
			var toReturn = false;

			for (var property in $scope.level) {
				if ($scope.level.hasOwnProperty(property) && $scope.level[property].length === 0) {
					toReturn = true;
					break;
				}
			}

			return toReturn;
		}

		/**
		 * Utility function that simply add a user in the right level.
		 * @param {Integer}              indexLevel  - the level where put the user.
		 * @param {Integer or Undefined} indexUser   - the index of the user to modify, undefined if the user is new.
		 * @param {Object}               user        - the user object, defined if the user want modify.
		 */
		$scope.addUserToLevel = function (indexLevel, indexUser, user) {
			log.log('index Level: ' + indexLevel);
			log.log('index User inside Level: ' + indexUser);
			log.log('user: ', user);
			var userCopy = undefined;
			if (angular.isDefined(user)) {
				userCopy = angular.copy(user);

				if (user.filesSigner != null && user.filesSigner != undefined) {
					for (var foo = 0; foo < user.filesSigner.length; foo++) {
						userCopy.filesSigner[foo] = user.filesSigner[foo];
					}
				}

				if (user.filesStaticsSigner != null && user.filesStaticsSigner != undefined) {
					for (var foo = 0; foo < user.filesStaticsSigner.length; foo++) {
						userCopy.filesStaticsSigner[foo] = user.filesStaticsSigner[foo];
					}
				}
			}

			$scope.docSigner = filterSignDocsSigner($scope.multiplesigndata[indexLevel].docsTypeList, $scope.allDocuments);
			$scope.docSigner.sort(sortByBlock);
			$scope.docSigner.sort(sortByOrder);

			$scope.docStaticsSigner = filterSignStaticsDocsSigner($scope.multiplesigndata[indexLevel].docsTypeList, $scope.allDocuments);
			$scope.docStaticsSigner.sort(sortByBlock);
			$scope.docStaticsSigner.sort(sortByOrder);

			var modalInstance = $uibModal.open({
				keyboard: false,
				backdrop: 'static',
				templateUrl: 'userDataModal.html',
				controller: 'UserDataModalController',
				size: 'lg',
				windowClass: 'dialogGeneral',
				resolve: {
					user: function () {
						return userCopy;
					},
					userFields: function () {
						return $scope.userFields;
					},
					signData: function () {
						return $scope.multiplesigndata[indexLevel].signatureTypes;
					},
					signatureBoxLabels: function () {
						return $scope.signatureBoxLabels[indexLevel];
					},
					operationTypeSelected: function () {
						return $scope.operationTypeSelected;
					},
					documentsSigner: function () {
						return $scope.docSigner;
					},
					documentsStaticSigner: function () {
						return $scope.docStaticsSigner;
					},
					isExplorer: function () {
						return isExplorer;
					},
					filesSigner: function () {
						if (userCopy != undefined)
							return userCopy.filesSigner;
						else
							return filesSigner;
					},
					filesStaticsSigner: function () {
						if (userCopy != undefined)
							return userCopy.filesStaticsSigner;
						else
							return filesStaticsSigner;
					},
					docSignerNames: function () {
						return docSignerNames;
					},
					staticDocSignerNames: function () {
						return staticDocSignerNames;
					}
				}
			});

			modalInstance.result.then(function (userToAdd) {

				if (angular.isUndefined(userCopy)) {
					$scope.level[indexLevel].push(userToAdd);
					$scope.docSignerNames = userToAdd.docSignerNames;
					$scope.staticDocSignerNames = userToAdd.staticDocSignerNames;
				} else
					$scope.level[indexLevel].splice(indexUser, 1, userToAdd);

				log.log($scope.level);
			}).catch(function () {
				log.debug('user dialog dismissed');
			});

			modalInstance.rendered.then(function () {
				if (userCopy != undefined && isExplorer) {
					if ($scope.toUploadSigner == null || $scope.toUploadSigner == undefined)
						$scope.toUploadSigner = {};

					angular.forEach(userCopy.filesSigner, function (file, index) {
						if (file.name != "empty" && file.name != "undefined") {

							$scope.toUploadSigner[index] = false;

							$('#nameDocSigner' + index).html(file.name);
							$('#nameDocSigner' + index).attr("title", file.name);
							$('#nameDocSigner' + index).removeClass("notVisible");
						} else
							$scope.toUploadSigner[index] = true;
					});
				}
			})
		}

		/**
		 * Remove a user from a level
		 * @param  {Integer}       indexLevel - is the level's index.
		 * @param  {Integer}       indexUser  - is the user's index.
		 * @param  {User Object}   user       - is the user Object to delete.
		 * @return {void} it simply delete the user in position indexUser of the array in $scope.level[indexLevel]
		 */
		$scope.removeUserFromLevel = function (indexLevel, indexUser, user) {
			$scope.level[indexLevel].splice(indexUser, 1);
		}

		/**
		 * Utility function that divide the fields between the operation's fields and the signer's fields.
		 * @param  {Array} authmetadata - the array to split
		 * @return {void}
		 */
		function createFieldsArray(authmetadata) {
			$scope.operationData = {};

			$scope.user = {};
			$scope.user.data = {};

			angular.forEach(authmetadata[0].fields, function (objectAuthField, index) {
				if (objectAuthField.type === 'SIGNER') {
					var signerCopy = angular.copy(objectAuthField);

					// si default value contiene | se separa la lista
					// si default value contiene ## se sustituye por el string correspondiente
					// en caso contrario se muestra el valor literal
					if (signerCopy.defaultValue != null) {

						if (signerCopy.defaultValue.indexOf('|') != -1) {
							signerCopy.defaultValue = signerCopy.defaultValue.split("|");
							signerCopy.isArray = true;

							for (var foo = 0; foo < signerCopy.defaultValue.length; foo++) {
								if (signerCopy.defaultValue[foo].indexOf('##') != -1) {
									signerCopy.defaultValue[foo] = getDefaultValue(signerCopy.defaultValue[foo]);
								}
							}
						} else if (signerCopy.defaultValue.indexOf('##') != -1) {
							signerCopy.defaultValue = getDefaultValue(signerCopy.defaultValue);
							signerCopy.isArray = false;
						}

						if (!signerCopy.isArray)
							$scope.operationData[signerCopy.identifier] = signerCopy.defaultValue;
						else
							$scope.operationData[signerCopy.identifier] = "";
					}
					$scope.userFields.push(signerCopy);
				} else if (objectAuthField.type === 'OPERATION') {
					var operationCopy = angular.copy(objectAuthField);

					if (operationCopy.defaultValue != null) {

						if (operationCopy.defaultValue.indexOf('|') != -1) {
							operationCopy.defaultValue = operationCopy.defaultValue.split("|");
							operationCopy.isArray = true;

							for (var foo = 0; foo < operationCopy.defaultValue.length; foo++) {
								if (operationCopy.defaultValue[foo].indexOf('##') != -1) {
									operationCopy.defaultValue[foo] = getDefaultValue(operationCopy.defaultValue[foo]);
								}
							}
						} else if (operationCopy.defaultValue.indexOf('##') != -1) {
							operationCopy.defaultValue = getDefaultValue(operationCopy.defaultValue);
							operationCopy.isArray = false;
						}

						$scope.user.data[operationCopy.identifier] = operationCopy.defaultValue;

						if (!operationCopy.isArray)
							$scope.operationData[operationCopy.identifier] = operationCopy.defaultValue;
						else
							$scope.operationData[operationCopy.identifier] = "";
					}
					$scope.operationFields.push(operationCopy);
				}
			});

			$scope.userFields.sort(orderByOrder);
			$scope.operationFields.sort(orderByOrder);
		}

		// replace the default value ##field## to string 
		function getDefaultValue(field) {
			switch (field.trim()) {
				case '##username##':
					field = $scope.loggedUser.username;
					break;
				case '##useremail##':
					field = $scope.loggedUser.useremail;
					break;
				case '##firstName##':
					if ($scope.loggedUser.extradata != null && $scope.loggedUser.extradata.firstName != null)
						field = $scope.loggedUser.extradata.firstName;
					else
						field = "";
					break;
				case '##lastName1##':
					if ($scope.loggedUser.extradata != null && $scope.loggedUser.extradata.lastName1 != null)
						field = $scope.loggedUser.extradata.lastName1;
					else
						field = "";
					break;
				case '##nif##':
					if ($scope.loggedUser.extradata != null && $scope.loggedUser.extradata.nif != null)
						field = $scope.loggedUser.extradata.nif;
					else
						field = "";
					break;
				case '##phone##':
					if ($scope.loggedUser.extradata != null && $scope.loggedUser.extradata.phone != null)
						field = $scope.loggedUser.extradata.phone;
					else
						field = "";
					break;
			}

			return field;
		}

		/**
		 * Utility function that order an array following the order property of the objects.
		 * @param  {Object} objA - the object 'a'.
		 * @param  {Object} objB - the object 'b'.
		 * @return {Integer} - it return -1 if the objA's order is lower than objB's order, it
		 * return 1 if the objA's order is greater than objB's order otherwise it return 0.
		 */
		function orderByOrder(objA, objB) {
			if (objA.order < objB.order)
				return -1;
			if (objA.order > objB.order)
				return 1;
			return 0;
		}

		/**
		 * Function utility to sort docs by Block.
		 * @param  {Object} docA - document object A
		 * @param  {Object} docB - document object B
		 * @return {Integer}     - it return -1 if the docA's block is lower than docB's block, it
		 * return 1 if the docA's block is greater than docB's block otherwise it return 0.
		 */
		function sortByBlock(docA, docB) {
			if (docA.block < docB.block)
				return -1;
			if (docA.block > docB.block)
				return 1;
			return 0;
		}

		/**
		 * Function utility to sort docs by order.
		 * @param  {Object} docA - document object A
		 * @param  {Object} docB - document object B
		 * @return {Integer}     - it return -1 if the docA's order is lower than docB's order, it
		 * return 1 if the docA's order is greater than docB's order otherwise it return 0.
		 */
		function sortByOrder(docA, docB) {
			if (docA.block === docB.block && docA.order < docB.order)
				return -1;
			if (docA.block === docB.block && docA.order > docB.order)
				return 1;
		}

		/**
		 * Function used to create a new operation that is NOT a multilevel.
		 * @param  {[type]} operationTypeObject [description]
		 * @return {[type]}                     [description]
		 */
		$scope.newOp = function (operationTypeObject) {

			$scope.multiple = false;

			//loading all the datas simultaneously.
			$q.allSettled([
				operationTypeServiceCallerESign.getOperationTypeByID(operationTypeObject.id),
				operationTypeServiceCallerESign.getFieldsByOperationType(operationTypeObject.id),
				operationTypeServiceCallerESign.getLanguages(operationTypeObject.id)
			]).then(function (responseArray) {

				var errorArray = [];

				angular.forEach(responseArray, function (response, index) {
					if (response.state === 'fulfilled') {
						if (index === 0) {
							//setting $scope object for user, operation and documents:
							setOperationDataScope(response.value.data);
							setDocumentsDataScope($scope.user.docsProperties);
						} else if (index === 1) {
							//setting $scope object for fields:
							setFieldsDataScope(response.value.data);
						} else if (index === 2) {
							//setting $scope object for languages:
							setLanguagesDataScope(response.value.data);
						}
					} else
						errorArray.push(response.reason);
				})

				if (errorArray.length > 0) {
					var listError = ''
					angular.forEach(errorArray, function (error, index) {
						if (errorArray.length == 1)
							listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
						else if (errorArray.length - 1 === index)
							listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
						else
							listError = listError + error.data.failure + ' (desde: ' + error.from + ')  ---  ';
					})
					$rootScope.$broadcast('callError', listError);
				} else {
					$scope.isLoadedList = false;
					$scope.isLoaded = true;
					$rootScope.$broadcast('rootChange', 'Solicitar Firma / Electrónica / ' + operationTypeObject.name)
				}

			});
		}

		/**
		 * Utility function used to set the $rootScope languages prop.
		 * @param {Object} languagesData - the languages object.
		 */
		function setLanguagesDataScope(languagesData) {
			$rootScope.languages = languagesData;
		}

		/**
		 * Utility function used to set the documentsData in the $scope.
		 * @param {Object} documentsData - the object to set in the $scope.
		 */
		function setDocumentsDataScope(documentsData) {
			documentsData.sort(sortByBlock);
			documentsData.sort(sortByOrder);

			angular.forEach(documentsData, function (document, index) {
				document.documentUrl = "webapp/web/viewer.html?file=" + $rootScope.url + "services/repository/getdocumentbyuuid/" + document.documentUuid;
				$scope.user.mandatories.push(document.mandatory);

				if (document.uploadMandatory === 1) {
					var objectIndex = {
						position: index
					}
					positionOfMandatoryFile.push(objectIndex);
				}

				if (document.code.indexOf('STATIC') == 0) {
					if (isExplorer) {
						var newBlob = new Blob([""], {
							type: "application/pdf"
						});
						newBlob.name = "" + document.code;
						newBlob.lastModifiedDate = new Date();
						filesStatic[index] = newBlob;
						staticDocNames.push({
							name: "" + document.code,
							position: index
						});
					} else {
						files[index] = new File([""], document.code);
					}
				}
			});

			$rootScope.documents = documentsData;
		}

		/**
		 * Utility function used to set the fieldsData in the $scope.
		 * @param {Object} fieldsData - the object to set in the $scope.
		 */
		function setFieldsDataScope() {
			angular.forEach($scope.userFields, function (field) {
				switch (field.identifier) {
					case 'nif':
						if (field.isMandatory === 'Y') {
							field.inputType = 'text';
							field.directive = 'validate-nif';
						}

						break;
					case 'cellphone':
						if (field.isMandatory === 'Y') {
							field.inputType = 'text';
							field.directive = 'validate-phone';
						}
						break;
					case 'email':
						if (field.isMandatory === 'Y') {
							field.inputType = 'text';
							field.directive = 'validate-email';
						}
						break;
					default:
						field.inputType = 'text';
						field.directive = 'a';
						break;
				}
			});

			var arrayFieldsUser = angular.copy($scope.userFields);
			var arrayFieldsOperations = angular.copy($scope.operationFields);
			var arrayFields = arrayFieldsOperations.concat(arrayFieldsUser);
			$rootScope.listfields = arrayFields;
		}

		/**
		 * Utility function used to set the operationData in the $scope.
		 * @param {Object} operationData - the object to set in the $scope.
		 */
		function setOperationDataScope(operationData) {
			$scope.operationtypeid = operationData.id;
			$scope.domainid = operationData.domainid;

			$scope.user = {};
			$scope.user.operationType = 'EMAIL';
			$scope.user.opClass = operationData.id;
			$scope.user.domainId = operationData.domainid;
			$scope.user.mandatories = [];
			$scope.user.docsProperties = fillDocumentProperty(JSON.parse(operationData.documents));

			$scope.user.docsProperties.sort(sortByBlock);
			$scope.user.docsProperties.sort(sortByOrder);

			createFieldsArray(JSON.parse(operationData.authmetadata));
		}

		$scope.checkDocMandatory = function () {
			var toReturn = false;
			for (var i = 0; i < positionOfMandatoryFile.length; i++) {
				if (angular.isUndefined(files[positionOfMandatoryFile[i].position])) {
					toReturn = true;
					break;
				}
			}
			return toReturn;
		}

		$scope.openPdf = function (doc) {
			var docModal = angular.copy(doc);

			var modalInstance = $uibModal.open({
				animation: true,
				size: 'lg',
				templateUrl: 'modalStaticDocument.html',
				controller: 'staticDocumentController',
				windowClass: 'dialogGeneral',
				resolve: {
					docToUpload: function () {
						return docModal;
					}
				}
			});

			modalInstance.rendered.then(function () {
				var bodyHeight = $("#body").height();
				$timeout(function () {
					$("#fileViewer").height(bodyHeight - 220);
				}, 100)
			});
		}

		/**
		 * This function will return an array of document's properties. To be more clear it will return an array 
		 * containing only the block, order and name properties.
		 * @param  {array} documentArray - the document's array to (partially) copy.
		 * @return {array} arrayToReturn - the array containing the blocks and the order for the documents.
		 */
		function fillDocumentProperty(documentArray) {
			var arrayToReturn = [];

			angular.forEach(documentArray, function (doc, index) {
				if (doc.signorupload === 0) {
					var newDocProperties = {};
					newDocProperties = angular.copy(doc);
					arrayToReturn.push(newDocProperties);
				}
			});
			arrayToReturn.sort(sortByBlock);
			arrayToReturn.sort(sortByOrder);
			return arrayToReturn;
		}



		$scope.newOpMultiple = function (operationTypeObject) {

			$scope.multiple = true;
			console.log(operationTypeObject);
			operationTypeServiceCallerESign.getOperationTypeByID(operationTypeObject.id).then(
				function (responseSuccess) {
					$scope.isLoadedList = false;
					console.log('SUCCESS', responseSuccess.data);
					$scope.operationtypeid = responseSuccess.data.id;
					$scope.domainid = responseSuccess.data.domainId;
					$scope.isLoaded = true;
					$scope.users = {};
					$scope.user = {};
					$scope.user.operationType = 'EMAIL';
					$scope.user.opClass = responseSuccess.data.id;
					$scope.user.domainId = responseSuccess.data.domainid;
					$scope.user.mandatories = [];

					$http({
						method: 'GET',
						url: 'services/operations/getfieldsbyoptypemultiple/' + responseSuccess.data.id,
					}).success(function (data, status, headers, config) {
						angular.forEach(data, function (field) {

							//	alert(field.identifier);
							//  field.documentUrl = "/HAGCLI_VIDEOID/customer/web/viewer.html?file=/HAGCLI_VIDEOID/esignservices/esign/getdocumentbyuuid/" + document.documentUuid;
						});
						//alert(data);
						//$rootScope.listfields = data;
						$scope.signersm = data.signersData;
					});

					$http({
						method: 'GET',
						url: 'services/operations/getdocumentsbyoptype/' + responseSuccess.data.id,
					}).success(function (data, status, headers, config) {
						angular.forEach(data, function (document) {
							document.documentUrl = "webapp/web/viewer.html?file=" + $rootScope.url + "services/repository/getdocumentbyuuid/" + document.documentUuid;
							$scope.user.mandatories.push(document.mandatory);
						});
						//alert(data);
						$scope.allDocuments = data;

						$scope.documents = filterOnlySignDocsOperation($scope.allDocuments);
						$scope.documents.sort(sortByBlock);
						$scope.documents.sort(sortByOrder);
						angular.forEach($scope.documents, function (document, index) {
							$scope.showPreviewDocument[index] = false;
						});

						$scope.documentsStatic = filterOnlySignStaticsDocsOperation($scope.allDocuments);
						$scope.documentsStatic.sort(sortByBlock);
						$scope.documentsStatic.sort(sortByOrder);
					});

				},
				function (responseError) {
					console.log('ERROR: ', responseError.data);
				}
			);
		}


		$scope.uploadedFile = function (element) {
			$scope.$apply(function ($scope) {
				var index = element.name.charAt(element.name.length - 1);
				//The file has been cancelled
				if (element.files.length === 0) {
					files.splice(parseInt(index), 1, undefined);
					deleteInfoDocument(index);
					return;
				}
				//VALIDATE MIMETYPE
				console.log(element.files[0].name + ' -- ' + element.files[0].type);
				if (element.files[0].type !== 'application/pdf') {

					sweet.show({
						title: '',
						confirmButtonColor: '#F27474',
						text: 'El archivo debe ser un pdf válido.',
						confirmButtonText: 'Cerrar',
						type: 'warning'
					});
					deleteInfoDocument(index);
					return;
				} else if (!isExplorer) {
					$scope.showPreviewDocument[index] = true;
				}


				files[parseInt(index)] = element.files[0];

				if (!isExplorer) {
					var reader = new FileReader();

					reader.onload = function (event) {
						$scope.imageSrc = event.target.result;
						var extension = element.files[0].name.split('.').pop().toLowerCase();
						var tif = false;
						var pdf = false;
						if (extension == "tiff" || extension == "tif")
							tif = true;
						else if (extension == "pdf")
							pdf = true;

						if (pdf == false) {
							$('#preview' + index).html("<img width='90px' src='" + event.target.result + "' />");
							$('#name' + index).html(element.files[0].name);
							//					$('#size').html(humanFileSize(file.size, "MB"))
							//					$('#type').html(file.type)
						} else {
							$("#name" + index).empty();
							$('#name' + index).html(element.files[0].name);
							$('#name' + index).attr("title", element.files[0].name);
							if (!isExplorer) {
								PDFJS.getDocument(event.target.result).then(function getPdf(pdf) {
									//
									// Fetch the first page
									//
									pdf.getPage(1).then(function getPage(page) {
										console.debug("getting page");
										var scale = 0.2;
										var viewport = page.getViewport(scale);

										//
										// Prepare canvas using PDF page dimensions
										//
										$("#preview" + index).empty();
										$("#preview" + index).append('<canvas id="pdf-image" class="preview"/>');
										var canvas = $("#preview" + index).find("canvas.preview").get(0);
										var context = canvas.getContext('2d');
										canvas.height = viewport.height;
										canvas.width = viewport.width;

										//
										// Render PDF page into canvas context
										//
										var renderContext = {
											canvasContext: context,
											viewport: viewport
										};
										page.render(renderContext);
									});
								}, function errorCallback(error) {

									sweet.show({
										title: '',
										confirmButtonColor: '#F27474',
										text: 'El archivo debe ser un pdf válido.',
										confirmButtonText: 'Cerrar',
										type: 'error'
									});

									deleteInfoDocument(index);
								});
							}

						}
					}
					reader.readAsDataURL(element.files[0]);
				} else {
					$('#nameDoc' + index).html(element.files[0].name);
					$('#nameDoc' + index).attr("title", element.files[0].name);
					$('#nameDoc' + index).removeClass("notVisible");
				}
			});
		}

		/**
		 * Function to delete the information of the document (name and preview) and don't show the preview document
		 * @param index -- index of the file
		 */
		function deleteInfoDocument(index) {
			$scope.showPreviewDocument[index] = false;

			$("#preview" + index).empty();
			$("#preview" + index).append('<canvas id="pdf-image" class="preview"/>');
			$("#name" + index).empty();

			return;
		}

		$scope.createOp = function () {

			if ((files.length + filesStatic.length) == $rootScope.documents.length) {
				$scope.uploadfile(files);
				$scope.uploadfile(filesStatic);
			} else {
				sweet.show({
					title: '',
					confirmButtonColor: '#F27474',
					text: 'Añada los archivos que faltan para crear la operación.',
					confirmButtonText: 'Cerrar',
					type: 'warning'
				});
			}
		}

		$scope.createOpMultiple = function () {
			if ((files.length + filesStatic.length) == $rootScope.documents.length) {
				$scope.uploadfileMultiple(files,
					function (msg) // success
					{
						console.log('uploaded multiple');
					},
					function (msg) // error
					{
						console.log('error');
					});

				$scope.uploadfileMultiple(filesStatic,
					function (msg) // success
					{
						console.log('uploaded multiple');
					},
					function (msg) // error
					{
						console.log('error');
					});
			} else {
				sweet.show({
					title: '',
					confirmButtonColor: '#F27474',
					text: 'Añada los archivos que faltan para crear la operación.',
					confirmButtonText: 'Cerrar',
					type: 'warning'
				});
			}
		}


		$scope.uploadfile = function (files) {

			var url = 'services/operations/newoperationwithfiles2';
			var fd = new FormData();

			angular.forEach(files, function (file) {
				fd.append('file', file);
			});

			fd.append("datos", JSON.stringify($scope.user));

			fd.append("staticDocNames", JSON.stringify(staticDocNames));

			$http.post(url, fd, {
				withCredentials: false,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			})
				.success(function (data) {
					sweet.show({
						title: '',
						text: 'La operación se ha creado con éxito.',
						confirmButtonText: 'Listado operaciones',
						cancelButtonText: 'Cerrar',
						animation: 'slide-from-top',
						confirmButtonColor: '#a5dc86',
						type: 'success',
						showCancelButton: true,
						closeOnConfirm: true,
					}, function (isConfirm) {
						if (isConfirm) {
							$scope.$apply(function () {
								$scope.closeOperationDetails();
							});

						}
					});

				})
				.error(function (data) {
					var message = 'Se ha producido un error.';
					if (data.failure && data.failure.length > 0) {
						message = data.failure
					}
					sweet.show({
						title: '',
						confirmButtonColor: '#F27474',
						text: message,
						confirmButtonText: 'Cerrar',
						type: 'error'
					});
				});
		}


		$scope.uploadfileMultiple = function (files, success, error) {

			var url = 'services/operations/newoperationwithfiles2multiple';
			var datos = [];
			var fd = new FormData();

			angular.forEach(files, function (file) {
				fd.append('file', file);
			});

			tam = Object.keys($scope.users).length;
			for (i = 0; i < tam; i++) {
				datos[i] = $scope.users[i];
				datos[i].opClass = $scope.user.opClass;
				datos[i].operationType = $scope.user.operationType;
				datos[i].domainId = $scope.user.domainId;
				datos[i].mandatories = $scope.user.mandatories;

			}
			fd.append("datos", JSON.stringify(datos));

			$http.post(url, fd, {
				withCredentials: false,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			})
				.success(function (data) {
					sweet.show({
						title: '',
						confirmButtonColor: '#A5DC86',
						text: 'La operación ha sido creada correctamente!',
						confirmButtonText: 'Cerrar',
						type: 'success'
					});

				})
				.error(function (data) {
					sweet.show({
						title: '',
						confirmButtonColor: '#F27474',
						text: 'Se ha producido un error',
						confirmButtonText: 'Cerrar',
						type: 'error'
					});
				});
		}

		$scope.closeOperationDetails = function () {
			$rootScope.$broadcast('rootChange', 'Solicitar Firma / Electrónica');
			files = [];
			positionOfMandatoryFile = [];
			docNames = [];
			staticDocNames = [];
			docSignerNames = [];
			staticDocSignerNames = [];
			$scope.fields = [];
			$scope.toUpload = {};
			$scope.toUploadStatic = {};
			$scope.toUploadSigner = {};
			$scope.toUploadSignerStatic = {};
			$scope.operationFields = [];
			$scope.userFields = [];
			$scope.level = {};
			$scope.multiplesigndata = {};
			$scope.signatureBoxLabels = {};
			$scope.operation = {};
			$scope.isLoaded = false;
			$scope.isLoadedList = true;
			$scope.operationTypeSelected = undefined;
		}

		$scope.closeOperationDetailsMultiLevel = function () {
			$rootScope.$broadcast('rootChange', 'Solicitar Firma / Electrónica');
			files = [];
			positionOfMandatoryFile = [];
			docNames = [];
			staticDocNames = [];
			docSignerNames = [];
			staticDocSignerNames = [];
			$scope.fields = [];
			$scope.toUpload = {};
			$scope.toUploadStatic = {};
			$scope.toUploadSigner = {};
			$scope.toUploadSignerStatic = {};
			$scope.operationFields = [];
			$scope.userFields = [];
			$scope.level = {};
			$scope.multiplesigndata = {};
			$scope.signatureBoxLabels = {};
			$scope.operation = {};
			$scope.isLoadedMultiLevel = false;
			$scope.isLoadedList = true;
			$scope.operationTypeSelected = undefined;
		}

		$scope.isRequired = function (operation) {

			if (operation.isMandatory === 'Y')
				return true;
			else
				return false;
		}
	}]);

angular
	.module('O2DigitalSite')
	.controller('UserDataModalController', function ($scope, $rootScope, $uibModal, $uibModalInstance, $log, $timeout, $http, sweet, user, userFields, signData, signatureBoxLabels, operationTypeSelected, documentsSigner, documentsStaticSigner, isExplorer, filesSigner, docSignerNames, staticDocSignerNames, tokenManager) {

		var log = $log;
		log.log('The user is: ' + user);
		log.log('The userFields are: ' + userFields);
		log.log('The signData is: ' + signData);
		log.log('The signatureBoxLabels for this level are: ', signatureBoxLabels)
		log.log('The signatureType selected by the user is: ', operationTypeSelected)



		$scope.disableField = false;

		$scope.documentsSigner = documentsSigner;
		$scope.documentsStaticSigner = documentsStaticSigner;

		var filesStaticsSigner;

		$scope.showPreviewDocument = [];
		angular.forEach($scope.documentsSigner, function (document, index) {
			$scope.showPreviewDocument[index] = false;
		});

		// load the document to the signer
		if (user != null && user != undefined && user.filesSigner != null && user.filesSigner != undefined) {

			angular.forEach(user.filesSigner, function (file, index) {

				if (!isExplorer && file.name != "empty") {

					var reader = new FileReader();
					reader.readAsDataURL(file);

					$scope.showPreviewDocument[index] = true;

					reader.onload = function (event) {
						$("#name" + index).empty();
						$('#name' + index).html(file.name);

						PDFJS.getDocument(event.target.result).then(function getPdf(pdf) {
							//
							// Fetch the first page
							//
							pdf.getPage(1).then(function getPage(page) {
								console.debug("getting page");
								var scale = 0.2;
								var viewport = page.getViewport(scale);

								//
								// Prepare canvas using PDF page dimensions
								//
								$("#preview" + index).empty();
								$("#preview" + index).append('<canvas id="pdf-image" class="preview"/>');
								var canvas = $("#preview" + index).find("canvas.preview").get(0);
								var context = canvas.getContext('2d');
								canvas.height = viewport.height;
								canvas.width = viewport.width;

								//
								// Render PDF page into canvas context
								//
								var renderContext = {
									canvasContext: context,
									viewport: viewport
								};
								page.render(renderContext);
							});
						}, function errorCallback(error) {

							sweet.show({
								title: '',
								confirmButtonColor: '#F27474',
								text: 'El archivo debe ser un pdf válido.',
								confirmButtonText: 'Cerrar',
								type: 'error'
							});

							deleteInfoDocument(index);
						});
					}
				} else if (!isExplorer) {
					if ($scope.toUploadSigner == null || $scope.toUploadSigner == undefined)
						$scope.toUploadSigner = {};

					$scope.toUploadSigner[index] = true;
				}
			});
		}

		// load the static document to the signer
		if (user != null && user != undefined && user.filesStaticsSigner != null && user.filesStaticsSigner != undefined) {

			filesStaticsSigner = user.filesStaticsSigner;
			angular.forEach(filesStaticsSigner, function (file, index) {
				if (isExplorer) {
					if (file.name == "undefined") {
						if ($scope.toUploadSignerStatic == null || $scope.toUploadSignerStatic == undefined)
							$scope.toUploadSignerStatic = {};

						$scope.toUploadSignerStatic[index] = true;
					}
				} else if (file.name == "empty") {

					if ($scope.toUploadSignerStatic == null || $scope.toUploadSignerStatic == undefined)
						$scope.toUploadSignerStatic = {};

					$scope.toUploadSignerStatic[index] = true;
				}
			});
		}

		// Show hide the tabs if exist document to the signer
		if (documentsSigner.length > 0 || documentsStaticSigner.length > 0)
			$scope.showTabs = true;
		else
			$scope.showTabs = false;

		$scope.setRightValueBoxlabel = function (stringToAdd, isChecked) {
			log.log('string: ' + stringToAdd);
			log.log('isChecked: ' + isChecked);
			var indexToDelete = undefined;

			if (angular.isDefined(isChecked) && !isChecked && $scope.signatureBoxLabels.length === 1) {
				$scope.checkedLabel[stringToAdd] = true;
				return;
			}

			if (angular.isDefined(isChecked) && isChecked) {
				$scope.user.boxLabels.push(stringToAdd);
			} else if (angular.isDefined(isChecked) && !isChecked) {
				for (var i = 0; i < $scope.user.boxLabels.length; i++) {
					if (stringToAdd === $scope.user.boxLabels[i]) {
						indexToDelete = i;
						break;
					}
				}

				if (angular.isDefined(indexToDelete))
					$scope.user.boxLabels.splice(indexToDelete, 1);
			}

		}

		// Elimina todos los datos almacenados del firmante
		$scope.removeSignerData = function () {
			angular.forEach($scope.userFields, function (valueField, index) {
				if (valueField.identifier == "email" ||
					valueField.identifier == "name" ||
					valueField.identifier == "lastname" ||
					valueField.identifier == "nif" ||
					valueField.identifier == "cellphone") {
					$scope.user.data[valueField.identifier] = "";
				}

			});

			$scope.noneSigner = true;
			$scope.user.signer = "";
		}

		// establece los datos almacenados para el firmante
		// Si tiene integración con LDAP pero no búsqueda, se busca el usuario en el LDAP
		// en caso de existir se actualiza la BBDD con el LDAP y muestra el usuario
		// en caso de no existir el usuario en el LDAP se avisa de que el usuario está inactivo y se actualiza la BBDD a inactivo
		$scope.changeSignerData = function (idSigner) {

			if (idSigner === "") {
				$scope.removeSignerData();
			} else {

				$scope.noneSigner = false;

				var found = false;
				var cont = 0;
				while (!found && cont < $scope.lstFirmantes.length) {
					if ($scope.lstFirmantes[cont].id == idSigner) {
						// identificadores comunes: email, name, nif y cellphone
						angular.forEach($scope.userFields, function (valueField, index) {

							switch (valueField.identifier) {
								case "email":
									$scope.user.data[valueField.identifier] = $scope.lstFirmantes[cont].useremail;
									break;
								case "name":
									$scope.user.data[valueField.identifier] = (($scope.lstFirmantes[cont].userfirstname != null && $scope.lstFirmantes[cont].userfirstname != null) ? $scope.lstFirmantes[cont].userfirstname : "");
									break;
								case "lastname":
									$scope.user.data[valueField.identifier] = (($scope.lstFirmantes[cont].userlastname1 != null && $scope.lstFirmantes[cont].userlastname1 != null) ? $scope.lstFirmantes[cont].userlastname1 : "");
									break;
								case "nif":
									$scope.user.data[valueField.identifier] = (($scope.lstFirmantes[cont].userdocument != null && $scope.lstFirmantes[cont].userdocument != null) ? $scope.lstFirmantes[cont].userdocument : "");
									break;
								case "cellphone":
									$scope.user.data[valueField.identifier] = (($scope.lstFirmantes[cont].cellphone != null && $scope.lstFirmantes[cont].cellphone != null) ? $scope.lstFirmantes[cont].cellphone : "");
									break;
								default:
									break;
							}
						});
						found = true;
					}
					cont++;
				}
				//				}
			}
		}

		function getIndexSignerList(idSigner) {

			var found = false;
			var cont = 0;
			var idFirmanteList = 0;
			while (!found && cont < $scope.lstFirmantes.length) {
				if ($scope.lstFirmantes[cont].id == idSigner) {
					found = true;
					idFirmanteList = cont;
				}
				cont++;
			}

			return idFirmanteList;
		}

		$scope.isSignEmpty = function () {
			var toCheck = false;

			angular.forEach($scope.user.signaturetypes, function (signType, index) {
				if (signType === 'BIOMETRICA' && $scope.user.boxLabels.length === 0)
					toCheck = true;
			});

			if ($scope.user.signaturetypes.length === 0 || toCheck)
				return true;
			else
				return false;
		}

		$scope.setRightValue = function (stringToAdd, isChecked) {
			log.log('string: ' + stringToAdd);
			log.log('isChecked: ' + isChecked);
			var indexToDelete = undefined;

			if (angular.isDefined(isChecked) && !isChecked && $scope.signTypesForLevel.length === 1) {
				$scope.checkedSign[stringToAdd] = true;
				return;
			}

			if (angular.isDefined(isChecked) && isChecked) {
				$scope.user.signaturetypes.push(stringToAdd);
			} else if (angular.isDefined(isChecked) && !isChecked) {
				for (var i = 0; i < $scope.user.signaturetypes.length; i++) {
					if (stringToAdd === $scope.user.signaturetypes[i]) {
						indexToDelete = i;
						break;
					}
				}

				if (angular.isDefined(indexToDelete))
					$scope.user.signaturetypes.splice(indexToDelete, 1);
			}

		}

		$scope.operationTypeSelectedForUser = operationTypeSelected === 'EMAIL' ? true : false;

		$scope.isRequired = function (field) {

			if (field.identifier === 'email') {
				if ($scope.operationTypeSelectedForUser)
					return true;
				else if (field.isMandatory === 'Y')
					return true;
				else
					return false;

			} else if (field.isMandatory === 'Y') {
				return true;
			} else {
				return false;
			}
		}

		$scope.setOperationType = function (operationType) {
			if (operationType === 'EMAIL') {
				$scope.operationTypeSelectedForUser = true;
			} else {
				$scope.operationTypeSelectedForUser = false;
			}
		}

		$scope.isOnlyWeb = function () {
			if (operationTypeSelected === 'WEB')
				return true
			return false;
		}

		angular.forEach(userFields, function (field, index) {
			switch (field.identifier) {
				case 'nif':
					if (field.isMandatory === 'Y') {
						field.inputType = 'text';
						field.directive = 'validate-nif';
					} else {
						field.inputType = 'text';
						field.directive = 'validate-null-nif';
					}
					break;
				case 'cellphone':
					if (field.isMandatory === 'Y') {
						field.inputType = 'text';
						field.directive = 'validate-phone';
					}
					break;
				case 'email':
					if (field.isMandatory === 'Y') {
						field.inputType = 'text';
						field.directive = 'validate-email';
					} else {
						field.inputType = 'text';
						field.directive = 'validate-null-email';
					}
					break;
				default:
					field.inputType = 'text';
					field.directive = 'a';
					break;
			}
		});

		$scope.userFields = userFields;
		$scope.signTypesForLevel = signData;
		$scope.signatureBoxLabels = signatureBoxLabels;
		$scope.checkedLabel = [];
		$scope.isBiometric = false;
		$scope.operationTypeSelected = operationTypeSelected;

		if (user != null && user != undefined && user.filesSigner != null && user.filesSigner != undefined)
			filesSigner = user.filesSigner;
		else
			filesSigner = [];

		if (user != null && user != undefined && user.filesStaticsSigner != null && user.filesStaticsSigner != undefined)
			filesStaticsSigner = user.filesStaticsSigner;
		else {
			filesStaticsSigner = [];
			setStaticSignerDocs($scope.documentsStaticSigner, $rootScope, tokenManager);
		}

		/**
		 * Checking if the operation is Biometric.
		 * @param  {[type]} var i             [description]
		 * @return {[type]}     [description]
		 */
		for (var i = $scope.signTypesForLevel.length - 1; i >= 0; i--) {
			if ($scope.signTypesForLevel[i].label.toLowerCase() === 'biometrica') {
				$scope.isBiometric = true;
				break;
			}

		}


		if (angular.isDefined(user)) {
			$scope.user = user;
			setCheckedSignTypes($scope.user.signaturetypes);
			setCheckedBoxLabels($scope.user.boxLabels);
		} else {
			$scope.user = {};
			$scope.user.data = {};
			$scope.user.data['operationType'] = operationTypeSelected;
			$scope.user.existingSigner = false;

			for (var foo = 0; foo < $scope.userFields.length; foo++) {
				if ($scope.userFields[foo].defaultValue != null && !$scope.userFields[foo].isArray) {
					$scope.user.data[$scope.userFields[foo].identifier] = $scope.userFields[foo].defaultValue;
				} else
					$scope.user.data[$scope.userFields[foo].identifier] = "";
			}

			if ($scope.signTypesForLevel != null && $scope.signTypesForLevel != undefined && $scope.signTypesForLevel.length === 1) {
				$scope.user.signaturetypes = [];
				$scope.setRightValue($scope.signTypesForLevel[0].label, true);
			} else {
				$scope.user.signaturetypes = [];
			}

			if ($scope.signatureBoxLabels != null && $scope.signatureBoxLabels != undefined && $scope.signatureBoxLabels.length === 1) {
				$scope.user.boxLabels = [];
				$scope.setRightValueBoxlabel($scope.signatureBoxLabels[0], true);
			} else {
				$scope.user.boxLabels = [];
			}

			setCheckedSignTypes($scope.user.signaturetypes);
			setCheckedBoxLabels($scope.user.boxLabels);
		}

		$scope.openPdf = function (doc) {
			var docModal = angular.copy(doc);

			var modalInstance = $uibModal.open({
				animation: true,
				size: 'lg',
				templateUrl: 'modalStaticDocument.html',
				controller: 'staticDocumentController',
				windowClass: 'dialogGeneral',
				resolve: {
					docToUpload: function () {
						return docModal;
					}
				}
			});

			modalInstance.rendered.then(function () {
				var bodyHeight = $("#body").height();
				$timeout(function () {
					$("#fileViewer").height(bodyHeight - 220);
					$('#fileViewer').parents('.modal-content').width($('form[name="dataUserForm"]').parent().width() + 10);
				}, 100)
			});
		}

		function setCheckedBoxLabels(boxLabels) {
			$scope.checkedLabel = {};
			angular.forEach(boxLabels, function (label, indexSign) {
				$scope.checkedLabel[label] = true;
			})
		}

		function setCheckedSignTypes(signTypes) {
			$scope.checkedSign = {};
			angular.forEach(signTypes, function (sign, indexSign) {
				$scope.checkedSign[sign] = true;
			})
		}

		function setStaticSignerDocs(array, $rootScope, tokenManager) {
			angular.forEach(array, function (doc, index) {
				if (doc.code.indexOf('STATIC') == 0) {
					if (isExplorer) {
						var newBlob = new Blob([""], {
							type: "application/pdf"
						});
						newBlob.name = "" + doc.code;
						newBlob.lastModifiedDate = new Date();
						filesStaticsSigner[index] = newBlob;
						docSignerNames.push({
							name: "" + doc.code,
							position: index
						});
					} else {
						filesStaticsSigner[index] = new File([""], doc.code);
					}
				}
			});
		}

		$scope.ok = function (user) {

			// sustituimos cualquier null o undefined por ""
			angular.forEach(user.data, function (valueTag, indexTag) {
				if (valueTag == undefined || valueTag == null) {
					user.data[indexTag] = "";
				}
			});

			user.filesSigner = filesSigner;
			user.filesStaticsSigner = filesStaticsSigner;
			user.docSignerNames = docSignerNames;
			user.staticDocSignerNames = staticDocSignerNames;

			log.log('Saving the follower user: ' + user);
			$uibModalInstance.close(user);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.uploadedSignerFile = function (element) {
			$scope.$apply(function ($scope) {
				var index = element.name.charAt(element.name.length - 1);
				//The file has been cancelled
				if (element.files.length === 0) {
					filesSigner.splice(parseInt(index), 1, undefined);
					deleteInfoDocument(index);
					return;
				}
				//VALIDATE MIMETYPE
				console.log(element.files[0].name + ' -- ' + element.files[0].type);
				if (element.files[0].type !== 'application/pdf') {

					sweet.show({
						title: '',
						confirmButtonColor: '#F27474',
						text: 'El archivo debe ser un pdf válido.',
						confirmButtonText: 'Cerrar',
						type: 'warning'
					});
					deleteInfoDocument(index);
					return;
				} else if (!isExplorer)
					$scope.showPreviewDocument[index] = true;


				filesSigner[parseInt(index)] = element.files[0];

				if (!isExplorer) {
					var reader = new FileReader();

					reader.onload = function (event) {
						$scope.imageSrc = event.target.result;
						var extension = element.files[0].name.split('.').pop().toLowerCase();
						var tif = false;
						var pdf = false;
						if (extension == "tiff" || extension == "tif")
							tif = true;
						else if (extension == "pdf")
							pdf = true;

						if (pdf == false) {
							$('#preview' + index).html("<img width='90px' src='" + event.target.result + "' />");
							$('#name' + index).html(element.files[0].name);
							//					$('#size').html(humanfilesSignerize(file.size, "MB"))
							//					$('#type').html(file.type)
						} else {
							$("#name" + index).empty();
							$('#name' + index).html(element.files[0].name);
							$('#name' + index).attr("title", element.files[0].name);
							if (!isExplorer) {
								PDFJS.getDocument(event.target.result).then(function getPdf(pdf) {
									//
									// Fetch the first page
									//
									pdf.getPage(1).then(function getPage(page) {
										console.debug("getting page");
										var scale = 0.2;
										var viewport = page.getViewport(scale);

										//
										// Prepare canvas using PDF page dimensions
										//
										$("#preview" + index).empty();
										$("#preview" + index).append('<canvas id="pdf-image" class="preview"/>');
										var canvas = $("#preview" + index).find("canvas.preview").get(0);
										var context = canvas.getContext('2d');
										canvas.height = viewport.height;
										canvas.width = viewport.width;

										//
										// Render PDF page into canvas context
										//
										var renderContext = {
											canvasContext: context,
											viewport: viewport
										};
										page.render(renderContext);
									});
								}, function errorCallback(error) {

									sweet.show({
										title: '',
										confirmButtonColor: '#F27474',
										text: 'El archivo debe ser un pdf válido.',
										confirmButtonText: 'Cerrar',
										type: 'error'
									});

									deleteInfoDocument(index);
								});
							}

						}
					}
					reader.readAsDataURL(element.files[0]);
				} else {
					$('#nameDocSigner' + index).html(element.files[0].name);
					$('#nameDocSigner' + index).attr("title", element.files[0].name);
					$('#nameDocSigner' + index).removeClass("notVisible");
				}
			});
		}

		/**
		 * Function to delete the information of the document (name and preview) and don't show the preview document
		 * @param index -- index of the file
		 */
		function deleteInfoDocument(index) {

			$scope.showPreviewDocument[index] = false;

			$("#preview" + index).empty();
			$("#preview" + index).append('<canvas id="pdf-image" class="preview"/>');
			$("#name" + index).empty();

			return;
		}

		/**
		 * It modifies the doc's array everytime you check or uncheck a checkbox. If you check it, this function will erase the file
		 * inside the file's array.
		 * @param  {checkValue} the value of the checkbox. It can be true or false.
		 * @param  {index} the index of the checkbox in the array.
		 */
		$scope.modifyDocsSignerArray = function (checkValue, index) {
			//If it is true then we have to delete the file from the files array.
			if (checkValue) {
				if (angular.isDefined(filesSigner[index])) {
					//Deleting file from the array.
					$("#preview" + index).empty();
					$scope.showPreviewDocument[index] = false;
					if (isExplorer) {
						filesSigner.splice(index, 1, new Blob([""]));
						angular.forEach(docSignerNames, function (staticDoc, indexStatic) {
							if (staticDoc.position === index) {
								var objectToPush = {
									name: "empty",
									position: index
								};
								docSignerNames.splice(indexStatic, 1, objectToPush);
								return;
							}
						});

						$('#nameDocSigner' + index).html("Document Name");
						$('#nameDocSigner' + index).addClass("notVisible");
					} else
						filesSigner.splice(index, 1, new File([""], "empty"));
				} else {
					if (isExplorer) {
						var newBlob = new Blob([""], {
							type: "application/pdf"
						});
						newBlob.name = "empty";
						newBlob.lastModifiedDate = new Date();
						filesSigner[index] = newBlob;
						docSignerNames.push({
							name: "empty",
							position: index
						});
					} else {
						filesSigner[index] = new File([""], "empty");
					}
				}
			} else {
				delete filesSigner[index];
			}
		}

		/**
		 * It modifies the doc's array everytime you check or uncheck a checkbox. If you check it, this function will erase the file
		 * inside the file's array.
		 * @param  {checkValue} the value of the checkbox. It can be true or false.
		 * @param  {index} the index of the checkbox in the array.
		 */
		$scope.modifyStaticsDocsSignerArray = function (checkValue, index) {
			//If it is true then we have to delete the file from the files array.
			if (checkValue) {

				var objectToPush = {
					name: "empty",
					position: index
				};
				if (angular.isDefined(filesStaticsSigner[index])) {
					//Deleting file from the array.
					if (isExplorer) {
						filesStaticsSigner.splice(index, 1, new Blob([""]));

						staticDocSignerNames.splice(index, 1, objectToPush);
					} else
						filesStaticsSigner.splice(index, 1, new File([""], "empty"));
				} else {
					if (isExplorer) {
						var newBlob = new Blob([""], {
							type: "application/pdf"
						});
						newBlob.name = "empty";
						newBlob.lastModifiedDate = new Date();
						filesStaticsSigner[index] = newBlob;
						staticDocSignerNames.push(objectToPush);
					} else {
						filesStaticsSigner[index] = new File([""], "empty");
					}
				}
			} else {
				var newBlob = new Blob([""], {
					type: "application/pdf"
				});
				newBlob.name = "" + $scope.documentsStaticSigner[index].code;

				var objectToPush = {
					name: $scope.documentsStaticSigner[index].code,
					position: index
				};

				if (angular.isDefined(filesStaticsSigner[index])) {
					//Deleting file from the array.
					if (isExplorer) {

						filesStaticsSigner.splice(index, 1, newBlob);
						staticDocSignerNames.splice(index, 1, objectToPush);
					} else
						filesStaticsSigner.splice(index, 1, new File([""], $scope.documentsStaticSigner[index].code));
				} else {
					if (isExplorer) {
						newBlob.lastModifiedDate = new Date();
						filesStaticsSigner[index] = newBlob;
						staticDocSignerNames.push(objectToPush);
					} else {
						filesStaticsSigner[index] = new File([""], $scope.documentsStaticSigner[index].code);
					}
				}
			}
		}

		/**
		 * Utility function to check if all the files have been setted or not.
		 * @return {boolean} - true if all the files are NOT setted, otherwise false.
		 */
		$scope.someFilesMissing = function () {
			var lengthFiles = 0;

			for (var i = filesSigner.length - 1; i >= 0; i--) {
				if (filesSigner[i] !== undefined)
					lengthFiles++;
			}

			for (var i = filesStaticsSigner.length - 1; i >= 0; i--) {
				if (filesStaticsSigner[i] !== undefined)
					lengthFiles++;
			}

			if (lengthFiles !== ($scope.documentsSigner.length + $scope.documentsStaticSigner.length))
				return true;
			else
				return false;
		}
	});



/**
 *   Controller
 *
 *   Description
 */
angular.module('O2DigitalSite').controller('staticDocumentController',
	function (
		$scope,
		$uibModalInstance,
		$rootScope,
		docToUpload,
		tokenManager
	) {

		$scope.documentURL = "webapp/web/viewer.html?file=" + $rootScope.url + "services/operations/file/" + tokenManager.getDomainId() + "/" + tokenManager.getToken() + "/" + docToUpload.code;

		$scope.closeDocModal = function () {
			$uibModalInstance.dismiss('');
		}
	})