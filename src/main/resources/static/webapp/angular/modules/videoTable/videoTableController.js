'use strict';

var videoList, videoCount = 1, videoPlayer, urlVideoPlayer;
angular.module('O2DigitalSite').controller('checkVideo', ['$rootScope', '$scope', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$compile', 'videoService', '$state', '$uibModal',
  'tokenManager', '$http', '$filter', 'sweet', 'videoConferenceService', '$timeout', 'CognitiveServices',
  function($rootScope, $scope, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $compile, videoService, $state, $uibModal, tokenManager, $http, $filter, sweet, videoConferenceService, $timeout, CognitiveServices) {

    $rootScope.$broadcast('rootChange', 'Vídeo / Video Table');
    $scope.dtInstanceVideo = {};
    $scope.videosList = [];
    $scope.operationuuid;
    $scope.isLoaded = false;
    $scope.fromdatepicker = {
      opened : false
    };
    $scope.todatepicker = {
      opened : false
    };

    // object to send to congnitive services
    var images = {}, coordinates = {}, landMarks = {};
    $rootScope.verificationLevel = {}

    if(angular.isDefined(sessionStorage.filterVideo)) {
      $scope.filter = JSON.parse(sessionStorage.filterVideo);
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


    $scope.loadVideoTable = function() {
      $scope.dtOptionsVideo = DTOptionsBuilder.newOptions()
                                              .withOption('stateSave', true)
                                              .withOption('stateDuration', -1)
                                              .withOption('stateSaveCallback', function(settings, data) {
                                                sessionStorage.setItem( 'DataTables_VideosList', JSON.stringify(data) )
                                              })
                                              .withOption('stateLoadCallback', function(settings, data) {
                                                return JSON.parse( sessionStorage.getItem( 'DataTables_VideosList' ) )
                                              })
                                              .withOption('order', [[ 1, "desc" ]])
                                              .withOption('columnDefs', [{'targets':[4], sortable:false}])
                                              .withPaginationType('simple_numbers');

      $scope.dtColumnsVideo = [

          DTColumnDefBuilder.newColumnDef(0),
          DTColumnDefBuilder.newColumnDef(1),
          DTColumnDefBuilder.newColumnDef(2),
          DTColumnDefBuilder.newColumnDef(3),
          DTColumnDefBuilder.newColumnDef(4).notSortable()

      ];

      $scope.filterVideoTable($scope.filter);

    };

    $scope.showVideo = function(data) {
    	  $rootScope.operationuuid = data.operationuuid;
    	  $scope.operationuuid = data.operationuuid;
        videoService.obtainVideoDetails(data.operationuuid).then(
          function(responseSuccess) {
            $rootScope.detailsData = responseSuccess.data;
      	  	$rootScope.operationuuid = $scope.detailsData.operationuuid;

            videoService.getAllVideos($scope.detailsData.operationuuid).then(
              function(responseSuccess) {
                videoList = responseSuccess.data;
                urlVideoPlayer = "services/videos/getunvideo/" + videoList[0]+ "?ddd=" + tokenManager.getDomainId();
                $rootScope.$broadcast('callSuccess', 'Nos dirigimos a la visualización del video');
                $state.go('checkVideo');
                $timeout(function() {
                    $scope.obtainVerifyImages($rootScope.detailsData.customer.verificationImages);
                }, 1000);
              },
              function(responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
              });
          },
          function(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure);
          });
      };

      $scope.viewVideo = function(data) {
    	  $rootScope.operationuuid = data.operationuuid;
    	  $scope.operationuuid = data.operationuuid;
        videoService.obtainVideoDetails(data.operationuuid).then(
          function(responseSuccess) {
            $rootScope.detailsData = responseSuccess.data;
      	  	$rootScope.operationuuid = $scope.detailsData.operationuuid;

            videoService.getAllVideos($scope.detailsData.operationuuid).then(
              function(responseSuccess) {
                videoList = responseSuccess.data;
                urlVideoPlayer = "services/videos/getunvideo/" + videoList[0] + "?ddd=" + tokenManager.getDomainId();
                $rootScope.urlacta = "services/videos/getactavideo/" + $scope.detailsData.operationuuid;
                $rootScope.$broadcast('callSuccess', 'Nos dirigimos a la visualización del video');
                $state.go('viewVideo');
                $timeout(function() {
                    $scope.obtainVerifyImages($rootScope.detailsData.customer.verificationImages);
                }, 1000);
              },
              function(responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
              });
          },
          function(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure);
          });
      };

      $scope.obtainVerifyImages = function(images) {
          $scope.capturedImages = [], $rootScope.verifiedImages = [];
          $scope.flag = true;
          angular.forEach(images, function(image, index) {
              videoService.obtainVerifiedImage(image).then(
                  function(responseSuccess) {
                      // btoa(String.fromCharCode.apply(null, new Uint8Array(responseSuccess.data)));
                      // console.log(img.src);
                      $scope.capturedImages[index] = 'data:image/jpg;base64,' + responseSuccess.data;
                      var img = new Image();
                      img.src = $scope.capturedImages[1];
                      img.onload = function () {
                          if(img.height > img.width) {
                              $rootScope.imagePrevWidth = 180;
                          } else {
                              $rootScope.imagePrevWidth = 320;
                          }
                          $rootScope.isVerficatedImagesVisible = true;
                          $timeout(function () {
                              $scope.getImageWidthHeight('', 1, $scope.capturedImages);
                          }, 500);
                      }
                      if($scope.capturedImages.length === images.length) {
                          $rootScope.verifiedImages = $scope.capturedImages;
                          if(angular.isDefined($rootScope.verifiedImages[0]) && angular.isDefined($rootScope.verifiedImages[1])) {
                              if($scope.flag) {
                                $scope.flag = false;
                                var faceImage = base64ToArrayBuffer($rootScope.verifiedImages[0].replace(/^data:image\/(png|jpg);base64,/, ''));
                                var frontImage = base64ToArrayBuffer($rootScope.verifiedImages[1].replace(/^data:image\/(png|jpg);base64,/, ''));
                                obtainFaceId(true, faceImage);
                                obtainFaceId(false, frontImage);
                              }
                          }
                      }
                  },
                  function(responseError) {
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
              beforeSend: function(xhrObj){
                  // Request headers
                  xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                  xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", CognitiveServices.key);
              },
              type: "POST",
              // Request body
              data: imgData,
          })
          .done(function(data) {

              if(isFirst) {
                  images.faceId1 = data[0].faceId;
                  coordinates.face = data[0].faceRectangle;
                  landMarks.face = data[0].faceLandmarks;
              } else {
                  images.faceId2 = data[0].faceId;
                  coordinates.front = data[0].faceRectangle;
                  landMarks.front = data[0].faceLandmarks;
              }
              var keys = Object.keys(images);
              if(keys.length === 2) {
                  var imgVerify = JSON.stringify(images);
                  drawRectanglesOverFaces();
                  obtainVerifyFaces(imgVerify);
              }
          })
          .fail(function(data) {
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
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", CognitiveServices.key);
            },
            type: "POST",
            // Request body
            data: imagesToVerify,
        })
        .done(function(data) {
            if(data.confidence >= 0.35) {
                if(data.confidence < 0.5) {
                    data.confidence = data.confidence + 0.25;
                }
                $scope.confidenceValue = $scope.formatFaceConfidence(data.confidence);
            }
            var value = $scope.confidenceValue + '%';
            $rootScope.$apply(function() {
                $rootScope.verificationLevel.value = value;
            });
            if(value.split('%')[0] >= 50) {
                $rootScope.confidence = true;
            } else {
                $rootScope.confidence = false;
            }
        })
        .fail(function(data) {
            // alert("error");
        });
    }

    $scope.formatFaceConfidence = function (confidence) {
        confidence = confidence * 100;
        if(confidence.toString().length > 5) {
            confidence = confidence.toString().substring(0, 5);
        }
        if(confidence > 100) {
            confidence = 100;
        }
        return confidence;
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
        var binary_string =  window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array( len );
        for (var i = 0; i < len; i++)        {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    $scope.initializePlayer = function() {
          $(document).ready(function(){
             $("#jquery_jplayer_1").jPlayer({
                ready: function() {
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
                keyEnabled: true,
                remainingDuration: true,
                toggleDuration: true,
                ended: function() {
                  $(this).jPlayer("setMedia", {
                    // title: "Big Buck Bunny",
                    m4v: nextVideo()
                  }).jPlayer("play");
                }
            });
      });
    };

    function nextVideo() {
      if(videoList.length > videoCount) {
        urlVideoPlayer = "services/videos/getunvideo/" + videoList[videoCount] + "?ddd=" + tokenManager.getDomainId();
        videoCount++;
        return urlVideoPlayer;
      } else {
        videoCount = 1;
        urlVideoPlayer = "";
        restartVideoUrls();
      }
    }

    function restartVideoUrls() {
        urlVideoPlayer = "services/videos/getunvideo/" + videoList[0] + "?ddd=" + tokenManager.getDomainId();
        $("#jquery_jplayer_1").jPlayer("destroy");
        $scope.initializePlayer();
    }

      //
      // $scope.runNextVideo = function() {
      //   if(videoList.length > 1) {
      //     videoPlayer = document.getElementById('video');
      //     if(videoList.length == videoCount) {
      //       videoCount = 0;
      //       videoPlayer.src = "/HAGCLI_VIDEOID/esignservices/opentok/getunvideo/" + videoList[videoCount];
      //       // videoPlayer.load();
      //     } else {
      //       videoPlayer.src = "/HAGCLI_VIDEOID/esignservices/opentok/getunvideo/" + videoList[videoCount];
      //       videoPlayer.load();
      //       videoPlayer.play();
      //       videoCount++;
      //     }
      //   }
      // }

      //Filter Button
    $scope.filterVideoTable = function(filterData) {
      var fromFormattedData = 'undefined';
      var toFormattedData = 'undefined';


      if (angular.isDefined(filterData)) {

        if (angular.isDefined(filterData.from)){
          fromFormattedData = moment(filterData.from).format('YYYY-MM-DD');
        }
        if (angular.isDefined(filterData.to)){
          toFormattedData = moment(filterData.to).format('YYYY-MM-DD');
        }
        filterData.fromFormatted = fromFormattedData;
        filterData.toFormatted = toFormattedData;

        if(fromFormattedData !== 'undefined' && toFormattedData !== 'undefined' && fromFormattedData > toFormattedData){

          sweet.show({
            title: '',
            confirmButtonColor: '#F27474',
            text: 'La fecha final debe ser igual o posterior a la inicial.',
            confirmButtonText: 'Cerrar',
            type: 'warning'
          });

        } else
          $scope.getFilteredVideoList(filterData);
      }
    };

    $scope.clearFilterAndReloadVideoTable = function(filterData) {
      if(angular.isUndefined(filterData)) filterData = {};
      filterData.from          = undefined;
      filterData.fromFormatted = undefined;
      filterData.toFormatted   = undefined;
      filterData.to            = undefined;
      filterData.operationid   = undefined;
      filterData.state         = undefined;

      $scope.getFilteredVideoList(filterData);
    };

    $scope.getFilteredVideoList = function(filterData) {
      $http.get('services/videos/getvideos/' + tokenManager.getDomainId() + '/' + tokenManager.getUserIdFromToken() + '/filtered/' + filterData.fromFormatted + '/' + filterData.toFormatted +'/' + filterData.operationid +
          '/' + filterData.state).then(
        function(responseSuccess) {
          $scope.videosList = responseSuccess.data;
        	$rootScope.$broadcast('callSuccess', 'La lista de vídeos ha sido cargada correctamente.');
          sessionStorage.setItem('filterVideo', JSON.stringify(filterData));
          $scope.videosList = responseSuccess.data;
          $scope.isLoaded = true;
        },
        function(responseError) {
          $rootScope.$broadcast('callError', responseError.data.failure);
        });
    };

    // Go to video conference.
    $scope.goToVideoConference = function(conference) {
        // $rootScope.operationuuid = data.operationuuid;
        $scope.operationuuid = conference.operationuuid;
        videoConferenceService.setOperationUuid($scope.operationuuid);
        videoConferenceService.obtainConferenceData(conference.operationuuid).then(
            function(responseSuccess) {
                // $scope.openTokData = { apiKey: "45484922",//responseSuccess.data.apiKey,
                //     sessionId: "2_MX40NTQ4NDkyMn5-MTQ3MTM0MjM4MzIyNH5wMjEwbG5KNG53ei9yRkZzalNxQlljNi9-fg",//responseSuccess.data.sessionId,
                //     token: "T1==cGFydG5lcl9pZD00NTQ4NDkyMiZzaWc9NzY3N2ZjZDRkNzZkNmIwMDczNDhiZGQ4M2Q3YjViOTdmMDhkOTQyNjpzZXNzaW9uX2lkPTJfTVg0ME5UUTRORGt5TW41LU1UUTNNVE0wTWpNNE16SXlOSDV3TWpFd2JHNUtORzUzZWk5eVJrWnphbE54UWxsak5pOS1mZyZjcmVhdGVfdGltZT0xNDcxMzQyMzg2Jm5vbmNlPS0xOTkzNzE1MDcxJnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE0NzE5NDcxODYmY29ubmVjdGlvbl9kYXRhPW5hbWUlM0RDbGllbnRl"//responseSuccess.data.token
                // };
                $scope.openTokData = { apiKey: responseSuccess.data.apiKey,
                    sessionId: responseSuccess.data.sessionId,
                    token: responseSuccess.data.token
                };
                videoConferenceService.setOpenTokSessionData($scope.openTokData);
                $state.go('videoConference');
                $rootScope.$broadcast('callSuccess', 'Nos dirigimos a la video conferencia');
            },
            function(responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure);
            }
        );
    };

    $scope.openFromDatePicker = function() {
      $scope.fromdatepicker.opened = true;
    }

    $scope.openToDatePicker = function() {
      $scope.todatepicker.opened = true;
    }

    // Empieza la parte de revision del video

    var scaleFactor = 0.8;
    var snapshots = [];
    var imageData;

    /**
     * Captures a image frame from the provided video element.
     *
     * @param {Video} video HTML5 video element from where the image frame will be captured.
     * @param {Number} scaleFactor Factor to scale the canvas element that will be return. This is an optional parameter.
     *
     * @return {Canvas}
     */
    function capture(video, scaleFactor) {
        if(scaleFactor == null){
            scaleFactor = 1;
        }
        var w = video.videoWidth * scaleFactor;
        var h = video.videoHeight * scaleFactor;
        var canvas = document.createElement('canvas');
            canvas.width  = w;
            canvas.height = h;
        var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);

        return canvas;
    }

    /**
     * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
     */
    $scope.shoot = function() {
        var video = $("#jp_container_1").find("video")[0];
        var output = document.getElementById('output');
        var canvas = capture(video, scaleFactor);
        $.jPlayer.pause();
        imageData = canvas.toDataURL();
        imageData = imageData.substring(imageData.indexOf(",") + 1, imageData.length);
        var data = new FormData();
        data.append("operationId", $rootScope.operationuuid);
        data.append("imageData", imageData);

        $.ajax({
          url:  'services/videos/uploadimage',
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
        canvas.onclick = function(){
            window.open(this.toDataURL());
        };
        snapshots.unshift(canvas);
        output.innerHTML = '';
        for(var i = 0; i < 100; i++){
            output.appendChild(snapshots[i]);
        }
    };

    $scope.approveValidation = function() {
      videoService.approveValidation($scope.operationuuid).then(
        function(responseSuccess) {
          $rootScope.$broadcast('callSuccess', 'EL vídeo se ha aprovado correctamente.');
          //$state.go('pendientesdevalidacion');
          $scope.isApproveValidationVisible = true;
          $scope.isRejectValidationVisible = true;
          $rootScope.messageModal = "El vídeo seleccionado ha sido aprobado correctamente";
          $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'approveOrRejectVideoModal.html',
            controller: function($scope, $uibModalInstance) {
              $scope.exitModal = function () {
                $uibModalInstance.dismiss('');
              }
            },
            windowClass: 'dialogGeneral'
          });
        },
        function(responseError) {
          $rootScope.$broadcast('callError', responseError.data.failure);
          $rootScope.messageModal = "Ha ocurrido un error al aprobar el vídeo seleccionado. Vuelva a intentarlo.";
          $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'approveOrRejectVideoModal.html',
            controller: function($scope, $uibModalInstance) {
              $scope.exitModal = function () {
                $uibModalInstance.dismiss('');
              }
            },
            windowClass: 'dialogGeneral'
          });
        });
    };

    $scope.rejectValidation = function() {
      videoService.rejectValidation($scope.operationuuid).then(
        function(responseSuccess) {
          $rootScope.$broadcast('callSuccess', 'El vídeo se ha rechazado correctamente.');
          //$state.go('pendientesdevalidacion');
          $scope.isApproveValidationVisible = true;
          $scope.isRejectValidationVisible = true;
          $rootScope.messageModal = "El vídeo seleccionado ha sido rechazado correctamente";
          $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'approveOrRejectVideoModal.html',
            controller: function($scope, $uibModalInstance) {
              $scope.exitModal = function () {
                $uibModalInstance.dismiss('');
              }
            },
            windowClass: 'dialogGeneral'
          });
        },
        function(responseError) {
          $rootScope.$broadcast('callError', responseError.data.failure);
          $rootScope.messageModal = "Ha ocurrido un error al rechazar el vídeo seleccionado. Vuelva a intentarlo.";
          $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'approveOrRejectVideoModal.html',
            controller: function($scope, $uibModalInstance) {
              $scope.exitModal = function () {
                $uibModalInstance.dismiss('');
              }
            },
            windowClass: 'dialogGeneral'
          });
        });
    };

    $scope.goToTableVideo = function () {
      $state.go('videoTable');
    }

    var isFirst = true;
    $scope.getImageWidthHeight = function(image, index, capturedImages) {
       var image = document.getElementById('copiaImagenes' + index);
       var capturedImage = document.getElementById('imagenesCapturadas' + index);
       if(image != null) {
          if(image.naturalWidth > image.naturalHeight) {
              if(image.naturalWidth === 1280) {
                  $scope.imageW = image.naturalWidth;
                  $scope.imageH = image.naturalHeight / 2.25;
                  $scope.value = capturedImage.clientHeight;
              } else if(image.width === 640) {
                  $scope.imageW = image.naturalWidth;
                  $scope.imageH = image.naturalHeight;
                  $scope.value = capturedImage.clientHeight;
              } else if(image.width === 512) {
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
          if(isFirst) {
                if(rows > 1) {
                    var value = 0;
                    var zIndexValue = 100;            
                    for(var i = 0; i < capturedImages.length; i++) {
                        var image = document.getElementById('imagenesCapturadas' + i);  
                        if(i >= 3) {
                            if(i % 3 === 0){
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

    $scope.getWidthHeight = function(image, index) {
       var image = document.getElementById('copiaImagenes' + index);
       if(image != null) {
          $scope.imageW = image.naturalWidth;
          $scope.imageH = image.naturalHeight;
       }
    }
}]);
