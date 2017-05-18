
angular
      .module('O2DigitalSite')
      .directive('checkName', sameNameDirFunction)
      

      function sameNameDirFunction (domainServices) {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            function checkSameName (model) {
              var hasSameName = false;
              angular.forEach(domainServices.getOperationList(), function(value, key){
                if(model.toUpperCase() === value.name.toUpperCase()){
                  ctrl.$setValidity('sameName', false);
                  hasSameName = true;
                  return;
                }
              });
              if(!hasSameName)
                ctrl.$setValidity('sameName', true);
            return model;
            }

             ctrl.$parsers.push(checkSameName);
          }
        };
    }

angular
      .module('O2DigitalSite')
      .directive('checkUsername', sameUsernameFunction)
      

      function sameUsernameFunction (domainServices) {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            var userObject = JSON.parse(attrs.checkUsername)
            var idUserSelected = userObject.id;
            function checkSameUsername (model) {
              var hasSameName = false;
              angular.forEach(domainServices.getUserList(), function(value, key){
                if(model.toUpperCase() === value.username.toUpperCase() && value.id !== idUserSelected){
                  ctrl.$setValidity('checkUsername', false);
                  hasSameName = true;
                  return;
                }
              });
              if(!hasSameName)
                ctrl.$setValidity('checkUsername', true);
            return model;
            }

             ctrl.$parsers.push(checkSameUsername);
          }
        };
    }

angular
      .module('O2DigitalSite')
      .directive('checkUseremail', sameUseremailFunction)
      

      function sameUseremailFunction (domainServices) {
        return {
          require: 'ngModel',
          restrict: '',
          link: function(scope, elm, attrs, ctrl) {
            var userObject = JSON.parse(attrs.checkUseremail);
            var idUserSelected = userObject.id;
            // only apply the validator if ngModel is present and Angular has added the email validator
            function checkSameUseremail (model) {
              var hasSameName = false;
              angular.forEach(domainServices.getUserList(), function(value, key){
                if(model.toUpperCase() === value.useremail.toUpperCase() && value.id !== idUserSelected){
                  ctrl.$setValidity('checkUseremail', false);
                  hasSameName = true;
                  return;
                }
              });
              if(!hasSameName)
                ctrl.$setValidity('checkUseremail', true);
            return model;
            }

             ctrl.$parsers.push(checkSameUseremail);
          }
        };
    }

angular
    .module('O2DigitalSite')
    .directive('samePass', samePassName)


    function samePassName ($parse) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {

          function checkSamePass (model, p) {
              var firstPassword = attrs.samePass;
              if (firstPassword !== '' && model === firstPassword)
                ctrl.$setValidity('samePass', true);
              else if(!ctrl.$$parentForm.pass.$dirty)
                ctrl.$setValidity('samePass', true);
              else
                ctrl.$setValidity('samePass', false);
              return model;
          }

          attrs.$observe('samePass', function(model){
            return checkSamePass(ctrl.$viewValue);
          });

           ctrl.$parsers.push(checkSamePass);
        }
      };
    }


angular
    .module('O2DigitalSite')
    .directive('sameCaname', sameCaname)

    function sameCaname (domainServices) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {

          function checkSameCaName (model) {
            var hasSameCaName = false;
            angular.forEach(domainServices.getAllowedCaList(), function (ca, index) {
              if (ca.name.toUpperCase() === model.toUpperCase()){
                hasSameCaName = true;
                ctrl.$setValidity('sameCaname', false);
                return;
              }

            })

             if(!hasSameCaName)
                ctrl.$setValidity('sameCaname', true);
            return model;
        }
        ctrl.$parsers.push(checkSameCaName);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('sameCanameModal', sameCanameModal)

    function sameCanameModal (domainServices, $parse) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          var idCaObject = JSON.parse(attrs.sameCanameModal).id;
          function checkSameCaNameModal (model) {
            var hasSameCaName = false;
            angular.forEach(domainServices.getAllowedCaList(), function (ca, index) {
              if (ca.name.toUpperCase() === model.toUpperCase() && ca.id !== idCaObject){
                hasSameCaName = true;
                ctrl.$setValidity('sameCanameModal', false);
                return;
              }

            })

             if(!hasSameCaName)
                ctrl.$setValidity('sameCanameModal', true);
            return model;
        }
        ctrl.$parsers.push(checkSameCaNameModal);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('sameCommonName', sameCommonName)

    function sameCommonName (domainServices) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {

          function checkSameCommonName (model) {
            var hasSameCommonName = false;
            angular.forEach(domainServices.getAllowedCaList(), function (ca, index) {
              if (angular.isDefined(ca.cn) && ca.cn !== null && ca.cn.toUpperCase() === model.toUpperCase()){
                hasSameCommonName = true;
                ctrl.$setValidity('sameCommonName', false);
                return;
              }

            })

             if(!hasSameCommonName)
                ctrl.$setValidity('sameCommonName', true);
            return model;
        }
        ctrl.$parsers.push(checkSameCommonName);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('sameCommonNameModal', sameCommonNameModal)

    function sameCommonNameModal (domainServices) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          var idCaObject = JSON.parse(attrs.sameCommonNameModal).id;
          function checkSameCommonNameModal (model) {
            var hasSameCommonName = false;
            angular.forEach(domainServices.getAllowedCaList(), function (ca, index) {
              if (angular.isDefined(ca.cn) && ca.cn !== null && ca.cn.toUpperCase() === model.toUpperCase() && idCaObject !== ca.id){
                hasSameCommonName = true;
                ctrl.$setValidity('sameCommonNameModal', false);
                return;
              }

            })

             if(!hasSameCommonName)
                ctrl.$setValidity('sameCommonNameModal', true);
            return model;
        }
        ctrl.$parsers.push(checkSameCommonNameModal);
      }
    }
  }


  angular
    .module('O2DigitalSite')
    .directive('sameTemplateName', sameTemplateName)

    function sameTemplateName (domainServices) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {

          function checkSameTemplateName (model) {
            var hasSameCommonName = false;
            angular.forEach(domainServices.getActasList(), function (actaObject, index) {
              if (actaObject.name !== null && actaObject.name.toUpperCase() === model.toUpperCase()){
                hasSameCommonName = true;
                ctrl.$setValidity('sameTemplateName', false);
                return;
              }

            })

             if(!hasSameCommonName)
                ctrl.$setValidity('sameTemplateName', true);
            return model;
        }
        ctrl.$parsers.push(checkSameTemplateName);
      }
    }
  }


  angular
    .module('O2DigitalSite')
    .directive('onlyNumbers', onlyNumbers)

    function onlyNumbers (domainServices) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          function onlyNumbers (model) {
              if (/^\d+$/.test(model)){
                ctrl.$setValidity('onlyNumbers', true);
              } else{
                ctrl.$setValidity('onlyNumbers', false);
              }

            return model;
        }
        ctrl.$parsers.push(onlyNumbers);
      }
    }
  }


  angular
    .module('O2DigitalSite')
    .directive('sameTemplateNameModal', sameTemplateNameModal)

    function sameTemplateNameModal (domainServices) {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          var idTemplateObject = JSON.parse(attrs.sameTemplateNameModal).id; 
          function checkSameTemplateNameModal (model) {
            var hasSameCommonName = false;
            angular.forEach(domainServices.getActasList(), function (actaObject, index) {
              if (actaObject.name !== null && actaObject.name.toUpperCase() === model.toUpperCase() && actaObject.id !== idTemplateObject){
                hasSameCommonName = true;
                ctrl.$setValidity('sameTemplateNameModal', false);
                return;
              }

            })

             if(!hasSameCommonName)
                ctrl.$setValidity('sameTemplateNameModal', true);
            return model;
        }
        ctrl.$parsers.push(checkSameTemplateNameModal);
      }
    }
  }


  angular
    .module('O2DigitalSite')
    .directive('sameLabelBio', sameLabelBio)

    function sameLabelBio (domainServices) {
      return {
        require: 'ngModel',
        restrict: '',
        scope: {
          indexAttr: '@'
        },
        link: function(scope, elm, attrs, ctrl) {
          function checkSameLabelBio (model) {
            var signers = JSON.parse(attrs.sameLabelBio);
            var indexAttr = parseInt(scope.indexAttr);
            var hasSameCommonName = false;
            angular.forEach(signers, function(signer, index) {
              if(model !== '' && signer.label.toLowerCase() === model.toLowerCase() && index !== indexAttr){
                hasSameCommonName = true;
                ctrl.$setValidity('sameLabelBio', false);
                return;
              }
            })
            
             if(!hasSameCommonName)
                ctrl.$setValidity('sameLabelBio', true);
            return model;
          }

          attrs.$observe('sameLabelBio', function(model){
            return checkSameLabelBio(ctrl.$viewValue);
          });
        ctrl.$parsers.push(checkSameLabelBio);
      }
    }
  }


 angular
    .module('O2DigitalSite')
    .directive('validFile',function(){
  return {
    require:'ngModel',
    link:function(scope,el,attrs,ngModel){
      //change event is fired when file is selected
      el.bind('change',function(){
        scope.$apply(function(){
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        })
      })
    }
  }
})