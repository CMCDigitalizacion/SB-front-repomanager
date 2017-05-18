/**
* 
*
* Description
*/
angular.module('O2DigitalSite').directive('fieldsAuth', function () {
	
	function link(scope, element, attrs) {
	    console.log(scope)
	    console.log(element)
	    console.log(attrs)

  	}


	return {
		restrict : 'E',
		link : link,
		scope : {
			fields : "=",
			form : "=",
			auth : "="
		},
		templateUrl : 'webapp/angular/modules/operation_type_manager/fields-auth.html'
	}
});


angular
.module('O2DigitalSite')
.directive('checkDocumentCode', sameDocumentCodeFunction)


function sameDocumentCodeFunction (CUObject) {
  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      var documentObject = JSON.parse(attrs.checkDocumentCode);
      var codeSelected = documentObject.code;
      function checkSameDocumentCode (model) {
        var hasSameName = false;
        angular.forEach(CUObject.getDocumentsToSignList(), function(value, key){
            if(model.toUpperCase() === value.code.toUpperCase() && value.code !== codeSelected){
              ctrl.$setValidity('checkDocumentCode', false);
              hasSameName = true;
              return;
            }
        });
        angular.forEach(CUObject.getDocumentsToUploadList(), function(value, key){
            if(model.toUpperCase() === value.code.toUpperCase() && value.code !== codeSelected){
              ctrl.$setValidity('checkDocumentCode', false);
              hasSameName = true;
              return;
            }
          });
          if(!hasSameName)
            ctrl.$setValidity('checkDocumentCode', true);
      return model;
      }

       ctrl.$parsers.push(checkSameDocumentCode);
    }
  };
}

angular
.module('O2DigitalSite')
.directive('checkBioCode', codeStartWithBioFunction)


function codeStartWithBioFunction (CUObject) {
  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      var code = attrs.checkBioCode;
      function codeStartWithBioFunction (model) {
        
          if(model.indexOf('BIO ') === -1 || model.indexOf('bio '))
            ctrl.$setValidity('checkBioCode', true);
          else
            ctrl.$setValidity('checkBioCode', false);

          if(model.indexOf('STATIC BIO ') === -1 || model.indexOf('static bio ') === -1)
            ctrl.$setValidity('checkBioCode', true);
          else
            ctrl.$setValidity('checkBioCode', false);
      return model;
      }

       ctrl.$parsers.push(codeStartWithBioFunction);
    }
  };
}

angular
    .module('O2DigitalSite')
    .directive('sameConditionName', sameConditionName)

    function sameConditionName (CUObject) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
			var condObject = JSON.parse(attrs.sameConditionName)
			var idcondObject = condObject.id;
          function checkSameConditionNameModal (model) {
            var hasSameCommonName = false;
            angular.forEach(CUObject.getConditionsList(), function (conditionObject, index) {
              if (conditionObject.label.toUpperCase() === model.toUpperCase() && conditionObject.id !== idcondObject){
                hasSameCommonName = true;
                ctrl.$setValidity('sameConditionName', false);
                return;
              }
            })
             if(!hasSameCommonName)
                ctrl.$setValidity('sameConditionName', true);
            return model;
        }
        ctrl.$parsers.push(checkSameConditionNameModal);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('sameNotificationType', sameNotificationType)

    function sameNotificationType (CUObject) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          console.log(attrs);
          
          function sameNotificationTypeModal (model) {
            var hasSameCommonName = false;
            var condObject = JSON.parse(attrs.sameNotificationType);
            var idcondObject = condObject.id;
            angular.forEach(CUObject.getNotificationArray(), function (conditionObject, index) {
              if (conditionObject.notiftype === model && conditionObject.extra === condObject.extra && conditionObject.id !== idcondObject){
                hasSameCommonName = true;
                ctrl.$setValidity('sameNotificationType', false);
                return;
              }
            })
             if(!hasSameCommonName)
                ctrl.$setValidity('sameNotificationType', true);
            return model;
        }
          
          attrs.$observe('sameNotificationType', function(model){
              return sameNotificationTypeModal(ctrl.$viewValue);
            });
        ctrl.$parsers.push(sameNotificationTypeModal);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('checkCorrectOrder', checkCorrectOrder)

    function checkCorrectOrder (CUObject) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          function checkCorrectOrder (model) {
            var hasSameOrderBlock = false;
            var docTypeObject = JSON.parse(attrs.checkCorrectOrder);
            if(angular.isDefined(docTypeObject.block) && angular.isDefined(docTypeObject.order)){

                angular.forEach(CUObject.getDocumentsToSignList(), function (docToSign, index) {
                  if (docToSign.code !== docTypeObject.code && docToSign.block.toString() === docTypeObject.block && docToSign.order.toString() === docTypeObject.order){
                    hasSameOrderBlock = true;
                    ctrl.$setValidity('checkCorrectOrder', false);
                    return;
                  }
                });

                if(!hasSameOrderBlock)
                  ctrl.$setValidity('checkCorrectOrder', true);

            } else{
              ctrl.$setValidity('checkCorrectOrder', false);
            }
            return model;
        }
          
        attrs.$observe('checkCorrectOrder', function(model){
          return checkCorrectOrder(ctrl.$viewValue);
        });
        ctrl.$parsers.push(checkCorrectOrder);
      }
    }
  }