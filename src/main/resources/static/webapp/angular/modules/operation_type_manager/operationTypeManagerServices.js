/*
	This service is used to set (and get) the objects for the modals.
*/
angular.module('O2DigitalSite').service('CUObject', function($timeout){

	var docObject,
		documentsToSignList,
		documentsToUploadList,
		conditionObject,
		conditionsList,
		authObject,
		authIndex,
		authArray,
		authAdditionalAction,
		authIdentifierArray,
		authRetrieved,
		limitObject,
		limitIndex,
		limitArray,
		notificationObject,
		notificationIndex,
		notificationArray,
		notificationTypeArray,
		remindersTypeArray,
		reminderObject,
		operationTypeID,
		domainID,
		authActionArray,
		biosignDocsArray;

	var setDocumentsToSignList = function (documentsToSignListValue) {
		documentsToSignList = documentsToSignListValue;
	}

	var getDocumentsToSignList = function (documentsToSignListValue) {
		return documentsToSignList;
	}

	var setDocumentsToUploadList = function (documentsToUploadListValue) {
		documentsToUploadList = documentsToUploadListValue;
	}

	var getDocumentsToUploadList = function (documentsToUploadListValue) {
		return documentsToUploadList;
	}

	var setConditionsList = function (conditionsListValue) {
		conditionsList = conditionsListValue;
	}

	var getConditionsList = function (conditionsListValue) {
		return conditionsList;
	}

	var setDomainID = function (domainIDValue) {
		domainID = domainIDValue;
	}

	var getDomainID = function () {
		return domainID;
	}

	var setRemindersTypeArray = function (remindersTypeArrayValue) {
		remindersTypeArray = remindersTypeArrayValue;
	}

	var getRemindersTypeArray = function () {
		return remindersTypeArray;
	}

	var setReminderObject = function (reminderObjectValue) {
		reminderObject = reminderObjectValue;
	}

	var getReminderObject = function () {
		return reminderObject;
	}

	var setDocObject = function(docValue){
		docObject = docValue;
	}

	var getDocObject = function(){
		return docObject;
	}

	var setAuthObject = function(authValue){
		authObject = authValue;
	}

	var getAuthObject = function(){
		return authObject;
	}

	var setAuthRetrieved = function(authRetrievedValue){
		authRetrieved = authRetrievedValue;
	}

	var getAuthRetrieved = function(){
		return authRetrievedValue;
	}

	var setAuthIndexObject = function(authIndexValue){
		authIndex = authIndexValue;
	}

	var getAuthIndexObject = function(){
		return authIndex;
	}

	var setAuthArrayObject = function(authArrayValue){
		authArray = authArrayValue;
	}

	var getAuthArrayObject = function(){
		return authArray;
	}

	var setAuthAdditionalActionObject = function(authAdditionalActionValue){
		authAdditionalAction = authAdditionalActionValue;
	}

	var getAuthAdditionalActionObject = function(){
		return authAdditionalAction;
	}

	var setAuthIdentifierArrayObject = function(authIdentifierArrayValue){
		authIdentifierArray = authIdentifierArrayValue;
	}

	var getAuthIdentifierArrayObject = function(){
		return authIdentifierArray;
	}

	var setConditionsObject = function(conditionValue){
		conditionObject = conditionValue;
	}

	var getConditionObject = function(){
		return conditionObject;
	}

	var setLimitObject = function(limitValue){
		limitObject = limitValue;
	}

	var getLimitObject = function(){
		return limitObject;
	}

	var setLimitArrayObject = function(limitArrayValue){
		limitArray = limitArrayValue;
	}

	var getLimitArrayObject = function(){
		return limitArray;
	}

	var setLimitIndexObject = function(limitIndexValue){
		limitIndex = limitIndexValue;
	}

	var getLimitIndexObject = function(){
		return limitIndex;
	}

	var setNotificationIndexObject = function(notificationIndexValue){
		notificationIndex = notificationIndexValue;
	}

	var getNotificationIndexObject = function(){
		return notificationIndex;
	}

	var setNotificationObject = function(notificationValue){
		notificationObject = notificationValue;
	}

	var getNotificationObject = function(){
		return notificationObject;
	}

	var setNotificationArray = function(notificationArrayValue){
		notificationArray = notificationArrayValue;
	}

	var getNotificationArray = function(){
		return notificationArray;
	}

	var setNotificationTypeArray = function(notificationTypeArrayValue){
		notificationTypeArray = notificationTypeArrayValue;
	}

	var getNotificationTypeArray = function(){
		return notificationTypeArray;
	}

	var setOperationTypeID = function(operationTypeIDValue){
		operationTypeID = operationTypeIDValue;
	}

	var getOperationTypeID = function(){
		return operationTypeID;
	}

	var setAuthActionArrayObject = function(authActionArrayValue){
		authActionArray = authActionArrayValue;
	}

	var getAuthActionArrayObject = function(){
		return authActionArray;
	}

	var setBiosignDocsArray = function(biosignDocsArrayValue){
		biosignDocsArray = biosignDocsArrayValue;
	}

	var getBiosignDocsArray = function(){
		return biosignDocsArray;
	}




	return {
		setDocObject : setDocObject,
		getDocObject : getDocObject,

		setConditionsObject: setConditionsObject,
		getConditionObject : getConditionObject,

		setAuthObject : setAuthObject,
		getAuthObject : getAuthObject,
		setAuthRetrieved : setAuthRetrieved,
		getAuthRetrieved : getAuthRetrieved,
		setAuthIndexObject : setAuthIndexObject,
		getAuthIndexObject : getAuthIndexObject,
		setAuthArrayObject : setAuthArrayObject,
		getAuthArrayObject : getAuthArrayObject,
		setAuthAdditionalActionObject : setAuthAdditionalActionObject,
		getAuthAdditionalActionObject : getAuthAdditionalActionObject,
		setAuthIdentifierArrayObject : setAuthIdentifierArrayObject,
		getAuthIdentifierArrayObject : getAuthIdentifierArrayObject,

		setLimitObject : setLimitObject,
		getLimitObject : getLimitObject,

		setLimitArrayObject : setLimitArrayObject,
		getLimitArrayObject : getLimitArrayObject,
		setLimitIndexObject : setLimitIndexObject,
		getLimitIndexObject : getLimitIndexObject,

		setNotificationIndexObject : setNotificationIndexObject,
		getNotificationIndexObject : getNotificationIndexObject,
		setNotificationObject : setNotificationObject,
		getNotificationObject : getNotificationObject,
		setNotificationArray : setNotificationArray,
		getNotificationArray : getNotificationArray,
		setNotificationTypeArray : setNotificationTypeArray,
		getNotificationTypeArray : getNotificationTypeArray,

		setOperationTypeID : setOperationTypeID,
		getOperationTypeID : getOperationTypeID,

		setDomainID : setDomainID,
		getDomainID : getDomainID,

		setRemindersTypeArray : setRemindersTypeArray,
		getRemindersTypeArray : getRemindersTypeArray,
		setReminderObject : setReminderObject,
		getReminderObject : getReminderObject,
		setConditionsList: setConditionsList,
		getConditionsList : getConditionsList,

		setDocumentsToSignList: setDocumentsToSignList,
		getDocumentsToSignList : getDocumentsToSignList,
		setDocumentsToUploadList: setDocumentsToUploadList,
		getDocumentsToUploadList : getDocumentsToUploadList,


		setAuthActionArrayObject : setAuthActionArrayObject,
		getAuthActionArrayObject : getAuthActionArrayObject,

		setBiosignDocsArray : setBiosignDocsArray,
		getBiosignDocsArray : getBiosignDocsArray

	}

});


/*
	This service is used to set (and get) the objects for the modals.
*/
angular.module('O2DigitalSite').service('TablesInstances', function(){

	var instanceDocTableToSign,
		instanceDocTableToUpload,
		instanceCondTable,
		instanceAuthTable,
		instanceLimitTable,
		instanceNotificationTable,
		instanceReminderTable;

	var setInstanceReminderTable = function(instanceReminderTableValue){
		instanceReminderTable = instanceReminderTableValue;
	}

	var getInstanceReminderTable = function(){
		return instanceReminderTable;
	}

	var setInstanceDocTableToSign = function(instanceDocTableToSignValue){
		instanceDocTableToSign = instanceDocTableToSignValue;
	}

	var getInstanceDocTableToSign = function(){
		return instanceDocTableToSign;
	}

	var setInstanceDocTableToUpload = function(instanceDocTableToUploadValue){
		instanceDocTableToUpload = instanceDocTableToUploadValue;
	}

	var getInstanceDocTableToUpload = function(){
		return instanceDocTableToUpload;
	}

	var setInstanceCondTable = function(instanceCondTableValue){
		instanceCondTable = instanceCondTableValue;
	}

	var getInstanceCondTable = function(){
		return instanceCondTable;
	}

	var setInstanceAuthTable = function(instanceAuthTableValue){
		instanceAuthTable = instanceAuthTableValue;
	}

	var getInstanceAuthTable = function(){
		return instanceAuthTable;
	}

	var setInstanceLimitTable = function(instanceLimitTableValue){
		instanceLimitTable = instanceLimitTableValue;
	}

	var getInstanceLimitTable = function(){
		return instanceLimitTable;
	}

	var setInstanceNotificationTable = function(instanceNotificationTableValue){
		instanceNotificationTable = instanceNotificationTableValue;
	}

	var getInstanceNotificationTable = function(){
		return instanceNotificationTable;
	}

	return {
		setInstanceDocTableToSign : setInstanceDocTableToSign,
		getInstanceDocTableToSign : getInstanceDocTableToSign,

		setInstanceDocTableToUpload : setInstanceDocTableToUpload,
		getInstanceDocTableToUpload : getInstanceDocTableToUpload,

		setInstanceCondTable : setInstanceCondTable,
		getInstanceCondTable : getInstanceCondTable,

		setInstanceAuthTable : setInstanceAuthTable,
		getInstanceAuthTable : getInstanceAuthTable,

		setInstanceLimitTable : setInstanceLimitTable,
		getInstanceLimitTable : getInstanceLimitTable,

		setInstanceNotificationTable : setInstanceNotificationTable,
		getInstanceNotificationTable : getInstanceNotificationTable,

		setInstanceReminderTable : setInstanceReminderTable,
		getInstanceReminderTable : getInstanceReminderTable

	}

});

angular.module('O2DigitalSite').service('operationRESTServices', function($http){

	var modifyOperationNameAndSignatureType = function (operationTypeID, operation) {

		return $http({
			method : 'POST',
			url : 'services/operationtype/modifynameandsigntype/'+operationTypeID,
			data : JSON.stringify(operation)
		});

	}

	var deleteDocumentFromOperationType = function (operationTypeID, codeDoc) {

		return $http({
			method : 'DELETE',
			url : 'services/documents/type/delete/'+operationTypeID+'/'+codeDoc,
		});

	}

	var deleteNotificationFromOperationType = function (idDomain, notificationID) {

		return $http({
			method : 'DELETE',
			url : 'services/notifications/template/delete/' + idDomain + '/' + notificationID,
		});

	}

	var saveReminder = function (reminder, operationTypeID) {
		return $http({
			method : 'POST',
			url : 'services/reminders/save/'+operationTypeID,
			data : JSON.stringify(reminder)
		});
	}

	var deleteReminder = function (operationTypeID, reminderID) {
		return $http({
			method : 'DELETE',
			url : 'services/reminders/delete/'+operationTypeID+'/'+reminderID,
		});
	}

	var getRemindersType = function () {

		return $http({
			method : 'GET',
			url : 'services/reminders/listofreminderstype',
		});

	}

	var getRemindersList = function (idOperationType) {
		return $http({
			method : 'GET',
			url : 'services/reminders/'+idOperationType,
		});
	}

	var getActaTemplateByDomainID = function (domainID, operationTypeID) {
		return $http({
			method : 'GET',
			url : 'services/actatemplate/'+domainID+"/"+operationTypeID,
		});
	}

	var saveActaTemplateByOperationTypeID = function (operationTypeID, actaTemplate) {
		return $http({
			method : 'POST',
			url : 'services/actatemplate/save/'+operationTypeID,
			data : JSON.stringify(actaTemplate)
		});
	}

	var deleteCond = function (condition, idOperationType) {
		return $http({
			method : 'DELETE',
			url : 'services/conditions/delete/'+idOperationType+'/'+condition.id+'/'+condition.label,
		});
	}

	var getCustomMessages = function (operationTypeID) {

		return $http({
			method : 'GET',
			url : 'services/messages2customer/getmessages/'+operationTypeID,
		});

	}

	var saveCustomLabels = function (operationTypeID, saveCustomLabelsObject) {
		return $http({
			method : 'POST',
			url : 'services/messages2customer/savemessages/'+operationTypeID,
			data : JSON.stringify(saveCustomLabelsObject)
		});
	}

	var getCustomLanguageMessages = function (operationTypeID, languageCode) {

		return $http({
			method : 'GET',
			url : 'services/messages2customer/getmessages/'+operationTypeID+'/'+languageCode,
		});

	}

	var saveCustomLanguageLabels = function (operationTypeID, languageCode, saveCustomLabelsObject) {
		return $http({
			method : 'POST',
			url : 'services/messages2customer/savemessages/'+operationTypeID+'/'+languageCode,
			data : JSON.stringify(saveCustomLabelsObject)
		});
	}

	var getLanguages = function () {
		return $http({
			method : 'GET',
			url : 'services/messages2customer/getlanguages'
		});
	}

	var deleteLimit = function (operationTypeID, limitID) {
		return $http({
			method : 'DELETE',
			url : 'services/limits/delete/'+operationTypeID+'/'+limitID,
		});
	}

	var saveLimit = function (operationTypeID, limitObject) {
		return $http({
			method : 'POST',
			url : 'services/limits/save/'+operationTypeID,
			data : JSON.stringify(limitObject)
		});
	}

	var saveDocType = function (operationTypeID, doc) {
		return $http({
			method: 'POST',
			url: 'services/documents/type/save/'+operationTypeID,
			data: JSON.stringify(doc)
        })
	}

	var getAdvancedOptions = function (operationTypeID) {
		return $http({
			method: 'GET',
			url: 'services/advanced/'+operationTypeID
        })
	}

	var saveAdvancedOptions = function (operationTypeID, advancedOptions) {
		return $http({
			method: 'POST',
			url: 'services/advanced/save/'+operationTypeID,
			data: JSON.stringify(advancedOptions)
        })
	}

	var saveDefaultAdvancedOptions = function (operationTypeID) {
		return $http({
			method: 'POST',
			url: 'services/advanced/save/default/'+operationTypeID,
        })
	}


	return {
		modifyOperationNameAndSignatureType : modifyOperationNameAndSignatureType,
		deleteDocumentFromOperationType     : deleteDocumentFromOperationType,
		deleteNotificationFromOperationType : deleteNotificationFromOperationType,

		getRemindersType                    : getRemindersType,
		getRemindersList                    : getRemindersList,
		saveReminder                        : saveReminder,
		deleteReminder                      : deleteReminder,

		getActaTemplateByDomainID           : getActaTemplateByDomainID,
		saveActaTemplateByOperationTypeID   : saveActaTemplateByOperationTypeID,

		getCustomMessages                   : getCustomMessages,
		saveCustomLabels                    : saveCustomLabels,

		getCustomLanguageMessages           : getCustomLanguageMessages,
		saveCustomLanguageLabels            : saveCustomLanguageLabels,

		getLanguages                        : getLanguages,

		deleteCond                          : deleteCond,

		deleteLimit                         : deleteLimit,
		saveLimit                           : saveLimit,

		saveDocType                         : saveDocType,

		getAdvancedOptions                  : getAdvancedOptions,
		saveAdvancedOptions                 : saveAdvancedOptions,
		saveDefaultAdvancedOptions          : saveDefaultAdvancedOptions
	}
});


// angular
// 		.module('O2DigitalSite')
// 	  .service('SurveyService', SurveyService);

// function SurveyService() {
//
// 	var service = {
// 		 setQuestionBeforeEdited : setQuestionBeforeEdited,
// 		 getQuestionCancelEdit : getQuestionCancelEdit
// 	}
//
// 	return service;
//
// 	var question
//
// 	function setQuestionBeforeEdited(quest) {
// 		  question = quest;
// 	}
//
// 	function getQuestionCancelEdit() {
// 		  return question;
// 	}
// }
