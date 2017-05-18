angular
.module('O2DigitalSite').controller('modalViewPDFCategoryController',modalViewPDFCategoryController);

function modalViewPDFCategoryController($scope , $rootScope , tokenManager, uuid){
	
	$scope.domainId= tokenManager.getDomainId();
	$scope.uuid = uuid;
	$scope.userId = tokenManager.getUserIdFromToken()
	

	$scope.url = "webapp/web/viewer.html?file="+ $rootScope.url + "services/certimage/getdigitalizeddocumentbyuuid/" + $scope.domainId + "/" + tokenManager.getToken() + "/" + $scope.uuid;
	console.log($scope.url);
};