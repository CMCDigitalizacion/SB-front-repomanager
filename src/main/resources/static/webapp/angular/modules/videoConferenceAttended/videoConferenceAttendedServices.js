angular
    .module('O2DigitalSite')
    .service('videoConferenceAttendedService', videoConferenceAttendedService);

function videoConferenceAttendedService($http) {

    var services = {
    	getVideoConferenceToAttend : getVideoConferenceToAttend,
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
        getManagerQuestions : getManagerQuestions
    };

    return services;

    var openTokData, operationUuid;

    function getVideoConferenceToAttend(domainId) {
        return $http.get('services/videos/getvideoconftoattend/' + domainId);
    }

    function obtainConferenceData(operationuuid) {
        return $http.get('services/videos/sessionsuscribe/' + operationuuid);
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