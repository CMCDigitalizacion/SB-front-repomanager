angular.module('O2DigitalSite').service('domainServices', function(){

	var usersGroupObject,
		usersGroupList,
		operationList,
		userObject,
		usersList,
		allowedCaObject,
		actaObject,
		bioDocsList,
		extraFields;

	var setUsersGroupObject = function (usersGroupObjectValue) {
		usersGroupObject = usersGroupObjectValue;
	}

	var getUsersGroupObject = function () {
		return usersGroupObject;
	}

	var setUsersGroupList = function (usersGroupListValue) {
		usersGroupList = usersGroupListValue;
	}

	var getUsersGroupList = function () {
		return usersGroupList;
	}

	var setActaObject = function (actaObjectValue) {
		actaObject = actaObjectValue;
	}

	var getActaObject = function () {
		return actaObject;
	}

	var getP12Object = function () {
		return p12Object;
	}

	var setAllowedCAObject = function (allowedCaObjectValue) {
		allowedCaObject = allowedCaObjectValue;
	}

	var getAllowedCAObject = function (allowedCaObjectValue) {
		return allowedCaObject;
	}

	var setUserList = function (userListValue) {
		usersList = userListValue;
	}

	var getUserList = function () {
		return usersList;
	}

	var setUserObject = function (userValue) {
		userObject = userValue;
	}

	var getUserObject = function () {
		return userObject;
	}

	var setOperationList = function (operationListValue) {
		operationList = operationListValue;
	}

	var getOperationList = function () {
		return operationList;
	}

	var allowedCaList;

	var setAllowedCaList = function (allowedListValue) {
		allowedCaList = allowedListValue;
	}

	var getAllowedCaList = function () {
		return allowedCaList;
	}

	var actasList;

	var setActasList = function (actasListValue) {
		actasList = actasListValue;
	}

	var getActasList = function () {
		return actasList;
	}

	var setExtraFields = function(addedExtraFields) {
		extraFields = addedExtraFields;
	}

	var getExtraFields = function() {
		return extraFields;
	}

	var setBioDocsList = function(bioDocs) {
		bioDocsList = bioDocs;
	}

	var getBioDocsList = function() {
		return bioDocsList;
	}

	return {
		setUsersGroupObject:setUsersGroupObject,
		getUsersGroupObject:getUsersGroupObject,
		setUsersGroupList:setUsersGroupList,
		getUsersGroupList:getUsersGroupList,
		setOperationList : setOperationList,
		getOperationList : getOperationList,
		getAllowedCaList : getAllowedCaList,
		setAllowedCaList : setAllowedCaList,
		getActasList : getActasList,
		setActasList : setActasList,
		setUserList : setUserList,
		getUserList : getUserList,
		setUserObject : setUserObject,
		getUserObject : getUserObject,
		setAllowedCAObject : setAllowedCAObject,
		getAllowedCAObject : getAllowedCAObject,
		setActaObject : setActaObject,
		getActaObject : getActaObject,
		getP12Object : getP12Object,
		setExtraFields : setExtraFields,
		getExtraFields : getExtraFields,
		setBioDocsList: setBioDocsList,
		getBioDocsList: getBioDocsList
 	}
});

angular.module('O2DigitalSite').service('domainTables', function(){

	var userTable;

	var setUserTable = function (userTableValue) {
		userTable = userTableValue;
	}

	var getUserTable = function () {
		return userTable;
	}

	return {
		setUserTable : setUserTable,
		getUserTable : getUserTable,
 	}
});

angular.module('O2DigitalSite').service('domainRESTServices', function($http){



	var uploadDefaultDocument = function (file, domainID, reference, uploadMandatory, metadata) {
    	var fd = new FormData();

		fd.append('file', file);
		fd.append('reference', reference);
		fd.append('uploadMandatory', uploadMandatory);
		fd.append('metadata', metadata);

	    return $http.post("services/domain/save/defaultdocument/"+domainID, fd, {
	       withCredentials : false,
	       headers : {
	        'Content-Type' : undefined
	       },
	       transformRequest : angular.identity
	    })
	}

	var uploadLTVFile = function (file, domainID ) {
    	var fd = new FormData();

		fd.append('file', file);

	    return $http.post("services/domain/uploadcertltv/"+domainID, fd, {
	       withCredentials : false,
	       headers : {
	        'Content-Type' : undefined
	       },
	       transformRequest : angular.identity
	    })
	}


	var uploadP12File = function (file, certificatePass, domainID ) {
    	var fd = new FormData();

		fd.append('file', file);
		fd.append('certificatePass', certificatePass);

	    return $http.post("services/domain/uploadcert/"+domainID, fd, {
	       withCredentials : false,
	       headers : {
	        'Content-Type' : undefined
	       },
	       transformRequest : angular.identity
	    })
	}

	var uploadStyleFiles = function (arrayOfFiles, domainID, logoBig, logoMedium, logoSmall, cssFile, colors) {
    	var fd = new FormData();

	    angular.forEach(arrayOfFiles, function(fileObject){
	       fd.append('file', fileObject.file);
	    });

	    fd.append("logoBig", logoBig);
	    fd.append("logoMedium", logoMedium);
	    fd.append("logoSmall", logoSmall);
	    fd.append("cssFile", cssFile);
			fd.append('primaryColor', colors.primaryColor);
			fd.append('accentColor', colors.accentColor);


	    return $http.post("services/domain/uploadstylefiles/"+domainID, fd, {
	       withCredentials : false,
	       headers : {
	        'Content-Type' : undefined
	       },
	       transformRequest : angular.identity
	    })
	}

	var getDomainData = function (domainID) {

		return $http({
			method : 'GET',
			url : 'services/domain/'+domainID,
		});

	}

	var copyOperationType = function (domainID, operationTypeId) {

		return $http({
			method : 'POST',
			url : 'services/operationtype/copy/'+domainID+'/'+operationTypeId,
		});

	}

	var getDomainUsers = function (domainID) {
		return $http({
			method : 'GET',
			url : 'services/domain/users/'+domainID,
		});
	}
	
	var getDomainUsersByRole = function (domainID, role) {
		return $http({
			method : 'GET',
			url : 'services/domain/users/'+domainID+'/'+role,
		});
	}
	
	var getDomainUsersByRoleAndSuper = function (domainID, role) {
		return $http({
			method: "GET",
			url: "services/domain/usersRoleAndSuper/"+domainID+"/"+role,
		})
	}

	var saveDomainUser = function (domainID, userObject) {
		delete userObject.userpasswordrepeated;

		return $http({
			method : 'POST',
			url : 'services/domain/save/user/'+domainID,
			data : JSON.stringify(userObject)
		});

	}

	var deleteDomainUser = function (userID) {

		return $http({
			method : 'DELETE',
			url : 'services/domain/delete/user/'+userID,
		});
	}

	var modifyCaObject = function (ca) {

		return $http({
			method : 'POST',
			url : 'services/domain/modify/allowedca/ofdomain/'+ca.domainid,
			data : JSON.stringify(ca)
		});

	}

	var modifyActaObject = function (fd, actaObject) {

		return
			$http.post("services/domain/modify/actatemplate/ofdomain/"+actaObject.domainid, fd, {
					withCredentials : false,
			       	headers : {
				        'Content-Type' : undefined
			       	},
			       	transformRequest : angular.identity,
		       })

	}

	var saveDomainUsersGroup = function (domainID, usersgroupObject) {

		return $http({
			method : 'POST',
			url : 'services/domain/save/usersgroup/'+domainID,
			data : JSON.stringify(usersgroupObject)
		});

	}

	var deleteDomainUsersGroup = function (domainID, usersgroupID) {

		return $http({
			method : 'DELETE',
			url : 'services/domain/delete/usersgroup/'+domainID+'/'+usersgroupID,
		});
	}

	var saveGeneralInfo = function (domainGeneralInfo, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/general/'+domainid,
			data : JSON.stringify(domainGeneralInfo)
		});
	}

	var saveStorageConf = function (domainStorageConf, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/storage/'+domainid,
			data : JSON.stringify(domainStorageConf)
		});
	}

	var saveCertificatesConf = function (domainCertificatesConf, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/certificates/'+domainid,
			data : JSON.stringify(domainCertificatesConf)
		});
	}

	var saveEmailConf = function (domainEmailConf, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/email/'+domainid,
			data : JSON.stringify(domainEmailConf)
		});
	}

	var saveURLConf = function (domainURLConf, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/url/'+domainid,
			data : JSON.stringify(domainURLConf)
		});
	}

	var testEmailConf = function (domainEmailConf, domainid, email) {
		return $http({
			method : 'POST',
			url : 'services/domain/test/email/'+domainid+'/'+email,
			data : JSON.stringify(domainEmailConf)
		});
	}

	var testSMSConf = function (domainSMSConf, domainid, cellphone) {
		return $http({
			method : 'POST',
			url : 'services/domain/test/sms/'+domainid+'/'+cellphone,
			data : domainSMSConf.smsServerType
		});
	}

	var testTSAConf = function (domainTSAConf, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/test/tsa/'+domainid,
			data : JSON.stringify(domainTSAConf)
		});
	}

	var saveSMSConf = function (domainSMSConf, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/sms/'+domainid,
			data : JSON.stringify(domainSMSConf)
		});
	}

	var saveExtraFieldsConf = function (domainExtraInfoConf, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/extra/'+domainid,
			data : JSON.stringify(domainExtraInfoConf)
		});
	}

	var saveBioDoc = function (documentToSave) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/biodoc/' + documentToSave.domainid,
			data : JSON.stringify(documentToSave)
		});
	}

	var deleteBioDoc = function (documentToDelete) {
		return $http({
			method : 'DELETE',
			url : 'services/domain/delete/biodoc/' + documentToDelete.domainid + '/' + documentToDelete.id
		});
	}
	
	var saveLDAPConf = function (configLDAP, domainid) {
		return $http({
			method : 'POST',
			url : 'services/domain/save/ldap/' + domainid,
			data : JSON.stringify(configLDAP)
		});
	}
	
	var getUsersLdap = function (filter, domainid) {
		return $http({
			method: 'GET',
			url: 'services/domain/usersLdap/' + filter + '/' + domainid
		});
	}
	
	var testLdapConnection = function (ldapServer, domainid) {
		return $http({
			method: 'POST',
			url: 'services/domain/testLdapConnection/' + domainid,
			data: JSON.stringify(ldapServer)
		});
	}
	
	var saveUsersLdap = function (lstUsers, domainid) {
		return $http({
			method: 'POST',
			url: 'services/domain/save/userLDAP/' + domainid,
			data: JSON.stringify(lstUsers)
		});
	}
	
	var updateUserLDAP = function (domainid, userid) {
		return $http({
			method: 'GET',
			url: 'services/domain/updateUserfromLDAP/' + domainid + '/' + userid
		});
	}
	
	var getLoggedUser = function () { 
		return $http({ 
			method: 'GET', 
			url: 'services/domain/user' 
		}); 
	} 


	return {
		uploadStyleFiles       : uploadStyleFiles,
		getDomainUsers         : getDomainUsers,
		getDomainUsersByRole   : getDomainUsersByRole,
		getDomainUsersByRoleAndSuper : getDomainUsersByRoleAndSuper, 
		getDomainData          : getDomainData,
		saveDomainUser         : saveDomainUser,
		deleteDomainUser       : deleteDomainUser,
		modifyCaObject         : modifyCaObject,
		modifyActaObject       : modifyActaObject,
		saveDomainUsersGroup   : saveDomainUsersGroup,
		deleteDomainUsersGroup : deleteDomainUsersGroup,
		saveGeneralInfo        : saveGeneralInfo,
		saveStorageConf        : saveStorageConf,
		saveCertificatesConf   : saveCertificatesConf,
		saveEmailConf          : saveEmailConf,
		saveURLConf            : saveURLConf,
		saveExtraFieldsConf    : saveExtraFieldsConf,
		saveSMSConf            : saveSMSConf,
		saveBioDoc             : saveBioDoc,
		deleteBioDoc           : deleteBioDoc,
		copyOperationType      : copyOperationType,
		uploadDefaultDocument  : uploadDefaultDocument,
		uploadP12File		   : uploadP12File,
		testSMSConf            : testSMSConf,
		testEmailConf		   : testEmailConf,
		testTSAConf            : testTSAConf,
		uploadLTVFile          : uploadLTVFile,
		saveLDAPConf		   : saveLDAPConf,
		getUsersLdap		   : getUsersLdap, 
		saveUsersLdap		   : saveUsersLdap,
		testLdapConnection	   : testLdapConnection,
		updateUserLDAP		   : updateUserLDAP,
		getLoggedUser		   : getLoggedUser
	}
});
