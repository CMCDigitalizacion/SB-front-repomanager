angular.module('O2BioSigner').factory('signFactory',
		function($websocket, $rootScope, $http, $q, cfpLoadingBar) {

			// var url = 'ws://localhost:82';
			var url = 'wss://websocket.galeonsoftware.com:1443';
			var certserverError = false;

			var getOperationInfo = function(idOperation) {
				var dataStream = $websocket(url);
				var deferred = $q.defer();
				var objectToReturn = {};

				cfpLoadingBar.start();

				dataStream.onError(function(message) {
					cfpLoadingBar.complete();
					deferred.reject(message);
				});

				dataStream.onOpen(function(message) {
					// cfpLoadingBar.complete();
					var getOperationInfoCommand = {
						Type : 2,
						idFile : "" + idOperation
					};
					// var str = JSON.stringify(getOperationInfoCommand);
					dataStream.send(JSON.stringify(getOperationInfoCommand));
				});

				dataStream.onMessage(function(message) {
					cfpLoadingBar.complete();
					var resp = JSON.parse(message.data);
					if (resp.Type !== -1) {
						var docsData = JSON.parse(resp.Data);
						deferred.resolve(docsData);
					} else {
						deferred.reject(message);
					}

				});

				return deferred.promise;
			}

			var getFileByUUid = function(uuidFile) {
				var dataStream = $websocket(url);
				var deferred = $q.defer();

				cfpLoadingBar.start();

				dataStream.onError(function(message) {
					cfpLoadingBar.complete();
					deferred.reject(message);
				});

				dataStream.onOpen(function(message) {
					// cfpLoadingBar.complete();
					var getOperationInfoCommand = {
						Type : 3,
						idFile : "" + uuidFile
					};
					dataStream.send(JSON.stringify(getOperationInfoCommand));
				});

				dataStream.onMessage(function(message) {
					cfpLoadingBar.complete();
					var resp = JSON.parse(message.data);
					if (resp.Type !== -1) {
						deferred.resolve(resp.Data);
					} else {
						if (angular.isObject(resp.Data))
							deferred.reject(resp.Data.s);
						else
							deferred.reject('Ha occurrido un <i>error</i>.');
					}
				});

				return deferred.promise;
			}

			var signFileByUUid = function(uuidFile, idSigner) {
				var dataStream = $websocket(url);
				var deferred = $q.defer();

				cfpLoadingBar.start();

				dataStream.onError(function(message) {
					cfpLoadingBar.complete();
					deferred.reject(message);
				});

				dataStream.onOpen(function(message) {
					// cfpLoadingBar.complete();
					var getOperationInfoCommand = {
						Type : 4,
						idFile : "" + uuidFile,
						idSigner : idSigner
					};
					// var str = JSON.stringify(getOperationInfoCommand);
					dataStream.send(JSON.stringify(getOperationInfoCommand));
				});

				dataStream.onMessage(function(message) {
					cfpLoadingBar.complete();
					deferred.resolve(JSON.parse(message.data));
				});

				return deferred.promise;
			}

			var getTempSignedFileByUUid = function(uuidFile) {
				var dataStream = $websocket(url);
				var deferred = $q.defer();

				cfpLoadingBar.start();

				dataStream.onError(function(message) {
					cfpLoadingBar.complete();
					deferred.reject(message);
				});

				dataStream.onOpen(function(message) {
					// cfpLoadingBar.complete();
					var getOperationInfoCommand = {
						Type : 5,
						idFile : "" + uuidFile
					};
					// var str = JSON.stringify(getOperationInfoCommand);
					dataStream.send(JSON.stringify(getOperationInfoCommand));
				});

				dataStream.onMessage(function(message) {
					cfpLoadingBar.complete();
					var resp = JSON.parse(message.data);
					if (resp.Type !== -1) {
						deferred.resolve(resp.Data);
					} else {
						deferred.reject();
					}
				});

				return deferred.promise;
			}

			var terminateSignProcess = function(idOperation) {
				var dataStream = $websocket(url);
				var deferred = $q.defer();

				cfpLoadingBar.start();

				dataStream.onError(function(message) {
					cfpLoadingBar.complete();
					deferred.reject(message);
				});

				dataStream.onOpen(function(message) {
					var finalizeOperation = {
						Type : 6,
						idFile : "" + idOperation
					};
					dataStream.send(JSON.stringify(finalizeOperation));
				});

				dataStream.onMessage(function(message) {
					cfpLoadingBar.complete();
					var resp = JSON.parse(message.data);
					if (resp.Type !== -1) {
						deferred.resolve(resp.Data);
					} else {
						deferred.reject();
					}
				});

				return deferred.promise;
			}

			return {
				getOperationInfo : getOperationInfo,
				getFileByUUid : getFileByUUid,
				signFileByUUid : signFileByUUid,
				getTempSignedFileByUUid : getTempSignedFileByUUid,
				terminateSignProcess : terminateSignProcess
			}
		});