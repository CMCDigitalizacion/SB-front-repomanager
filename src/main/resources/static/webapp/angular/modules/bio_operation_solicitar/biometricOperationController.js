angular
	.module('O2DigitalSite')
	.controller('BiometricOperationController', ['$scope', '$http', '$state', '$stateParams', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$rootScope', '$uibModal', 'bioOperationRESTServices', '$log', '$parse', 'hotkeys', 'tokenManager',
 function($scope, $http, $state, $stateParams, $compile, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $rootScope, $uibModal, bioOperationRESTServices, $log, $parse, hotkeys, tokenManager){
$rootScope.$broadcast('rootChange', 'Solicitar Firma / Biométrica')
 	$scope.dtInstancePolicy = {}
 	$scope.policyList = [];

 	$scope.docs = [];
 	$scope.titular = {};
 	$scope.docsSigners = [];
 	$scope.files = [];
 	var fileToUpload = [];

 	var idOperation = moment().format('YYYYMMDDHHmmss');
 	var policyID;

 	// var isTwo = false;

 	hotkeys.bindTo($scope)
 	.add({
      combo: 'alt+c',
      description: 'To fill all fields with default values.',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
      	console.log('alt+c');
      	if($scope.secondVisible){
      		$scope.titular = {
      			nombre : 'José Luis Lamata Feliz',
      			direccion : 'Calle Casimiro noveno b',
      			nif : '12345678P',
      			telefono : 666666666,
      			email : 'lamata@feliz.com'
      		}

      		angular.forEach($scope.docs, function(doc, index) {
      			angular.forEach(doc.signersArray, function(signer, indexSigner) {
      				signer.nombre = "Emiliano Salido del Pozo " + index + indexSigner;
      				signer.nif = index + indexSigner + "345678L";
      			})
      		})
      	}
      }
    })
    .add({
      combo: 'alt+d',
      description: 'To delete all the form values',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
      	console.log('alt+d')
  		if($scope.secondVisible){
      		$scope.titular = {
      			nombre : '',
      			direccion : '',
      			nif : '',
      			telefono : null,
      			email : ''
      		}

      		angular.forEach($scope.docs, function(doc, index) {
      			angular.forEach(doc.signersArray, function(signer, indexSigner) {
      				signer.nombre = '';
      				signer.nif = '';
      			})
      		})
  		}	
      }
    })
    .add({
      combo: 'alt+f',
      description: 'To copy titular name, surname and NIF for all the signer',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
      	console.log('alt+f')
      	if($scope.secondVisible){
      		angular.forEach($scope.docs, function(doc, index) {
      			angular.forEach(doc.signersArray, function(signer, indexSigner) {
      				signer.nombre = $scope.titular.nombre;
      				signer.nif = $scope.titular.nif;
      			})
      		})
      	}
      }
    })

    $scope.dtOptionsPolicy = DTOptionsBuilder.newOptions().withOption('pageLength', 8).withPaginationType('simple_numbers');

    $scope.dtColumnsPolicy = [
        DTColumnDefBuilder.newColumnDef(0).withClass('col-sm-5'),
        DTColumnDefBuilder.newColumnDef(1).withClass('col-sm-4'),
        DTColumnDefBuilder.newColumnDef(2).withClass('col-sm-2'),
        DTColumnDefBuilder.newColumnDef(3).withTitle('Acciones').notSortable().withClass('col-sm-1')
    ];


 	$scope.loadPoliciesType = function () {
 		
    	bioOperationRESTServices.getPolicies(tokenManager.getDomainId()).then(
        	function successCallback(responseSuccess) {
                
                $scope.policyList = responseSuccess.data;
                $scope.firstVisible = true;
          }, function errorCallback(responseError) {

          });
 	}

 	$scope.createOperation = function (policy) {
 		$scope.docs = [];
	 	$scope.titular = {};
	 	$scope.docsSigners = [];
	 	$scope.files = [];
	 	fileToUpload = [];
	 	idOperation = moment().format('YYYYMMDDHHmmss');
	 	policyID = policy.id;

 		bioOperationRESTServices.getDocumentsTypeByPolicyTypeID(policy.id).then(
 			function (responseSuccess) {
 				var docsArrayResponse = responseSuccess.data;
 				$scope.docs = setSignersForDocs(docsArrayResponse);

 				angular.forEach($scope.docs, function(file, index) {
 					$scope.files.push({});
 					fileToUpload.push({});
 				})
 				
 				$scope.firstVisible = false;
 				$scope.secondVisible = true;
 			},
 			function (responseError) {
 				
 			}
 		)
        
 	}

 	$scope.closeCreateOperation = function () {
 		$scope.secondVisible = false;
 		$scope.firstVisible = true;
 	}

 	$scope.uploadedFile = function(element) {
 		$log.log(element.files)
 		$scope.$apply(function($scope) {
		    var index = element.name.charAt(element.name.length-1);
		    $scope.files.splice(parseInt(index), 1, element.files[0]);
		    fileToUpload.splice(parseInt(index), 1, element.files[0]);
		   	var reader = new FileReader();
		   	reader.onload = function(event){
		   		$scope.imageSrc  = event.target.result;
		   		var extension = element.files[0].name.split('.').pop().toLowerCase();
		        var tif = false;
		        var pdf = false;
		        if (extension == "tiff" || extension == "tif")
		          tif = true;
		        else if (extension == "pdf")
		          pdf = true;
		
		   		if(pdf == false ){
		   			$('#preview'+ index).html("<img width='90px' src='"+event.target.result+"' />");
					$('#name'+ index).html(element.files[0].name);
		   		}
				else{
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
		             });
				}
		   	}
		   	reader.readAsDataURL(element.files[0]);
		   	
		 	});
 	}

 	$scope.createNewOperation = function () {
 		$log.log($scope.files)
 		$log.log($scope.docs)
 		$log.log($scope.titular)

 		var operationBean = {}

		var operationForm = new FormData();

		
		angular.forEach(fileToUpload, function (file, index) {
			operationForm.append('files', file);
		})
		operationForm.append('idoperation', idOperation);
		operationForm.append('metadata', JSON.stringify($scope.titular));
		operationForm.append('idpolicytype', parseInt(policyID));
		var documentsMetadata = [];
		documentsMetadata = setTheRightMetadata(documentsMetadata);
		documentsMetadata = JSON.stringify(documentsMetadata);
		operationForm.append('listOfDocsMetadata', documentsMetadata);


		bioOperationRESTServices.createNewOperation(operationForm).then(
			function (responseSuccess) {
				var qrModalInstance = $uibModal.open({
		          animation: true,
		          templateUrl: 'modalSignprova.html',
		          controller: 'SignPopUpController',
		          resolve: {
			        idOperation: function () {
			          return idOperation;
			        }
			      },
		          windowClass: 'dialogGeneral qr-modal-window'
		        });

		        qrModalInstance.result.then(
		        	function (argument) {
		        		console.log('prova')
		        	},
		        	function (argument) {
		        		$scope.closeCreateOperation();
		        	}
		        )
			},
			function (responseError) {
				$rootScope.$broadcast('callError', responseError.data.failure);
			}
		)

 	}

 	function setTheRightMetadata (documentsMetadata) {
 		angular.forEach($scope.files, function (file, index) {
 			var metadata = {
 				docname: file.name,
 				idoperation: idOperation,
 				docpath: idOperation,
 				docsignedpath: idOperation,
 				docmetadata: $scope.docs[index].signersArray,
 				docmetadata2: $scope.docs[index].id
 			}
 			documentsMetadata.push(metadata);
 		})

 		return documentsMetadata;
 	}

 	function setSignersForDocs (docsArray) {
 		angular.forEach(docsArray, function (doc, index) {
 			if(doc.signType === "Firma Biometrica"){
 				var metadata = JSON.parse(doc.metadata);
 				doc.signersArray = [];
 				angular.forEach(metadata, function (coordinate, indexCoordinate) {
 					var signer = {
 						x: parseInt(coordinate.x),
 						y: parseInt(coordinate.y),
 						page: parseInt(coordinate.pag),
 						height: parseInt(coordinate.height),
 						width: parseInt(coordinate.width),
 						nif: "",
 						telefono: "",
 						nombre: ""  
 					}
 					doc.signersArray.push(signer);

 				})
 			}
 		})

 		return docsArray;
 	}
 }]);

angular
	.module('O2DigitalSite')
	.controller('SignPopUpController', function($scope, $window, idOperation) {
		$scope.qrCodeAsImg = '/BSign/services/encargosbio/qr/'+idOperation;

		$scope.openSignWacomPage = function() {
			$window.open($rootScope.url + 'webapp/signmodule/index.html#/sign/1/'+idOperation, '_blank');
		}

	})
