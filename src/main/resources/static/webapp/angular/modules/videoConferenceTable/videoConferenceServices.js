angular
    .module('O2DigitalSite')
    .service('videoConferenceService', videoConferenceService);

function videoConferenceService($http) {

    var services = {
        getVideoConferencesList : getVideoConferencesList,
        obtainConferenceData : obtainConferenceData,
        obtainVideoDetails : obtainVideoDetails,
        startvideoconf : startvideoconf,
        stopvideoconf : stopvideoconf,
        approveVideoConference : approveVideoConference,
        rejectVideoConference : rejectVideoConference,
        setOpenTokSessionData : setOpenTokSessionData,
        getOpenTokSessionData : getOpenTokSessionData,
        setOperationUuid : setOperationUuid,
        getOperationUuid :  getOperationUuid,
        getAllVideos : getAllVideos,
        obtainVerifiedImage : obtainVerifiedImage,
        getManagerQuestions : getManagerQuestions,
        getVideoSignature : getVideoSignature,
        getFilteredVideoConferences : getFilteredVideoConferences
    };

    return services;

    var openTokData, operationUuid;

    function getFilteredVideoConferences(domainId, idUser, filter) {
        return $http.get('services/videos/videoconferences/filtered/' + domainId + '/' + idUser + '/' + filter.fromFormatted + '/' + filter.toFormatted + '/' + filter.operationid + '/' + filter.agent.name + '/' + filter.videostate);
    }

    function getVideoConferencesList(domainId) {
        return $http.get('services/videos/listvideosvideoconf/' + domainId);
    }

    function obtainConferenceData(operationuuid) {
        return $http.get('services/videos/sessionsuscribe/' + operationuuid);
    }
    
    function getVideoSignature(video) {
        return $http.get('services/videos/getvideosignature/' + video);
    }
   
    function approveVideoConference(operationuuid) {
        return $http.get('services/video2sign/verifyvideoconference/' + operationuuid);
    }

    function rejectVideoConference(operationuuid) {
        return $http.get('services/video2sign/rejectvideoconference/' + operationuuid);
    }

    function obtainVideoDetails(operationuuid) {
        return $http.get('services/videos/getdetail/' + operationuuid, {
        	ignoreLoadingBar: true
        });
    }
    function startvideoconf(sessionid) {
        return $http.get('services/videos/startvideoconf/' + sessionid, {
        	ignoreLoadingBar: true
        });
    }
    function stopvideoconf(archiveid) {
        return $http.get('services/videos/stopvideoconf/' + archiveid, {
        	ignoreLoadingBar: true
        });
    }
    function getAllVideos(operationuuid) {
        return $http.get('services/videos/getlistavideos/' + operationuuid);
    }
   
    function obtainVerifiedImage(imageId) {
        return $http.get('services/videos/getverificationimageb64/' + imageId);
    }

    function setOpenTokSessionData(data) {
        openTokData = data;
    }

    function getOpenTokSessionData() {
        return openTokData;
    }

    function setOperationUuid(operationuuid) {
        operationUuid = operationuuid;
    }

    function getOperationUuid() {
        return operationUuid;
    }

    function getManagerQuestions(uuid) {
       return $http.get('services/videos/verificationquestions/' + uuid);
   }

}