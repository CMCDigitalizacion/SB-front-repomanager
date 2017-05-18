angular
	.module('O2DigitalSite')
	.controller('FeedbackBarController', feedbackBarController)


function feedbackBarController ($rootScope, $timeout, $scope) {

	$scope.hideIt = true;

	$scope.call = {
		success : false,
		error : false
	}

	$scope.$on('callSuccess', function (event, message) {
		$scope.hideIt = false;
		$scope.messageSuccess = message;
		$scope.call.success = true;
		resetFeedbackBar(1500);

	})

	$scope.$on('callError', function (event, message) {
		$scope.hideIt = false;
		$scope.messageError = message;
		$scope.call.error = true;
		resetFeedbackBar(6000);
	})

	function resetFeedbackBar (duration) {
		$timeout(function(){
			$scope.call.success = false;
			$scope.call.error = false;
		}, duration);

		$timeout(function(){
			$scope.hideIt = true;
		}, duration+800);
	}
}