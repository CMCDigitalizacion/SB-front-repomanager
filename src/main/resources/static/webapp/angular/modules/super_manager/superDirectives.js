
angular
      .module('O2DigitalSite')
      .directive('domainExist', sameDomainName)
      

      function sameDomainName (superUtilities) {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            function checkSameName (model) {
              var hasSameName = false;
              angular.forEach(superUtilities.getDomainsList(), function(value, key){
                if(model.toUpperCase() === value.domainName.toUpperCase()){
                  ctrl.$setValidity('sameDomainName', false);
                  scope.domainExistMessage = 'El dominio con nombre: "' + value.domainName + '" ya existe.'
                  hasSameName = true;
                  return;
                }
              });
              if(!hasSameName)
                ctrl.$setValidity('sameDomainName', true);
            return model;
            }

             ctrl.$parsers.push(checkSameName);
          }
        };
    }