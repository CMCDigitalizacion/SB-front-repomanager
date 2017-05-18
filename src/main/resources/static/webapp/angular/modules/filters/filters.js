/**
 * 	Collection of filters.
 */

 angular.module('O2DigitalSite').filter('role', function() {
  return function(input) {
    if      (input === 0)  return 'VIDEO';
    else if (input === -1) return 'SUPERVISOR';
  	else if (input === -2) return 'VISOR';
  	else if (input === -3) return 'FIRMANTE';
    else if (input === 1)  return 'NORMAL';
    else if (input === 2)  return 'ADMIN';
    else if (input === 3)  return 'SUPER';
    else                   return '---';
  };
});

angular.module('O2DigitalSite').filter('batchesState', function() {
  return function(input) {
    if      (input === 0) return 'PENDIENTE';
    else if (input === 1) return 'BLOQUEADO';
    else if (input === 2) return 'FIRMADO';
    else if (input === 3) return 'RECHAZADO'
  };
});

angular.module('O2DigitalSite').filter('booleanAsString', function() {
  return function(input) {
    if (input === true) return 'SI';
    else return 'NO'
  };
});

angular.module('O2DigitalSite').filter('operationVideoState', function() {
    return function(input) {
        if      (input === 'ARCHIVING')        return 'GRABANDO'   ;
        else if (input === 'VERIFIED')         return 'VERIFICADO' ;
        else if (input === 'ARCHIVED')         return 'PENDIENTE'  ;
        else if (input === 'REJECTED')         return 'RECHAZADO'  ;
        else if (input === 'VIDEOCONF_PEDIDA') return 'SOLICITADA' ;
        else if (input === 'VIDEOCONF_AHORA')  return 'EN PROGRESO';
        else if (input === 'VIDEOCONF_FIN')    return 'TERMINADA'  ;
        else                                   return '----'       ;
    };
});

angular.module('O2DigitalSite').filter('operationVideoConferenceState', function() {
    return function(input) {
        if (input      === 'VIDEOCONF_PEDIDA') return 'SOLICITADA';
        else if (input === 'VIDEOCONF_ATENDIDA') return 'ATENDIDA';
        else if (input === 'VIDEOCONF_FIN') return 'TERMINADA';
        else if (input === 'VERIFIED') return 'VERIFICADA';
        else if (input === 'REJECTED')         return 'RECHAZADA' ;
        else if (input === 'EXPIRED')         return 'EXPIRED'  ;
        else if (input === 'VIDEOCONF_AHORA')         return 'EN PROGRESO'  ;
        else return '----';
    };
});


angular.module('O2DigitalSite').filter('binaryToYesNo', function() {
  return function(input) {
    if (input === 0) return 'NO';
    else return 'SI'
  };
});

angular.module('O2DigitalSite').filter('stateFilter', function() {
  return function(input) {
    if (input >= 0) return 'ACTIVO';
    else if(input < 0) return 'INACTIVO';
  };
});

angular.module('O2DigitalSite').filter('signTypeFilter', function() {
  return function(input) {
    if      (input === 'AVANZADA_VIDEO')    return 'AVANZADA CON VIDEO'        ;
    else if (input === 'SIMPLE_MULTIPLE')   return 'SIMPLE MULTIPLE'           ;
    else if (input === 'SINFIRMA')          return 'SIN FIRMA'                 ;
    else if (input === 'AVANZADA_MULTIPLE') return 'AVANZADA MULTIPLE'         ;
    else if (input === 'VIDEOCONFERENCIA')  return 'AVANZADA VIDEOCONFERENCIA' ;
    else                                    return input                       ;
  };
});

angular.module('O2DigitalSite').filter('actionMethodFilter', function(CUObject) {
  return function(input) {
    var stringLabel;
    angular.forEach(CUObject.getAuthActionArrayObject(), function(method, index) {
      if (method.action === input) {
        stringLabel = method.label;
        return stringLabel;
      }
    })
    return stringLabel;
  };
});



angular.module('O2DigitalSite').filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

angular.module('O2DigitalSite').filter('statusCount', function () {
	 return function(input, value, state) {
	     var i = 0;
	     angular.forEach(value.lstSubOperation, function(operation, index){
	    	 if(operation.state === state){
	    		 i++;
	    	 }
	     });
	     return i;
	    };
});


angular.module('O2DigitalSite').filter('groupFilter', function($rootScope) {
	  return function(input) {
		  var stringLabel;
		    angular.forEach($rootScope.usersgroupsListTab, function(group, index) {
		      if (group.id === parseInt(input)) {
		        stringLabel = group.groupName;
		        return stringLabel;
		      }
		    })
		    return stringLabel;
	  };
	});

angular.module('O2DigitalSite').filter('filterReferenceType', function($rootScope) {
    return function(input) {
      if (input.startsWith('STATIC ') && !input.startsWith('STATIC BIO ')) {
        return 'Estático'
      } else if (input.startsWith('BIO ')) {
        return 'Biométrico'
      } else if (input.startsWith('STATIC BIO ')) {
        return 'Estático/Biométrico'
      }
    };
  });

angular.module('O2DigitalSite').filter('filterSigners', function($rootScope) {
    return function(input, referenceValue) {
      if (referenceValue.startsWith('BIO ') || referenceValue.startsWith('STATIC BIO ')) {
        return ''+input;
      } else if (referenceValue.startsWith('STATIC')) {
        return '-'
      }
    };
  });

angular.module('O2DigitalSite').filter('durationTimeFilter', function($rootScope) {
    return function(input) {
      if (angular.isDefined(input) && !angular.isNull(input)) {
        var tempTime = moment.duration(input);
        return tempTime.minutes() + 'm' + tempTime.seconds() + 's';
      } else {
        return '---'
      }
    };
  });

angular.module('O2DigitalSite').filter('setRightMandatory', function() {
    return function(input, docType) {
        if(docType.signorupload === 0){
          if(docType.uploadMandatory)
            return 'SI';
          else
            return 'NO';
        } else if(docType.signorupload === 1){
          if(docType.mandatory)
            return 'SI';
          else
            return 'NO';
        } else 
          return '-';
    };
  });