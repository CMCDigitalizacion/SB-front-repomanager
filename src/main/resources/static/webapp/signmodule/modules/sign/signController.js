angular
    .module('O2BioSigner')
    .controller('SignController', SignController)

    function SignController($scope, $rootScope, signFactory, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $timeout, $stateParams, sweet) {
    	console.log('Loaded the SignController')
    	console.log(''+$stateParams.userId)
    	console.log(''+$stateParams.idOperation)
    	

    	$scope.idOperation = $stateParams.idOperation;
    	var docSelected = undefined;

    	$scope.dtOptionsDocs = DTOptionsBuilder.newOptions().withOption('pageLength', 10).withPaginationType('simple_numbers');

	    $scope.dtColumnsDocs = [
	        DTColumnDefBuilder.newColumnDef(0).withClass('col-sm-4'),
	        DTColumnDefBuilder.newColumnDef(1).withClass('col-sm-4'),
	        DTColumnDefBuilder.newColumnDef(2).withClass('col-sm-3'),
	        DTColumnDefBuilder.newColumnDef(3).withTitle('Acciones').notSortable().withClass('col-sm-1')
	    ];

	    $scope.startSignProcess = function() {

	    	signFactory.getOperationInfo($scope.idOperation).then(
	    		function(arrayOfDocs) {
	    			$scope.docsList = arrayOfDocs;
	    			$scope.firstVisible = true;
	    		},
	    		function(errorCallback) {
	    			console.log(errorCallback)
	    			var messageToShow = "";
	    			if(errorCallback.currentTarget.readyState === 3){
	    				messageToShow = "La conexión con el <i>websocket</i> esta <u>cerrada o no se pudo abrir</u>."
	    			} else {
	    				messageToShow = "No se ha podido recuperar la operación con id: <i>"+$stateParams.idOperation+"</i>";
	    			}

	    			sweet.show({
			            title: '',
			            text: messageToShow,
			            type: 'error',
			            confirmButtonColor: '#E50747',
			            confirmButtonText: 'Cerrar',
			            html: true
			        })

	    		}
    		)
	    }


	    $scope.signDetails = function(doc) {
			docSelected = doc;
	    	signFactory.getFileByUUid(doc.uuid).then(
	    		function(pdfBase64) {
	    			$scope.firstVisible = false;
	    			$scope.secondVisible = true;
					
	    			
	    			$timeout(function() {
	    				$scope.signersList = doc.docmetadata;
	    				var bodyHeight = $('#body').height();
	    				bodyHeight = bodyHeight - 50 - 41 - 42 - 15;
	    				$('.iframePdf').height(bodyHeight);
	    				$('.signers-div').height(bodyHeight - 38)
	    				$('.iframePdf').attr('src', 'data:application/pdf;base64, '+pdfBase64)
	    				//
	    			}, 500);
	    		},
	    		function(errorCallback) {
	    			console.log(errorCallback);
	    			sweet.show({
			            title: '',
			            text: errorCallback,
			            type: 'error',
			            confirmButtonColor: '#E50747',
			            confirmButtonText: 'Cerrar',
			            html: true
			        })
	    		}
	    	)
	    }


	    $scope.signPdf = function(signer, index) {
	    	$scope.disabledBtnFirmar = true;
	    	
	    	console.log(signer);
	    	signFactory.signFileByUUid(docSelected.uuid, index).then(
	    		function(successCallback) {
	    			signer.signed = true;
	    			signFactory.getTempSignedFileByUUid(docSelected.uuid).then(
			    		function(pdfBase64) {
			    			$timeout(function() {
			    				$('.iframePdf').attr('src', 'data:application/pdf;base64, '+pdfBase64)
			    			}, 500);
			    		},
			    		function(errorCallback) {
			    			console.log(errorCallback)
			    		}
			    	);
	    			
	    			$scope.disabledBtnFirmar = false;
	    		},
	    		function(errorCallback) {
	    			$scope.disabledBtnFirmar = false;
	    		}
	    	);
	    	
	    }

	    $scope.closeSignOperation = function() {
	    	$scope.secondVisible = false;
	    	$scope.firstVisible = true;
	    }

	    $scope.terminateSignProcess = function() {
	    	signFactory.terminateSignProcess($stateParams.idOperation).then(
	    		function(successCallback) {
	    			console.log(successCallback)
	    			angular.forEach($scope.docsList, function(doc, index) {
		    			if(docSelected.uuid === doc.uuid){
		    				doc.docstate = 1; 
		    			}
	    			});
	    			sweet.show({
			            title: '',
			            text: 'Este documento ha sido firmado con succeso.',
			            type: 'success',
			            confirmButtonColor: '#9ED381',
			            confirmButtonText: 'Cerrar',
			            html: true,
			            closeOnConfirm: true,
			        }, 
			        	function(isConfirm) {
			            	$scope.$apply(function(){
			            		$scope.secondVisible = false;
		    					$scope.firstVisible = true;
			            	})
			        })
	    		},
	    		function(errorCallback) {
	    			console.log(errorCallback)
	    			sweet.show({
			            title: '',
			            text: 'Ha occurido algún error al firmar el documento.',
			            type: 'error',
			            confirmButtonColor: '#E50747',
			            confirmButtonText: 'Cerrar',
			            html: true
			        })
	    		}
	    	)
	    }

	    $scope.disableFinalize = function() {
	    	//Everybody have signed!
	    	var someoneMiss = false;
	    	angular.forEach($scope.signersList, function(signer, index) {
	    		if(!signer.signed){
	    			//someone have to sign!
	    			someoneMiss = true;
	    			return;
	    		}
	    	});
	    	return someoneMiss;
	    }
    }