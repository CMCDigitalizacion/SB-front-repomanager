/**
 * 	Collection of filters.
 */

 angular.module('O2BioSigner').filter('docState', function() {
  return function(input) {
  	if(input === 0) return 'PENDIENTE'
    else return 'FIRMADO'
  };
});

angular.module('O2BioSigner').filter('docSignersNumber', function() {
  return function(input) {
    return input.length;
  };
});

angular.module('O2BioSigner').filter('cut', function () {
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