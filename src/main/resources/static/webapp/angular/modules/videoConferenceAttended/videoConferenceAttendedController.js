angular
    .module('O2DigitalSite')
    .controller('VideoConferenceAttendedController', VideoConferenceAttendedController);

function VideoConferenceAttendedController($rootScope, $scope, $state, $compile, $uibModal, tokenManager, videoConferenceAttendedService, cfpLoadingBar, advanced_REST_Services) {

    $rootScope.$broadcast('rootChange', 'Atender / Vídeo conferencia');
    $rootScope.attendingVideoconference = true;

    $scope.actualConnections = 0;
    
    // close opentok session if the page state is changed
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
        if(angular.isDefined(subscriber))
            session.unsubscribe(subscriber);
        if(angular.isDefined(publisher))
            session.unpublish(publisher);
        // if(angular.isDefined(session))
        //     session.disconnect();
    });
    
    $scope.isBtnInitVisible = false;
    $scope.isBtnCaptureVisible = false;
    $scope.isBtnCaptureBackVisible = false;
    $scope.isBtnSignalingVisible = false;
    $scope.videoConferenceVisible = true;

    //$scope.isApproveValidationVisible = true;
    //$scope.isRejectValidationVisible = true;
    
    $scope.isApproveOrRejectVideoConference = true;
    $scope.isBtnSignalingDisabled = true;
    $scope.recording = false;

    var session, publisher, subscriber, archiveID;
    $scope.isVideoRecorded = false;

    $scope.checkedValues = {};
    var allCheckedVar = false;
    // Get conference to attend
    $scope.getVideoConferenceToAttend = function() {

    	$scope.recording = false;
    	videoConferenceAttendedService.getVideoConferenceToAttend(tokenManager.getDomainId()).then(
            function(responseSuccess) {
            	$scope.operationuuid = responseSuccess.data.operationuuid;
            	$rootScope.operationname = responseSuccess.data.opname;
            	videoConferenceAttendedService.setOperationUuid(responseSuccess.data.operationuuid);

                videoConferenceAttendedService.obtainVideoDetails($scope.operationuuid).then(
                    function(responseSuccess) {
                        $rootScope.detailsData = responseSuccess.data;
                        videoConferenceAttendedService.getManagerQuestions($scope.operationuuid).then(
                            function(responseSuccess) {
                                if(responseSuccess.status === 204) {
                                    allCheckedVar = true;
                                    $scope.questionNumber = 0;
                                } else {
                                    $scope.managerQuestions = responseSuccess.data.managerquestions;
                                    var elem = $compile($scope.managerQuestions)($scope);
                                    $scope.questionNumber = ($scope.managerQuestions.match(/<input/g) || []).length;
                                    $('#managerQuestionContainer').append(elem);
                                }
                            },
                            function(responseError) {
                                $rootScope.$broadcast('callError', responseError.data.failure);
                            }
                        );
                    },
                    function(responseError) {
                        $rootScope.$broadcast('callError', responseError.data.failure);
                    }
                );

            	videoConferenceAttendedService.obtainConferenceData(responseSuccess.data.operationuuid).then(
                    function(responseSuccess) {
                        $scope.openTokData = { apiKey: responseSuccess.data.apiKey,
                            sessionId: responseSuccess.data.sessionId,
                            token: responseSuccess.data.token
                            };
                        videoConferenceAttendedService.setOpenTokSessionData($scope.openTokData);
                        $rootScope.$broadcast('callSuccess', 'Nos dirigimos a la video conferencia');
                        $scope.initializeOpenTokSession();
                        advanced_REST_Services.getAdvancedOptions(tokenManager.getDomainId()).then(
                            function(responseSuccess) {
                                if(responseSuccess.data.activatedVideoChat) {
                                    $scope.showChatView = true;
                                } else {
                                    $scope.showChatView = false;
                                }
                            }, 
                            function(responseError) {
                                $rootScope.$broadcast('callError', responseError.data.failure);
                            }
                        );
                    },
                    function(responseError) {
                        $rootScope.$broadcast('callError', responseError.data.failure);
                    }
                );
            },
            function(responseError) {
                $scope.isLoaded = true;
                $rootScope.$broadcast('callError', responseError.data.failure);
                $rootScope.showModal('Ya hay un gestor atendiendo esta videoconferencia o el cliente ha abandonado la identificación.');
            });
    };

    // Initialize openTok session for video conference
    $scope.initializeOpenTokSession = function() {
        $scope.openTokData = videoConferenceAttendedService.getOpenTokSessionData();
        session = OT.initSession($scope.openTokData.apiKey, $scope.openTokData.sessionId);
        // Connect to our session and publish our feed
        session.connect($scope.openTokData.token, function(error) {
            publisher = OT.initPublisher("publisher",
                {
                    width: 320,
                    height: 240,
                    mirror: false,
                    resolution: '320x240',//'1280x720',//'640x480', //'320x240'
                    frameRate: 30
                });
            session.publish(publisher);
        });
        // When a client connects, subscribe to its feed
        session.on({
            streamCreated: function(event) {
                if($scope.actualConnections < 1) {
                    $scope.actualConnections++;
                    $scope.connection = event.stream.connection;
                    subscriber = session.subscribe(event.stream, 'suscriber', {
                        insertMode: 'append',
                        width: 640,
                        height: 480,
                        resolution: '1280x720',
                        frameRate: 30,
                    });
                } else {
                    $scope.actualConnections++;
                }
            },
            sessionDisconnected: function(event) {
                if(angular.isDefined(subscriber))
                    session.unsubscribe(subscriber);
                if(angular.isDefined(publisher))
                    session.unpublish(publisher);
                if(angular.isDefined(session))
                    session.disconnect();
            },
            streamDestroyed: function(event) {
                if($scope.actualConnections === 1) {
                    $scope.actualConnections--;
                    if(angular.isDefined(subscriber))
                        session.unsubscribe(subscriber);
                    if(angular.isDefined(publisher))
                        session.unpublish(publisher);
                    $scope.isBtnInitVisible = false;
                    $scope.isBtnCaptureVisible = false;
                    $scope.isBtnCaptureBackVisible = false;
                    $scope.isBtnSignalingVisible = false;
                } else
                    $scope.actualConnections--;
            },
            archiveStarted: function(event) {
            	archiveID = event.id;
            	$scope.recording = true;
            	$scope.$apply();
                console.log('Archive started ' + archiveID+ '  ' + $scope.recording);
            },
            archiveStopped: function(event) {
            	archiveID = event.id;
                console.log('Archive stoped ' + archiveID);
                $scope.$apply(function(){
                	$scope.isVideoRecorded = true;
                    $scope.canApprove();
                });
            },
            signal: function(event) {
                if(event.data.indexOf("mobileApp") !== -1) {
                    $rootScope.$broadcast('mobileAppVideoConference');
                } else if(event.data.indexOf("outSecondManager") !== -1 ) {
                    $rootScope.showModal('Ya hay un gestor atendiendo esta videoconferencia o el cliente ha abandonado la identificación.');
                }
            }
        });

        // Singaling for text chat
        session.on('signal:chat', function(event) {
            msgHistory = document.getElementById('msgHistory');
            var msg = document.createElement('p');
            var date = $scope.getCurrentDate();
            msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
            if(msg.className === 'mine') {
                customerName = 'Gestor';//$scope.$parent.name + " " + $scope.$parent.surname;
                msg.innerHTML = date + ' -- ' + customerName + ': ' + '<br/>' + event.data;
            } else {
                customerName = $rootScope.detailsData.customer.name + " " + $rootScope.detailsData.customer.lastName;
                //customerName = 'Cliente';
                msg.innerHTML = date + ' -- ' + customerName + ': ' + '<br/>' + event.data;
            }
            msgHistory.prepend(msg);
            //msg.scrollIntoView();
        });
    }

    $scope.$on('mobileAppVideoConference', function functionName() {
        $scope.$apply(function() {
        	$scope.state = 11;
            $scope.isBtnInitVisible = true;
            $scope.isRejectValidationVisible = false;
            $scope.isMobileVideoConference = true;
            $scope.isWebConference = false; 
        });
    });

    $scope.sendSignalToClient = function() {
        if($scope.state === 11) {
			$scope.state = 12;
			$scope.isBtnInitVisible = false;
			$scope.isBtnCaptureVisible = true;
			$scope.labelBtnCapture = 'Capturar cara';
            $scope.isBtnSignalingVisible = true;
			$scope.labelSignalingBtn = 'Siguiente';
            $scope.isBtnSignalingDisabled = true;
            session.signal({
                to: $scope.connection,
                data: $scope.connection.connectionId,
                type: 'StartingFaceRecognition'
            });
        } else if($scope.state === 12) {
            $scope.state = 13;
            $scope.labelBtnCapture = 'Capturar anverso';
            $scope.labelSignalingBtn = 'Siguiente';
            $scope.isBtnSignalingDisabled = true;
            session.signal({
                to: $scope.connection,
                data: $scope.connection.connectionId,
                type: 'StartingFrontDNIRecognition'
            });
        } else if($scope.state === 13) {
            $scope.state = 14;
            $scope.isBtnCaptureVisible = false;
            $scope.isBtnCaptureBackVisible = true;
            $scope.labelSignalingBtn = 'Terminar identificación';
            $scope.isBtnSignalingDisabled = true;
            session.signal({
                to: $scope.connection,
                data: $scope.connection.connectionId,
                type: 'StartingBackDNIRecognition'
            });
        } else if($scope.state === 14) {
        	$scope.state = 15;
            $scope.isBtnCaptureVisible = false;
            $scope.isBtnCaptureBackVisible = false;
            $scope.isBtnSignalingDisabled = false;
            //Enable Approve button
            $scope.isVideoRecorded = true;
            $scope.labelSignalingBtn = 'Terminar Video conferencia';
            session.signal({
                to: $scope.connection,
                data: $scope.connection.connectionId,
                type: 'EndedBackDNIRecognition'
            });

        } else if($scope.state === 15) {
        	$scope.state = 0;
            $scope.isBtnSignalingVisible = false;
            $scope.videoConferenceVisible = false;
            session.signal({
                to: $scope.connection,
                data: $scope.connection.connectionId,
                type: 'EndVideoconference'
            });
        }
    }

    $scope.getCurrentDate = function() {
        var currentdate = new Date();
        var min = currentdate.getMinutes();
        var minutes = min.toString();
        if(minutes.length === 1) {
            minutes = '0' + minutes;
        }
        var sec = currentdate.getSeconds();
        var seconds = sec.toString();
        if(seconds.length === 1) {
            seconds = '0' + seconds;
        }
        return currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1)  + "/"
                + currentdate.getFullYear() + " - "
                + currentdate.getHours() + ":"
                + minutes + ":"
                + seconds;
    }

    $scope.text = {};
    $scope.sendMessage = function(text) {
        var tempScrollTop = $(window).scrollTop();
        session.signal({
                type: 'chat',
                data: text
            },
            function(error) {
                if (!error) {
                  text = '';
                }
            }
        );
        $scope.text.msg = '';
        $(window).scrollTop(tempScrollTop);
    }

    var scaleFactor = 0.8;
    var snapshots = [];

    /**
     * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
     */
    $scope.captureImageFromVideo = function() {
        $scope.isBtnSignalingVisible = true;
        $scope.isBtnSignalingDisabled = false;
        if($scope.labelBtnCapture.indexOf('Capturar anverso') !== -1 && $scope.isWebConference) {
            $scope.isBtnCaptureBackVisible = true;
        }
        var b64Image = subscriber.getImgData();

        var output = document.getElementById('output');
        var canvas = document.createElement('canvas');
        canvas.height = 320;
        canvas.width = 480;
        output.appendChild(canvas);
        var context = canvas.getContext('2d');
        var image = new Image();
        image.onload = function(){
            var imgw = image.width;
            var imgh = image.height;
            canvas.height = canvas.width * imgh/imgw;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);    	
        }
        image.src = 'data:image/png;base64,' + b64Image;

        $scope.operationuuid = videoConferenceAttendedService.getOperationUuid();
        var data = new FormData();
        data.append('operationuuid', $scope.operationuuid);
        if($scope.labelBtnCapture.indexOf('Capturar cara') !== -1) {
            data.append('face', b64Image);
        } else if($scope.labelBtnCapture.indexOf('Capturar anverso') !== -1) {
            data.append('dnifront', b64Image);
        } else {
            data.append('imageData', b64Image);
        }

        $.ajax({
            url:  $rootScope.url + 'services/videos/uploadidentificationimages',
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                console.log('Las imágenes capturadas se han subido correctamente');
            },
            error: function(data) {
                console.log('Ha ocurrido un error al subir las imágenes capturadas');
            }
        });
    };

    $scope.captureDniBack = function() {
        var b64Image = subscriber.getImgData();
        
        var output = document.getElementById('output');
        var canvas = document.createElement('canvas');
        canvas.height = 320;
        canvas.width = 480;
        output.appendChild(canvas);
        var context = canvas.getContext('2d');
        var image = new Image();
        image.onload = function(){
            var imgw = image.width;
            var imgh = image.height;
            canvas.height = canvas.width * imgh/imgw;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);    	
        }
        image.src = 'data:image/png;base64,' + b64Image;
        
        $scope.operationuuid = videoConferenceAttendedService.getOperationUuid();
        var data = new FormData();
        data.append('operationuuid', $scope.operationuuid);
        data.append('dniback', b64Image);

        $.ajax({
            url: $rootScope.url + 'services/videos/uploadidentificationimages',
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                console.log('Las imágenes se han enviado correctamente');
                $scope.isBtnSignalingDisabled = false;
                videoConferenceAttendedService.obtainVideoDetails($scope.operationuuid).then(
                        function(responseSuccess) {
                            cfpLoadingBar.complete();
                            $rootScope.detailsData = responseSuccess.data;
                    	    $rootScope.operationuuid = $scope.detailsData.operationuuid;
                            $scope.isBtnSignalingVisible = true;
                        },
                        function(responseError) {
                            $rootScope.$broadcast('callError', responseError.data.failure);
                        });
            },
            error: function (data) {
                console.log('Ha ocurrido un error al subir las imágenes.');
            }
        });
    };

    //
    $scope.isApproveValidationVisible = true;
    $scope.isRejectValidationVisible = false;

    var allCheckedVar = false

    $scope.allChecked = function(value) {
        var keepGoing = true;
        angular.forEach($scope.checkedValues, function(value) {
            if(keepGoing) {
                if(value === true) {
                	allCheckedVar = true;
                } else {
                	allCheckedVar = false;
                    keepGoing = false;
                }
            }
        });
        $scope.canApprove();
    }

    // $scope.allCheckedAndPin = function() {
    //     $scope.canApprove();
    //     if(angular.isDefined($scope.pin)) {
    //         $scope.isRejectValidationDisable = false;
    //     } else {
    //         $scope.isRejectValidationDisable = true;
    //     }
    // }

    $scope.canApprove = function() {
        if(allCheckedVar && $scope.isVideoRecorded && $scope.questionNumber === Object.keys($scope.checkedValues).length) { // && moment($rootScope.detailsData.customer.icarExpirationDate, 'DD-MM-YYYY', true).isValid()
            $scope.isApproveValidationVisible = false;
        } else {
            $scope.isApproveValidationVisible = true;
        }        
    }

    $scope.approveVideoConference = function() {
        if(angular.isDefined(subscriber))
            session.unsubscribe(subscriber);
        if(angular.isDefined(publisher))
            session.unpublish(publisher);
        $scope.operationuuid = videoConferenceAttendedService.getOperationUuid();
        videoConferenceAttendedService.approveVideoConference($scope.operationuuid).then(
            function(responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'La vídeo conferencia ha sido aprobada correctamente');
                $scope.isApproveOrRejectVideoConference = false;
                // Signaling event
                $scope.videoConferenceVisible = false;
                session.signal({
                    to: $scope.connection,
                    data: $scope.connection.connectionId,
                    type: 'EndedProcessCorrectly'
                });
                if(angular.isDefined(session))
                    session.disconnect();
                $scope.isApproveValidationVisible = true;
                $scope.isRejectValidationVisible = true;
                $scope.isBtnInitVisible = false;
                $scope.isBtnCaptureVisible = false;
                $scope.isBtnCaptureBackVisible = false;
                $scope.isBtnSignalingVisible = false;
              //  $scope.recording = false;
                // $rootScope.messageModal = ;
                $rootScope.showModal('La vídeo conferencia ha sido aprobada correctamente');
                // $uibModal.open({
                //     animation: true,
                //     size: 'lg',
                //     templateUrl: 'approveOrRejectVideoModal.html',
                //     controller: function($scope, $uibModalInstance, $state, tokenManager) {
                //         $scope.exitModal = function () {
                //             $uibModalInstance.dismiss('');
                //             $state.go('dashboardfunnel', { id : tokenManager.getDomainId() });
                //         }
                //     },
                //     windowClass: 'dialogGeneral'
                // });
            },
            function(responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
                // $rootScope.messageModal = ;
                $rootScope.showModal("Ha ocurrido un error al aprobar la vídeo conferencia seleccionada. Vuelva a intentarlo.");
                // $uibModal.open({
                //     animation: true,
                //     size: 'lg',
                //     templateUrl: 'approveOrRejectVideoModal.html',
                //     controller: function($scope, $uibModalInstance, $state, tokenManager) {
                //         $scope.exitModal = function () {
                //             $uibModalInstance.dismiss('');
                //             $state.go('dashboardfunnel', { id : tokenManager.getDomainId() });
                //         }
                //     },
                //     windowClass: 'dialogGeneral'
                // });
            });
    };

    $scope.rejectVideoConference = function() {
        session.signal({
            to: $scope.connection,
            data: $scope.connection.connectionId,
            type: 'EndedBackDNIRecognition'
        });
        if(angular.isDefined(subscriber))
            session.unsubscribe(subscriber);
        if(angular.isDefined(publisher))
            session.unpublish(publisher);
        $scope.operationuuid = videoConferenceAttendedService.getOperationUuid();
        videoConferenceAttendedService.rejectVideoConference($scope.operationuuid).then(
            function(responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'La vídeo conferencia ha sido rechazada correctamente.');
                $scope.isApproveOrRejectVideoConference = false;
                // Signaling event.
                $scope.videoConferenceVisible = false;
                session.signal({
                    to: $scope.connection,
                    data: $scope.connection.connectionId,
                    type: 'EndedProcessWrongly'
                });
                if(angular.isDefined(session))
                    session.disconnect();
                $scope.isApproveValidationVisible = true;
                $scope.isRejectValidationVisible = true;
                $scope.isBtnInitVisible = false;
                $scope.isBtnCaptureVisible = false;
                $scope.isBtnCaptureBackVisible = false;
                $scope.isBtnSignalingVisible = false;
                // $rootScope.messageModal = ;
                $rootScope.showModal('La vídeo conferencia ha sido rechazada correctamente.');
            },
            function(responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
                // $rootScope.messageModal = ;
                $rootScope.showModal("Ha ocurrido un error al rechazar la vídeo conferencia seleccionada. Vuelva a intentarlo.");
            });
    };

    $scope.goToVideoConferenceTable = function () {
        if(angular.isDefined(subscriber))
            session.unsubscribe(subscriber);
        if(angular.isDefined(publisher))
            session.unpublish(publisher);
        if(angular.isDefined(session))
            session.disconnect();
        $state.go('videoConferenceTable');
    }
   
    
    $scope.$on("$destroy", function() {
    	$rootScope.attendingVideoconference = false;
    });

    $rootScope.showModal = function(message) {
        $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'approveOrRejectVideoModal.html',
            backdrop: false,
            controller: function($scope, $uibModalInstance, $state, tokenManager) {
                $scope.messageModal = message;
                $scope.exitModal = function () {
                    $uibModalInstance.dismiss('');
                    $state.go('dashboardfunnel', { id : tokenManager.getDomainId() })
                }
            },
            windowClass: 'dialogGeneral'
        });
    }
}
