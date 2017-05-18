angular
    .module('O2DigitalSite')
    .directive('dynamicDirective',function($compile){
    return {
        restrict: 'A',
        replace: false, 
        terminal: true, 
        priority: 1000, 
        link:function(scope,element,attrs){

          element.attr(scope.$eval(attrs.dynamicDirective),"");//add dynamic directive

          element.removeAttr("dynamic-directive"); //remove the attribute to avoid indefinite loop
          element.removeAttr("data-dynamic-directive");

          $compile(element)(scope);
        }
    };
  });


  angular
    .module('O2DigitalSite')
    .directive('validateNif', validateNif)

    function validateNif () {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          function validateNifModel (model) {

            var fromDomain = scope.$eval(attrs.fromDomain);

            NIF_Letters = "TRWAGMYFPDXBNJZSQVHLCKET";
            NIF_regExp = "^\\d{8}[a-zA-Z]{1}$";
            CIF_regExp = "^[a-zA-Z]{1}\\d{7}[a-jA-J0-9]{1}$";

            if(angular.isUndefined(fromDomain) || !fromDomain){
              if(checkNIF(model)) { // Comprueba el NIF
                ctrl.$setValidity('validateNif', true);
                return model;
              } else if(checkCIF(model)){
                  ctrl.$setValidity('validateNif', true);
                  return model;
              } else  {           // Si no pasa por ninguno es false.
                  ctrl.$setValidity('validateNif', false);
                  return model;
              }
            } else {
              if (model.length > 0) {
                if(checkNIF(model)) { // Comprueba el NIF
                  ctrl.$setValidity('validateNif', true);
                  return model;
                } else if(checkCIF(model)){
                    ctrl.$setValidity('validateNif', true);
                    return model;
                } else  {           // Si no pasa por ninguno es false.
                    ctrl.$setValidity('validateNif', false);
                    return model;
                }
              } else {
                ctrl.$setValidity('validateNif', true);
              }
            }
            

            // VALIDA EL NIF
            function checkNIF (nif) {
              // Comprueba la longitud. Los DNI antiguos tienen 7 digitos.
              if ((nif.length != 8 ) && (nif.length != 9)) return false;
              if (nif.length == 8 ) nif = '0' + nif; // Ponemos un 0 a la izquierda y solucionado
              
              // Comprueba el formato
              var regExp=new RegExp(NIF_regExp);
              if (!nif.match(regExp)) return false;

              var letter = nif.charAt(nif.length-1);
              var dni = nif.substring(0,nif.length-1)
              var letra = NIF_Letters.charAt(dni % 23);
              return (letra==letter.toUpperCase());
            }

            function checkCIF (cif) {
              var v1 = new Array(0,2,4,6,8,1,3,5,7,9);
              var tempStr = cif.toUpperCase(); // pasar a mayúsculas
              var temp = 0;
              var temp1;
              var dc;

              // Comprueba el formato
                      var regExp=new RegExp(this.CIF_regExp);
              if (!tempStr.match(regExp)) return false;    // Valida el formato?
              if (!/^[ABCDEFGHKLMNPQS]/.test(tempStr)) return false;  // Es una letra de las admitidas ?

              for( i = 2; i <= 6; i += 2 ) {
                      temp = temp + v1[ parseInt(cif.substr(i-1,1)) ];
                      temp = temp + parseInt(cif.substr(i,1));
              };
              temp = temp + v1[ parseInt(cif.substr(7,1)) ];
              temp = (10 - ( temp % 10));
              if (temp==10) temp=0;
              dc  = cif.toUpperCase().charAt(8);
              return (dc==temp) || (temp==1 && dc=='A') || (temp==2 && dc=='B') || (temp==3 && dc=='C') || (temp==4 && dc=='D') || (temp==5 && dc=='E') || (temp==6 && dc=='F') || (temp==7 && dc=='G') || (temp==8 && dc=='H') || (temp==9 && dc=='I') || (temp==0 && dc=='J');
            }

            return model;
        }
        ctrl.$parsers.push(validateNifModel);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('validateNullNif', validateNullNif)

    function validateNullNif () {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          function validateNifModel (model) {

            NIF_Letters = "TRWAGMYFPDXBNJZSQVHLCKET";
            NIF_regExp = "^\\d{8}[a-zA-Z]{1}$";
            CIF_regExp = "^[a-zA-Z]{1}\\d{7}[a-jA-J0-9]{1}$";

            if(checkNIF(model) || model === '') { // Comprueba el NIF
                ctrl.$setValidity('validateNullNif', true);
                return model;
            } else if(checkCIF(model) || model === ''){
                ctrl.$setValidity('validateNullNif', true);
                return model;
            } else  {           // Si no pasa por ninguno es false.
                ctrl.$setValidity('validateNullNif', false);
                return model;
            }

            // VALIDA EL NIF
            function checkNIF (nif) {
              // Comprueba la longitud. Los DNI antiguos tienen 7 digitos.
              if ((nif.length != 8 ) && (nif.length != 9)) return false;
              if (nif.length == 8 ) nif = '0' + nif; // Ponemos un 0 a la izquierda y solucionado
              
              // Comprueba el formato
              var regExp=new RegExp(NIF_regExp);
              if (!nif.match(regExp)) return false;

              var letter = nif.charAt(nif.length-1);
              var dni = nif.substring(0,nif.length-1)
              var letra = NIF_Letters.charAt(dni % 23);
              return (letra==letter.toUpperCase());
            }

            function checkCIF (cif) {
              var v1 = new Array(0,2,4,6,8,1,3,5,7,9);
              var tempStr = cif.toUpperCase(); // pasar a mayúsculas
              var temp = 0;
              var temp1;
              var dc;

              // Comprueba el formato
                      var regExp=new RegExp(this.CIF_regExp);
              if (!tempStr.match(regExp)) return false;    // Valida el formato?
              if (!/^[ABCDEFGHKLMNPQS]/.test(tempStr)) return false;  // Es una letra de las admitidas ?

              for( i = 2; i <= 6; i += 2 ) {
                      temp = temp + v1[ parseInt(cif.substr(i-1,1)) ];
                      temp = temp + parseInt(cif.substr(i,1));
              };
              temp = temp + v1[ parseInt(cif.substr(7,1)) ];
              temp = (10 - ( temp % 10));
              if (temp==10) temp=0;
              dc  = cif.toUpperCase().charAt(8);
              return (dc==temp) || (temp==1 && dc=='A') || (temp==2 && dc=='B') || (temp==3 && dc=='C') || (temp==4 && dc=='D') || (temp==5 && dc=='E') || (temp==6 && dc=='F') || (temp==7 && dc=='G') || (temp==8 && dc=='H') || (temp==9 && dc=='I') || (temp==0 && dc=='J');
            }

            return model;
        }
        ctrl.$parsers.push(validateNifModel);
      }
    }
  }


  angular
    .module('O2DigitalSite')
    .directive('validatePhone', validatePhone)

    function validatePhone () {  
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          function validatePhoneModel (model) {

            var fromDomain = scope.$eval(attrs.fromDomain)
            if(angular.isUndefined(fromDomain) || !fromDomain){
              ctrl.$setValidity('validatePhone', validate(model));
            } else {
              if(model.length > 0)
                ctrl.$setValidity('validatePhone', validate(model));
              else
                ctrl.$setValidity('validatePhone', true);
            }
            

            function validate(value){
              var str = value.toString().replace(/\s/g, '');
              return /^[+]?\d+$/.test(str);
            }

            return model;
        }
        ctrl.$parsers.push(validatePhoneModel);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('validateNullPhone', validateNullPhone)

    function validateNullPhone () {  
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          function validateNullPhone (model) {

            ctrl.$setValidity('validateNullPhone', validate(model));

            function validate(value){
              var str = value.toString().replace(/\s/g, '');
              return (/^[+]?\d+$/.test(str) || value === '');
            }

            return model;
        }
        ctrl.$parsers.push(validateNullPhone);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('validateEmail', validateEmail)

    function validateEmail () {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          function validateEmailModel (model) {

            ctrl.$setValidity('validateEmail', validate(model));

            function validate(email) {
              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(email);
            }

            return model;
        }
        ctrl.$parsers.push(validateEmailModel);
      }
    }
  }

  angular
    .module('O2DigitalSite')
    .directive('validateNullEmail', validateNullEmail)

    function validateNullEmail () {
      return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
          function validateNullEmail (model) {

            ctrl.$setValidity('validateNullEmail', validate(model));

            function validate(email) {
              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return (re.test(email) || email === '');
            }

            return model;
        }
        ctrl.$parsers.push(validateNullEmail);
      }
    }
  }