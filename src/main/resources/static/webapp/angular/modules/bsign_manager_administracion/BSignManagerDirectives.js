angular
      .module('O2DigitalSite')
      .directive('sameOperationName', sameOperationName)
      
      function sameOperationName (bsignServices) {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            function checkSameName (model) {
              var hasSameName = false;
              angular.forEach(bsignServices.getPolicyList(), function(value, key){
                if(model.toUpperCase() === value.policyName.toUpperCase()){
                  ctrl.$setValidity('sameOperationName', false);
                  hasSameName = true;
                  return;
                }
              });
              if(!hasSameName)
                ctrl.$setValidity('sameOperationName', true);
            return model;
            }

             ctrl.$parsers.push(checkSameName);
          }
        };
    }


angular
  .module('O2DigitalSite')
  .directive('sameOperationNameModal', sameOperationNameModal)
      
      function sameOperationNameModal (bsignServices) {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            var polObject = JSON.parse(attrs.sameOperationNameModal)
            function checkSameName (model) {
              var hasSameName = false;
              angular.forEach(bsignServices.getPolicyList(), function(value, key){
                if(model.toUpperCase() === value.policyName.toUpperCase() && polObject.id !== value.id){
                  ctrl.$setValidity('sameOperationNameModal', false);
                  hasSameName = true;
                  return;
                }
              });
              if(!hasSameName)
                ctrl.$setValidity('sameOperationNameModal', true);
            return model;
            }

             ctrl.$parsers.push(checkSameName);
          }
        };
    }