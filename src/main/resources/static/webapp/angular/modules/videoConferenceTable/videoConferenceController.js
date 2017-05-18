var videoList, videoCount = 1, videoPlayer, urlVideoPlayer;

angular
    .module('O2DigitalSite')
    .controller('VideoConferenceController', VideoConferenceController);

function VideoConferenceController($rootScope, $scope, $state, $stateParams, $uibModal, $http, $compile, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, tokenManager, videoConferenceService, cfpLoadingBar, $timeout, CognitiveServices, advanced_REST_Services, videoConferenceFilterService, sweet) {

    // object to send to congnitive services
    var images = {}, coordinates = {}, landMarks = {};
    $rootScope.verificationLevel = {}

    $scope.actualConnections = 0;

    $rootScope.$broadcast('rootChange', 'Atender / Vídeo conferencia');
    $scope.videosList = [];

    // close opentok session if the page state is changed
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (angular.isDefined(subscriber))
            session.unsubscribe(subscriber);
        if (angular.isDefined(publisher))
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

    var session, publisher, subscriber, archiveID;
    $scope.isVideoRecorded = false;

    var allCheckedVar = false;

    $scope.fromdatepicker = {
        opened: false
    };

    $scope.todatepicker = {
        opened: false
    };

    $scope.dtOptionsVideoConference = DTOptionsBuilder.newOptions()
        .withPaginationType('simple_numbers')
        .withOption('stateSave', true)
        .withOption('stateDuration', -1)
        .withOption('stateSaveCallback', function(settings, data) {
            sessionStorage.setItem( 'DataTables_VideoconferencesList', JSON.stringify(data) )
        })
        .withOption('stateLoadCallback', function(settings, data) {
            return JSON.parse( sessionStorage.getItem( 'DataTables_VideoconferencesList' ) )
        })
        .withOption('columnDefs', [{ 'targets': [6], sortable: false }])
        .withOption('order', [2, 'desc'])
        .withButtons([
            {
                extend: 'csv',
                text  : 'Exportar a CSV'
            },
            {
                extend: 'excel',
                text  : 'Exportar a Excel'
            }
        ])
        ;
    $scope.dtColumnsVideoConference = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
        DTColumnDefBuilder.newColumnDef(5),
        DTColumnDefBuilder.newColumnDef(6).notSortable()
    ];

    $scope.viewVideo = function (data) {
        $rootScope.operationuuid = data.operationuuid;
        $scope.operationuuid = data.operationuuid;
        videoConferenceService.obtainVideoDetails(data.operationuuid).then(
            function (responseSuccess) {
                $rootScope.detailsData = responseSuccess.data;
                $rootScope.operationuuid = $scope.detailsData.operationuuid;
                $rootScope.isActaVisible = false;
                videoConferenceService.getAllVideos($scope.detailsData.operationuuid).then(
                    function (responseSuccess) {
                        videoList = responseSuccess.data;
                        // $scope.initializePlayer();
                        urlVideoPlayer = "services/videos/getunvideo/" + videoList[0] + "?ddd=" + tokenManager.getDomainId();
                        $rootScope.urlacta = "services/videos/getactavideo/" + $scope.detailsData.operationuuid;
                        //Check ActaPdf existence
                        $http({
                            method: 'GET',
                            url: $rootScope.url + $rootScope.urlacta
                        }).then(function successCallback(response) {
                            console.log($rootScope.url + $rootScope.urlacta + ' reachable');
                            $rootScope.isActaVisible = true;
                        }
                            );
                        // $scope.initializePlayer();
                        if (angular.isUndefined($scope.uuid)) {
                            $rootScope.$broadcast('callSuccess', 'Nos dirigimos a la visualización del video');
                            $state.go('viewVideoConference');
                            $timeout(function () {
                                $scope.initializePlayer();
                                $scope.obtainVerifyImages($rootScope.detailsData.customer.verificationImages);
                            }, 1000);
                        } else {
                            $scope.initializePlayer();
                            $scope.obtainVerifyImages($rootScope.detailsData.customer.verificationImages);
                        }
                    },
                    function (responseError) {
                        $rootScope.$broadcast('callError', responseError.data.failure);
                    });
            },
            function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
            }
        );
    };

    $scope.uuid = $stateParams.openVideoDetails;
    if ($scope.uuid !== "") {
        $scope.viewVideo({ operationuuid: $scope.uuid });
    }

    $rootScope.checkedValues = {};

   // Load video conference table
    $scope.loadVideoConferenceTable = function () {
        if (!videoConferenceFilterService.isDefinedFilterVideoConference())
            $scope.filterVideoTable(undefined);
        else{
            $scope.filter = videoConferenceFilterService.getVideoconferenceFilter();
            $scope.filterVideoTable(videoConferenceFilterService.getVideoconferenceFilter());
        }
    };

    $scope.clearFilterAndReloadVideoConferenceTable = function() {
        $scope.filterVideoTable(videoConferenceFilterService.removeFilter());
    }

    $scope.filterVideoTable = function (filter) {
        console.log(filter);
        var messageDateError = '';
       
        if (angular.isDefined(filter)) {
            var filterCopied = videoConferenceFilterService.returnCopiedFilter($scope.filter);
            $scope.filter    = videoConferenceFilterService.returnFormattedFilter($scope.filter);

            if(filterCopied.fromFormattedData !== 'undefined' && filterCopied.toFormattedData !== 'undefined' && filterCopied.fromFormattedData>filterCopied.toFormattedData){
                sweet.show({
                    title: '',
                    confirmButtonColor: '#F27474',
                    text: 'La fecha final debe ser igual o posterior a la inicial.',
                    confirmButtonText: 'Cerrar',
                    type: 'warning'
                });
            } else {
                videoConferenceService.getFilteredVideoConferences(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), filterCopied).then((responseSuccess) => {
                    $scope.videoConferencesList = responseSuccess.data;
                    videoConferenceFilterService.saveVideoconferenceFilter(filterCopied);
                    $scope.isLoaded = true;
                    $rootScope.$broadcast('callSuccess', 'Videconferencias filtradas correctamente.'); 
                }).catch((responseError) => {
                    if(angular.isDefined(responseError.data.failure))
                        $rootScope.$broadcast('callError', responseError.data.failure);
                    else
                        $rootScope.$broadcast('callError', "Ha ocurrido un error general.");
                })
            }
        } else {
            $scope.filter = videoConferenceFilterService.returnEmptyFilter();
            var filterToSend = {
                fromFormatted: 'undefined',
                toFormatted  : 'undefined',
                operationid  : 'undefined',
                agent        : {
                    name     : 'undefined'
                },
                videostate   : 'undefined'
            }

            videoConferenceService.getFilteredVideoConferences(tokenManager.getDomainId(), tokenManager.getUserIdFromToken(), filterToSend).then((responseSuccess) => {
                $scope.videoConferencesList = responseSuccess.data;
                $scope.isLoaded = true;

            }).catch((responseError) => {

            })
        }

    }

    $scope.openFromDatePicker = function () {
        $scope.fromdatepicker.opened = true;
    }

    $scope.openToDatePicker = function () {
        $scope.todatepicker.opened = true;
    }

    $scope.goToVideoConference = function (conference) {
        // $rootScope.operationuuid = data.operationuuid;
        $scope.operationuuid = conference.operationuuid;
        $rootScope.operationname = conference.opname;
        videoConferenceService.setOperationUuid($scope.operationuuid);

        videoConferenceService.obtainConferenceData(conference.operationuuid).then(
            function (responseSuccess) {
                $scope.openTokData = {
                    apiKey: responseSuccess.data.apiKey,
                    sessionId: responseSuccess.data.sessionId,
                    token: responseSuccess.data.token
                };
                videoConferenceService.setOpenTokSessionData($scope.openTokData);
                $rootScope.attendingVideoconference = true;
                $state.go('videoConference');
                $rootScope.$broadcast('callSuccess', 'Nos dirigimos a la video conferencia');
                advanced_REST_Services.getAdvancedOptions(tokenManager.getDomainId()).then(
                    function (responseSuccess) {
                        if (responseSuccess.data.activatedVideoChat) {
                            $scope.showChatView = true;
                        } else {
                            $scope.showChatView = false;
                        }
                        videoConferenceService.obtainVideoDetails($scope.operationuuid).then(
                            function (responseSuccess) {
                                $rootScope.detailsData = responseSuccess.data;
                                videoConferenceService.getManagerQuestions($scope.operationuuid).then(
                                    function (responseSuccess) {
                                        if (responseSuccess.status === 204) {
                                            allCheckedVar = true;
                                            $scope.questionNumber = 0;
                                        } else {
                                            $scope.managerQuestions = responseSuccess.data.managerquestions;
                                            var elem = $compile($scope.managerQuestions)($scope);
                                            $scope.questionNumber = ($scope.managerQuestions.match(/<input/g) || []).length;
                                            $('#managerQuestionContainer').append(elem);
                                        }
                                    },
                                    function (responseError) {
                                        $rootScope.$broadcast('callError', responseError.data.failure);
                                    }
                                );
                            },
                            function (responseError) {
                                $rootScope.$broadcast('callError', responseError.data.failure);
                            }
                        );
                    },
                    function (responseError) {
                        $rootScope.$broadcast('callError', responseError.data.failure);
                    }
                );
            },
            function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
            }
        );
    };

    // Initialize openTok session for video conference
    $scope.initializeOpenTokSession = function () {
        $scope.openTokData = videoConferenceService.getOpenTokSessionData();
        session = OT.initSession($scope.openTokData.apiKey, $scope.openTokData.sessionId);
        // Connect to our session and publish our feed
        session.connect($scope.openTokData.token, function (error) {
            publisher = OT.initPublisher("publisher",
                {
                    width: 320,
                    height: 240,
                    mirror: false,
                    resolution: '320x240',//'640x480', //'320x240',
                    frameRate: 30
                });
            session.publish(publisher);
        });
        // When a client connects, subscribe to its feed
        session.on({
            streamCreated: function (event) {
                if ($scope.actualConnections < 1) {
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
            sessionDisconnected: function (event) {
                if (angular.isDefined(subscriber))
                    session.unsubscribe(subscriber);
                if (angular.isDefined(publisher))
                    session.unpublish(publisher);
                if (angular.isDefined(session))
                    session.disconnect();
            },
            streamDestroyed: function (event) {
                if ($scope.actualConnections === 1) {
                    $scope.actualConnections--;
                    if (angular.isDefined(subscriber))
                        session.unsubscribe(subscriber);
                    if (angular.isDefined(publisher))
                        session.unpublish(publisher);
                    $scope.isBtnInitVisible = false;
                    $scope.isBtnCaptureVisible = false;
                    $scope.isBtnCaptureBackVisible = false;
                    $scope.isBtnSignalingVisible = false;
                } else
                    $scope.actualConnections--;
            },
            archiveStarted: function (event) {
                archiveID = event.id;
                console.log('Archive started ' + archiveID);
            },
            archiveStopped: function (event) {
                archiveID = event.id;
                console.log('Archive stoped ' + archiveID);
                $scope.$apply(function () {
                    $scope.isVideoRecorded = true;
                    $scope.canApprove();
                });
            },
            signal: function (event) {
                if (event.data.indexOf("mobileApp") !== -1) {
                    $rootScope.$broadcast('mobileAppVideoConference');
                } else if (event.data.indexOf('outSecondManager') !== -1) {
                    $rootScope.messageModal = 'Ya hay un gestor atendiendo esta videoconferencia o el cliente ha abandonado la identificación.';
                    $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: 'approveOrRejectVideoModal.html',
                        controller: function ($scope, $uibModalInstance, $state, tokenManager) {
                            $scope.exitModal = function () {
                                $uibModalInstance.dismiss('');
                                $state.go('dashboardfunnel', { id: tokenManager.getDomainId() });
                            }
                        },
                        windowClass: 'dialogGeneral'
                    });
                }
            }
        });

        // Singaling for text chat
        session.on('signal:chat', function (event) {
            msgHistory = document.getElementById('msgHistory');
            var msg = document.createElement('p');
            var date = $scope.getCurrentDate();
            msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
            if (msg.className === 'mine') {
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
        $scope.state = 11;
        $scope.isBtnInitVisible = true;
        $scope.isRejectValidationVisible = false;
        $scope.isMobileVideoConference = true;
        $scope.isWebConference = false;
        //$scope.isBtnSignalingVisible = true;
        //$scope.isBtnSignalingDisabled = false;
    });

    $scope.sendSignalToClient = function () {
        if ($scope.state === 11) {
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
        } else if ($scope.state === 12) {
            $scope.state = 13;
            $scope.labelBtnCapture = 'Capturar anverso';
            $scope.labelSignalingBtn = 'Siguiente';
            $scope.isBtnSignalingDisabled = true;
            session.signal({
                to: $scope.connection,
                data: $scope.connection.connectionId,
                type: 'StartingFrontDNIRecognition'
            });
        } else if ($scope.state === 13) {
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
        } else if ($scope.state === 14) {
            $scope.state = 15;
            $scope.isBtnCaptureVisible = false;
            $scope.isBtnCaptureBackVisible = false;
            $scope.isBtnSignalingDisabled = false;
            $scope.labelSignalingBtn = 'Terminar Video conferencia';

            session.signal({
                to: $scope.connection,
                data: $scope.connection.connectionId,
                type: 'EndedBackDNIRecognition'
            });

        } else if ($scope.state === 15) {
            $scope.state = 0;
            $scope.isBtnSignalingVisible = false;
            $scope.videoConferenceVisible = false;
            //Enable Approve button
            $scope.isVideoRecorded = true;
            session.signal({
                to: $scope.connection,
                data: $scope.connection.connectionId,
                type: 'EndVideoconference'
            });
        }
    }

    $scope.getCurrentDate = function () {
        var currentdate = new Date();
        var min = currentdate.getMinutes();
        var minutes = min.toString();
        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }
        var sec = currentdate.getSeconds();
        var seconds = sec.toString();
        if (seconds.length === 1) {
            seconds = '0' + seconds;
        }
        return currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " - "
            + currentdate.getHours() + ":"
            + minutes + ":"
            + seconds;
    }

    $scope.text = {};
    $scope.sendMessage = function (text) {
        var tempScrollTop = $(window).scrollTop();
        session.signal({
            type: 'chat',
            data: text
        },
            function (error) {
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
    var imageData;

    /**
     * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
     */
    $scope.captureImageFromVideo = function () {
        $scope.isBtnSignalingVisible = true;
        $scope.isBtnSignalingDisabled = false;
        if ($scope.labelBtnCapture.indexOf('Capturar anverso') !== -1 && $scope.isWebConference) {
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
        image.onload = function () {
            var imgw = image.width;
            var imgh = image.height;
            canvas.height = canvas.width * imgh / imgw;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        image.src = 'data:image/png;base64,' + b64Image;
        $scope.operationuuid = videoConferenceService.getOperationUuid();
        var data = new FormData();
        data.append('operationuuid', $scope.operationuuid);
        if ($scope.labelBtnCapture.indexOf('Capturar cara') !== -1) {
            data.append('face', b64Image);
        } else if ($scope.labelBtnCapture.indexOf('Capturar anverso') !== -1) {
            data.append('dnifront', b64Image);
        } else {
            data.append('imageData', b64Image);
        }

        $.ajax({
            url: $rootScope.url + 'services/videos/uploadidentificationimages',
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                console.log('Las imágenes capturadas se han subido correctamente');
            },
            error: function (data) {
                console.log('Ha ocurrido un error al subir las imágenes capturadas');
            }
        });
    };

    $scope.captureDniBack = function () {
        var b64Image = subscriber.getImgData();

        var output = document.getElementById('output');
        var canvas = document.createElement('canvas');
        canvas.height = 320;
        canvas.width = 480;
        output.appendChild(canvas);
        var context = canvas.getContext('2d');
        var image = new Image();
        image.onload = function () {
            var imgw = image.width;
            var imgh = image.height;
            canvas.height = canvas.width * imgh / imgw;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        image.src = 'data:image/png;base64,' + b64Image;

        $scope.operationuuid = videoConferenceService.getOperationUuid();
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
                videoConferenceService.obtainVideoDetails($scope.operationuuid).then(
                    function (responseSuccess) {
                        cfpLoadingBar.complete();
                        $rootScope.detailsData = responseSuccess.data;
                        $rootScope.operationuuid = $scope.detailsData.operationuuid;
                        $scope.isBtnSignalingVisible = true;
                    },
                    function (responseError) {
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

    var allCheckedVar = false;

    $rootScope.allChecked = function (value) {
        var keepGoing = true;
        angular.forEach($rootScope.checkedValues, function (value) {
            if (keepGoing) {
                if (value === true) {
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

    $scope.canApprove = function () {
        if (allCheckedVar && $scope.isVideoRecorded && $rootScope.questionNumber === Object.keys($rootScope.checkedValues).length) { // && moment($rootScope.detailsData.customer.icarExpirationDate, 'DD-MM-YYYY', true).isValid()
            $scope.isApproveValidationVisible = false;
            // $scope.isRejectValidationVisible = true;
        } else {
            $scope.isApproveValidationVisible = true;
        }
    }

    $scope.approveVideoConference = function () {
        if (angular.isDefined(subscriber))
            session.unsubscribe(subscriber);
        if (angular.isDefined(publisher))
            session.unpublish(publisher);
        $scope.operationuuid = videoConferenceService.getOperationUuid();
        videoConferenceService.approveVideoConference($scope.operationuuid).then(
            function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'La vídeo conferencia ha sido aprobada correctamente');
                $scope.isApproveOrRejectVideoConference = false;
                // Signaling event
                $scope.videoConferenceVisible = false;
                session.signal({
                    to: $scope.connection,
                    data: $scope.connection.connectionId,
                    type: 'EndedProcessCorrectly'
                });
                if (angular.isDefined(session))
                    session.disconnect();
                $scope.isApproveValidationVisible = true;
                $scope.isRejectValidationVisible = true;
                $scope.isBtnInitVisible = false;
                $scope.isBtnCaptureVisible = false;
                $scope.isBtnCaptureBackVisible = false;
                $scope.isBtnSignalingVisible = false;
                $rootScope.messageModal = 'La vídeo conferencia ha sido aprobada correctamente';
                $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'approveOrRejectVideoModal.html',
                    controller: function ($scope, $uibModalInstance, $state, tokenManager) {
                        $scope.exitModal = function () {
                            $uibModalInstance.dismiss('');
                            $state.go('dashboardfunnel', { id: tokenManager.getDomainId() });
                        }
                    },
                    windowClass: 'dialogGeneral'
                });
            },
            function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
                $rootScope.messageModal = "Ha ocurrido un error al aprobar la vídeo conferencia seleccionada. Vuelva a intentarlo.";
                $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'approveOrRejectVideoModal.html',
                    controller: function ($scope, $uibModalInstance, $state, tokenManager) {
                        $scope.exitModal = function () {
                            $uibModalInstance.dismiss('');
                            $state.go('dashboardfunnel', { id: tokenManager.getDomainId() });
                        }
                    },
                    windowClass: 'dialogGeneral'
                });
            });
    };

    $scope.rejectVideoConference = function () {
        session.signal({
            to: $scope.connection,
            data: $scope.connection.connectionId,
            type: 'EndedBackDNIRecognition'
        });
        if (angular.isDefined(subscriber))
            session.unsubscribe(subscriber);
        if (angular.isDefined(publisher))
            session.unpublish(publisher);
        $scope.operationuuid = videoConferenceService.getOperationUuid();
        videoConferenceService.rejectVideoConference($scope.operationuuid).then(
            function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'La vídeo conferencia ha sido rechazada correctamente.');
                $scope.isApproveOrRejectVideoConference = false;
                // Signaling event.
                $scope.videoConferenceVisible = false;
                session.signal({
                    to: $scope.connection,
                    data: $scope.connection.connectionId,
                    type: 'EndedProcessWrongly'
                });
                if (angular.isDefined(session))
                    session.disconnect();
                $scope.isApproveValidationVisible = true;
                $scope.isRejectValidationVisible = true;
                $scope.isBtnInitVisible = false;
                $scope.isBtnCaptureVisible = false;
                $scope.isBtnCaptureBackVisible = false;
                $scope.isBtnSignalingVisible = false;
                $rootScope.messageModal = 'La vídeo conferencia ha sido rechazada correctamente.';
                $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'approveOrRejectVideoModal.html',
                    controller: function ($scope, $uibModalInstance, $state, tokenManager) {
                        $scope.exitModal = function () {
                            $uibModalInstance.dismiss('');
                            $state.go('dashboardfunnel', { id: tokenManager.getDomainId() })
                        }
                    },
                    windowClass: 'dialogGeneral'
                });
            },
            function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
                $rootScope.messageModal = "Ha ocurrido un error al rechazar la vídeo conferencia seleccionada. Vuelva a intentarlo.";
                $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'approveOrRejectVideoModal.html',
                    controller: function ($scope, $uibModalInstance, $state, tokenManager) {
                        $scope.exitModal = function () {
                            $uibModalInstance.dismiss('');
                            $state.go('dashboardfunnel', { id: tokenManager.getDomainId() })
                        }
                    },
                    windowClass: 'dialogGeneral'
                });
            });
    };

    $scope.goToVideoConferenceTable = function () {
        if (angular.isDefined(subscriber))
            session.unsubscribe(subscriber);
        if (angular.isDefined(publisher))
            session.unpublish(publisher);
        if (angular.isDefined(session))
            session.disconnect();
        $rootScope.attendingVideoconference = false;
        $state.go('videoConferenceTable');
    }

    $scope.obtainVerifyImages = function (images) {
        $scope.capturedImages = [], $rootScope.verifiedImages = [];
        $scope.flag = true;
        angular.forEach(images, function (image, index) {
            videoConferenceService.obtainVerifiedImage(image).then(
                function (responseSuccess) {
                    // btoa(String.fromCharCode.apply(null, new Uint8Array(responseSuccess.data)));
                    // console.log(img.src);
                    $scope.capturedImages[index] = 'data:image/jpg;base64,' + responseSuccess.data;
                    var img = new Image();
                    img.src = $scope.capturedImages[1];
                    img.onload = function () {
                        if (img.height > img.width) {
                            $rootScope.imagePrevWidth = 180;
                        } else {
                            $rootScope.imagePrevWidth = 320;
                        }
                        $rootScope.isVerficatedImagesVisible = true;
                        $timeout(function () {
                            $scope.getImageWidthHeight('', 1, $scope.capturedImages);
                        }, 500);
                    }
                    if ($scope.capturedImages.length === images.length) {
                        $rootScope.verifiedImages = $scope.capturedImages;
                        if (angular.isDefined($rootScope.verifiedImages[0]) && angular.isDefined($rootScope.verifiedImages[1])) {
                            if ($scope.flag) {
                                $scope.flag = false;
                                var faceImage = base64ToArrayBuffer($rootScope.verifiedImages[0].replace(/^data:image\/(png|jpg);base64,/, ''));
                                var frontImage = base64ToArrayBuffer($rootScope.verifiedImages[1].replace(/^data:image\/(png|jpg);base64,/, ''));
                                obtainFaceId(true, faceImage);
                                obtainFaceId(false, frontImage);
                            }
                        }
                    }
                },
                function (responseError) {
                    $rootScope.$broadcast('callError', responseError.data.failure);
                }
            );
        });
    }

    function obtainFaceId(isFirst, imgData) {
        var imageId1;
        var params = {
            // Request parameters
            "returnFaceId": "true",
            "returnFaceLandmarks": "true"
        };

        $.ajax({
            url: CognitiveServices.detectURL + $.param(params),
            processData: false,
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", CognitiveServices.key);
            },
            type: "POST",
            // Request body
            data: imgData,
        })
            .done(function (data) {

                if (isFirst) {
                    images.faceId1 = data[0].faceId;
                    coordinates.face = data[0].faceRectangle;
                    landMarks.face = data[0].faceLandmarks;
                } else {
                    images.faceId2 = data[0].faceId;
                    coordinates.front = data[0].faceRectangle;
                    landMarks.front = data[0].faceLandmarks;
                }
                var keys = Object.keys(images);
                if (keys.length === 2) {
                    var imgVerify = JSON.stringify(images);
                    drawRectanglesOverFaces();
                    obtainVerifyFaces(imgVerify);
                }
            })
            .fail(function (data) {
                // alert("error");
            });
    }

    function obtainVerifyFaces(imagesToVerify) {
        var params = {
            // Request parameters
        };

        $.ajax({
            url: CognitiveServices.verifyURL + $.param(params),
            // crossDomain: true,
            // dataType: 'jsonp',
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", CognitiveServices.key);
            },
            type: "POST",
            // Request body
            data: imagesToVerify,
        })
            .done(function (data) {
                if (data.confidence >= 0.35) {
                    if (data.confidence < 0.5) {
                        data.confidence = data.confidence + 0.25;
                    }
                    $scope.confidenceValue = $scope.formatFaceConfidence(data.confidence);
                }
                var value = $scope.confidenceValue + '%';
                $rootScope.$apply(function () {
                    $rootScope.verificationLevel.value = value;
                });
                if (value.split('%')[0] >= 50) {
                    $rootScope.confidence = true;
                } else {
                    $rootScope.confidence = false;
                }
            })
            .fail(function (data) {
                // alert("error");
            });
    }

    $scope.formatFaceConfidence = function (confidence) {
        confidence = confidence * 100;
        if (confidence.toString().length > 5) {
            confidence = confidence.toString().substring(0, 5);
        }
        if (confidence > 100) {
            confidence = 100;
        }
        return confidence;
    }

    function obtainVerifiedImage(imageId) {
        return $http.get('services/videos/getverificationimageb64/' + imageId);
    }
    function drawRectanglesOverFaces() {
        var canvasFace = document.getElementById('canvasImgCapturadas0');
        var contextFace = canvasFace.getContext('2d');
        var canvasFront = document.getElementById('canvasImgCapturadas1');
        var contextFront = canvasFront.getContext('2d');
        var imageFace = document.getElementById('imagenesCapturadas0');
        var imageFront = document.getElementById('imagenesCapturadas1');
        canvasFace.width = imageFace.clientWidth;
        canvasFace.height = imageFace.clientHeight;
        canvasFront.width = imageFront.clientWidth;
        canvasFront.height = imageFront.clientHeight;
        contextFace.strokeStyle = '#6DE6BA';
        contextFront.strokeStyle = '#6DE6BA';
        contextFace.rect((coordinates.face.left * imageFace.clientWidth) / imageFace.naturalWidth, (coordinates.face.top * imageFace.clientHeight) / imageFace.naturalHeight, (coordinates.face.width * imageFace.clientWidth) / imageFace.naturalWidth, ((coordinates.face.height * imageFace.clientHeight) / imageFace.naturalHeight));
        contextFace.rect((landMarks.face.pupilLeft.x * imageFace.clientWidth) / imageFace.naturalWidth, (landMarks.face.pupilLeft.y * imageFace.clientHeight) / imageFace.naturalHeight, 1, 1);
        contextFace.rect((landMarks.face.pupilRight.x * imageFace.clientWidth) / imageFace.naturalWidth, (landMarks.face.pupilRight.y * imageFace.clientHeight) / imageFace.naturalHeight, 1, 1);
        contextFace.rect((landMarks.face.noseTip.x * imageFace.clientWidth) / imageFace.naturalWidth, (landMarks.face.noseTip.y * imageFace.clientHeight) / imageFace.naturalHeight, 1, 1);
        contextFace.rect((landMarks.face.mouthLeft.x * imageFace.clientWidth) / imageFace.naturalWidth, (landMarks.face.mouthLeft.y * imageFace.clientHeight) / imageFace.naturalHeight, 1, 1);
        contextFace.rect((landMarks.face.mouthRight.x * imageFace.clientWidth) / imageFace.naturalWidth, (landMarks.face.mouthRight.y * imageFace.clientHeight) / imageFace.naturalHeight, 1, 1);
        contextFace.stroke(); // crop 1280x720 es (720x450)  // crop 640x480 es (512x323)
        contextFront.rect((coordinates.front.left * imageFront.clientWidth) / imageFront.naturalWidth, (coordinates.front.top * imageFront.clientHeight) / imageFront.naturalHeight, (coordinates.front.width * imageFront.clientWidth) / imageFront.naturalWidth, ((coordinates.front.height * imageFront.clientHeight) / imageFront.naturalHeight));
        contextFront.rect((landMarks.front.pupilLeft.x * imageFront.clientWidth) / imageFront.naturalWidth, (landMarks.front.pupilLeft.y * imageFront.clientHeight) / imageFront.naturalHeight, 1, 1);
        contextFront.rect((landMarks.front.pupilRight.x * imageFront.clientWidth) / imageFront.naturalWidth, (landMarks.front.pupilRight.y * imageFront.clientHeight) / imageFront.naturalHeight, 1, 1);
        contextFront.rect((landMarks.front.noseTip.x * imageFront.clientWidth) / imageFront.naturalWidth, (landMarks.front.noseTip.y * imageFront.clientHeight) / imageFront.naturalHeight, 1, 1);
        contextFront.rect((landMarks.front.mouthLeft.x * imageFront.clientWidth) / imageFront.naturalWidth, (landMarks.front.mouthLeft.y * imageFront.clientHeight) / imageFront.naturalHeight, 1, 1);
        contextFront.rect((landMarks.front.mouthRight.x * imageFront.clientWidth) / imageFront.naturalWidth, (landMarks.front.mouthRight.y * imageFront.clientHeight) / imageFront.naturalHeight, 1, 1);
        contextFront.stroke();
    }

    function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    $scope.initializePlayer = function () {
        $(document).ready(function () {
            $("#jquery_jplayer_1").jPlayer({
                ready: function () {
                    $(this).find("video")[0].setAttribute("crossOrigin", "anonymous");
                    $(this).jPlayer("setMedia", {
                        // title: "Big Buck Bunny",
                        m4v: urlVideoPlayer
                    });
                },
                swfPath: "../dist/jplayer",
                supplied: "m4v",
                size: {
                    width: "640px",
                    height: "360px",
                    cssClass: "jp-video-360p"
                },
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                // keyEnabled: true,
                remainingDuration: true,
                toggleDuration: true,
                captureDuratinon: true,
                ended: function () {
                    nextVideo();
                    //   $(this).jPlayer("setMedia", {
                    //     // title: "Big Buck Bunny",
                    //     m4v: nextVideo()
                    //   }).jPlayer("play");
                }
            });
        });
    }

    $('div.jp-seek-bar').click(function (e) {
        updatebar(e.pageX);
    });

    function updatebar(x) {
        var progress = $('.jp-progress');

        var maxduration = $("#jquery_jplayer_1").data("jPlayer").status.duration;
        // var maxduration = $("#jquery_jplayer_1").jPlayer.duration; //audio duration
        console.log(maxduration);
        var position = x - progress.offset().left; //Click pos
        var percentage = 100 * position / progress.width();

        //Check within range
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }

        $("#jquery_jplayer_1").jPlayer("playHead", percentage);

        //Update progress bar and video currenttime
        $('.jp-play-bar').css('width', percentage + '%');
        $("#jquery_jplayer_1").jPlayer.currentTime = maxduration * percentage / 100;
    }

    $scope.playNextVideo = function () {
        nextVideo();
    }

    function nextVideo() {
        if (videoList.length > videoCount) {
            urlVideoPlayer = "services/videos/getunvideo/" + videoList[videoCount] + "?ddd=" + tokenManager.getDomainId();
            $('#jquery_jplayer_1').jPlayer("setMedia", {
                // title: "Big Buck Bunny",
                m4v: urlVideoPlayer,
            }).jPlayer("play");
            videoCount++;
            // return urlVideoPlayer;
        } else {
            videoCount = 1;
            // urlVideoPlayer = "";
            restartVideoUrls();
        }
    }

    $scope.getVideoSignature = function () {
        videoConferenceService.getVideoSignature(videoList[0]).then(
            function (responseSuccess) {
                var xml = responseSuccess.data;
                alert(xml);

            },
            function (responseError) {
                alert();

            });
    }

    function restartVideoUrls() {
        videoCount = 1;
        urlVideoPlayer = "services/videos/getunvideo/" + videoList[0] + "?ddd=" + tokenManager.getDomainId();
        $("#jquery_jplayer_1").jPlayer("destroy");
        $scope.initializePlayer();
    }

    $scope.$on("$destroy", function () {
        $rootScope.attendingVideoconference = false;
    })

    var isFirst = true;
    $scope.getImageWidthHeight = function (image, index, capturedImages) {
        var image = document.getElementById('copiaImagenes' + index);
        var capturedImage = document.getElementById('imagenesCapturadas' + index);
        if (image != null) {
            if (image.naturalWidth > image.naturalHeight) {
                if (image.naturalWidth === 1280) {
                    $scope.imageW = image.naturalWidth;
                    $scope.imageH = image.naturalHeight / 2.25;
                    $scope.value = capturedImage.clientHeight;
                } else if (image.width === 640) {
                    $scope.imageW = image.naturalWidth;
                    $scope.imageH = image.naturalHeight;
                    $scope.value = capturedImage.clientHeight;
                } else if (image.width === 512) {
                    $scope.imageW = image.naturalWidth;
                    $scope.imageH = image.naturalHeight;
                    $scope.value = capturedImage.clientHeight;
                }
            } else {
                $scope.imageW = image.naturalWidth;
                $scope.imageH = image.naturalHeight / 1.6; // 1.6 es el aspect ratio
                $scope.value = capturedImage.clientHeight;
            }
            var imgs = capturedImages.length;
            var rows = Math.ceil(imgs / 3);
            if (isFirst) {
                if (rows > 1) {
                    var value = 0;
                    var zIndexValue = 100;
                    for (var i = 0; i < capturedImages.length; i++) {
                        var image = document.getElementById('imagenesCapturadas' + i);
                        if (i >= 3) {
                            if (i % 3 === 0) {
                                zIndexValue = zIndexValue - 10;
                                ++value;
                            }
                            var factor = Math.floor(capturedImages.length / i);
                            $('#imagenesCapturadas' + i).css('padding-top', (image.clientHeight * value) + (20 * value));
                            $('#canvasImgCapturadas' + i).css('width', image.clientWidth);
                            $('#canvasImgCapturadas' + i).css('height', image.clientHeight);
                            $('#canvasImgCapturadas' + i).css('z-index', zIndexValue);
                        } else {
                            $('#canvasImgCapturadas' + i).css('width', image.clientWidth);
                            $('#canvasImgCapturadas' + i).css('height', image.clientHeight);
                            $('#canvasImgCapturadas' + i).css('z-index', zIndexValue);
                        }

                    }
                }
                $('#formUserDataCapture').css('padding-top', ($scope.value * rows) + (20 * rows));
                isFirst = false;
            }
        }
    }

    $scope.getWidthHeight = function (image, index) {
        var image = document.getElementById('copiaImagenes' + index);
        $scope.imageW = image.naturalWidth;
        $scope.imageH = image.naturalHeight;
    }
}
