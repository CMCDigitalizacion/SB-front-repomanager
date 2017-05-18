angular
    .module('O2DigitalSite')
    .directive("preventParentScroll", function () {
    return {
        restrict: "A",
        scope: false,
        link: function (scope, elm, attr) {
            elm.bind('mousewheel', onMouseWheel);
            function onMouseWheel(e) {
                elm[0].scrollTop -= (e.originalEvent.wheelDeltaY || e.originalEvent.wheelDelta || 0);
                e.stopPropagation();
                e.preventDefault();
                e.returnValue = false;
            }
        }
    }
});

angular
      .module('O2DigitalSite')
      .directive('globalEvents', function($rootScope) {
          return function(scope, element, attrs) {
              element.bind('click', function(e){
                $rootScope.$broadcast('closeMenu');
            })
          }
      })

angular
      .module('O2DigitalSite')
      .directive('checkLengthPass', checkLengthPass)
      
      function checkLengthPass () {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            function checkLength (model) {
                if(scope.checkIfAltering()){
                  if(model.length < 6){
                    ctrl.$setValidity('checkLengthPass', false);
                    scope.numberOfPendingsChars = ( 6 - model.length);
                  }
                  else
                    ctrl.$setValidity('checkLengthPass', true);
                } else if(!scope.checkIfAltering() && model.length === 0){
                  ctrl.$setValidity('checkLengthPass', true);
                } else if(!scope.checkIfAltering() && model.length > 0){
                  if(model.length < 6){
                    ctrl.$setValidity('checkLengthPass', false);
                    scope.numberOfPendingsChars = ( 6 - model.length);
                  }
                  else
                    ctrl.$setValidity('checkLengthPass', true);
                }
              	
        		return model;
            }

             ctrl.$parsers.push(checkLength);
          }
        };
    }

    angular
      .module('O2DigitalSite')
      .directive('checkUniqueRefBio', checkUniqueRefBio)
      
      function checkUniqueRefBio (domainServices) {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            function checkUniqueRefBio (model) {
              var idDocumentSelected = attrs.checkUniqueRefBio;
              var yetExists = false;
              var toCheck = 'BIO '.concat(model)
              angular.forEach(domainServices.getBioDocsList(), function(bioDoc, index) {
                  if(bioDoc.reference === toCheck && (angular.isUndefined(idDocumentSelected) || bioDoc.id !== parseInt(idDocumentSelected))){
                    yetExists = true;
                  }
              })

              if(yetExists){
                ctrl.$setValidity('checkUniqueRefBio', false);
              } else{
                ctrl.$setValidity('checkUniqueRefBio', true);
              }
              return model;
            }
             ctrl.$parsers.push(checkUniqueRefBio);
          }
        };
    }


    angular
      .module('O2DigitalSite')
      .directive('checkUniqueRefStaticBio', checkUniqueRefStaticBio)
      
      function checkUniqueRefStaticBio (domainServices) {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            function checkUniqueRefStaticBio (model) {
              var idDocumentSelected = attrs.checkUniqueRefStaticBio;
              var yetExists          = false;
              var toCheckStaticBio   = 'STATIC BIO '.concat(model);
              var toCheckStatic      = 'STATIC '.concat(model)
              angular.forEach(domainServices.getBioDocsList(), function(bioDoc, index) {
                  if((bioDoc.reference === toCheckStaticBio || bioDoc.reference === toCheckStatic) && (angular.isUndefined(idDocumentSelected) || bioDoc.id !== parseInt(idDocumentSelected))){
                    yetExists = true;
                  }
              })

              if(yetExists){
                ctrl.$setValidity('checkUniqueRefStaticBio', false);
              } else{
                ctrl.$setValidity('checkUniqueRefStaticBio', true);
              }
              return model;
            }
             ctrl.$parsers.push(checkUniqueRefStaticBio);
          }
        };
    }


    

angular
      .module('O2DigitalSite')
      .directive('validateSender', validateSender)
      
      function validateSender () {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            function validateSender (model) {
              var onlyAlfaNumeric = /^[a-zA-Z0-9]+$/.test(model)
              if(!onlyAlfaNumeric || model.length > 11){
                ctrl.$setValidity('validateSender', false);
              } else{
                ctrl.$setValidity('validateSender', true);
              }
                
              return model;
            }

             ctrl.$parsers.push(validateSender);
          }
        };
      }

angular
      .module('O2DigitalSite')
      .directive('checkLowerCase', checkLowerCase)
      
      function checkLowerCase () {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            function checkLowerCase (model) {
            	var hasLowerCase = /[a-z]/.test(model)
              if(scope.checkIfAltering()){
                if(!hasLowerCase)
                  ctrl.$setValidity('checkLowerCase', false);
                else
                  ctrl.$setValidity('checkLowerCase', true);
              } else if(!scope.checkIfAltering() && model.length === 0){
                ctrl.$setValidity('checkLowerCase', true);
              } else if(!scope.checkIfAltering() && model.length > 0){
                if(!hasLowerCase)
                  ctrl.$setValidity('checkLowerCase', false);
                else
                  ctrl.$setValidity('checkLowerCase', true);
              }
              	
        		return model;
            }

             ctrl.$parsers.push(checkLowerCase);
              }
          };
    }

 angular
      .module('O2DigitalSite')
      .directive('checkUpperCase', checkUpperCase)
      
      function checkUpperCase () {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            function checkUpperCase (model) {
            	var hasUpperCase = /[A-Z]/.test(model)
              if(scope.checkIfAltering()){
                if(!hasUpperCase)
                  ctrl.$setValidity('checkUpperCase', false);
                else
                  ctrl.$setValidity('checkUpperCase', true);
              } else if(!scope.checkIfAltering() && model.length === 0){
                  ctrl.$setValidity('checkUpperCase', true);
              } else if(!scope.checkIfAltering() && model.length > 0){
                if(!hasUpperCase)
                  ctrl.$setValidity('checkUpperCase', false);
                else
                  ctrl.$setValidity('checkUpperCase', true);
              }
              	
        		return model;
            }

             ctrl.$parsers.push(checkUpperCase);
          }
        };
    }

angular
      .module('O2DigitalSite')
      .directive('checkDigit', checkDigit)
      
      function checkDigit () {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            function checkDigit (model) {
            	var hasDigit = /[0-9]/.test(model)
              if(scope.checkIfAltering()){
                if(!hasDigit)
                  ctrl.$setValidity('checkDigit', false);
                else
                  ctrl.$setValidity('checkDigit', true);
              } else if(!scope.checkIfAltering() && model.length === 0){
                ctrl.$setValidity('checkDigit', true);
              } else if(!scope.checkIfAltering() && model.length > 0){
                if(!hasDigit)
                  ctrl.$setValidity('checkDigit', false);
                else
                  ctrl.$setValidity('checkDigit', true);
              }
              	
        		return model;
            }

             ctrl.$parsers.push(checkDigit);
          }
        };
    }

angular
    .module('O2DigitalSite')
    .directive('samePassSuper', samePassSuper)


    function samePassSuper ($parse) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {

          function checkSamePassSuper (model, p) {
              var firstPassword = attrs.samePassSuper;
              if(scope.checkIfAltering()){
                if (firstPassword !== '' && model === firstPassword)
                ctrl.$setValidity('samePassSuper', true);
              else if(!ctrl.$$parentForm.pass.$dirty)
                ctrl.$setValidity('samePassSuper', true);
              else
                ctrl.$setValidity('samePassSuper', false);
              } else {
                if (model === firstPassword)
                ctrl.$setValidity('samePassSuper', true);
              else if(!ctrl.$$parentForm.pass.$dirty)
                ctrl.$setValidity('samePassSuper', true);
              else
                ctrl.$setValidity('samePassSuper', false);
              }
              
              return model;
          }

          attrs.$observe('samePassSuper', function(model){
            return checkSamePassSuper(ctrl.$viewValue);
          });

           ctrl.$parsers.push(checkSamePassSuper);
        }
      }
    }