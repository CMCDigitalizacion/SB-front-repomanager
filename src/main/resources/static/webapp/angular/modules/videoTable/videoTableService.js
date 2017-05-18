angular.module('O2DigitalSite')
  .service('videoService', videoService);

  function videoService($http) {
      var service = {
        getVideoList : getVideoList,
        uploadSnapShot : uploadSnapShot,
        obtainVideoDetails : obtainVideoDetails,
        // getVideo : getVideo,
        approveValidation : approveValidation,
        rejectValidation : rejectValidation,
        getAllVideos : getAllVideos,
        obtainVerifiedImage : obtainVerifiedImage
      }

      return service;

      function getVideoList(domainId) {
        return $http.get('services/videos/listvideos/' + domainId);
      }

      function uploadSnapShot(data) {
        return $http.post('services/videos/uploadimage', data, {
          withCredentials : false,
          headers : {
            'Content-Type' : undefined
          },
          transformRequest : angular.identity,
        });
      }

      function obtainVideoDetails(operationuuid) {
        return $http.get('services/videos/getdetail/' + operationuuid);
      }

      function getAllVideos(operationuuid) {
        return $http.get('services/videos/getlistavideos/' + operationuuid);
      }

    /*  function getVideo(operationuuid) {
        return $http.get('/VideoId/servicios/opentok/getvideo/' + operationuuid);
      } */

      function approveValidation(operationuuid) {
        return $http.get('services/video2sign/verifyvideoid/' + operationuuid, {
          withCredentials : false,
          headers : {
            'Content-Type' : undefined
          },
          transformRequest : angular.identity
        });
      }

      function rejectValidation(operationuuid) {
        return $http.get('services/video2sign/rejectvideoid/' + operationuuid, {
          withCredentials : false,
          headers : {
            'Content-Type' : undefined
          },
          transformRequest : angular.identity
        });
      }

      function obtainVerifiedImage(imageId) {
          return $http.get('services/videos/getverificationimageb64/' + imageId);
      }
  }
