angular.module('O2DigitalSite').controller('FunnelOpChartController', ['$scope','$rootScope','$http','$window','$stateParams', 'Idle', 'tokenManager', function($scope, $rootScope, $http, $window, $stateParams, Idle, tokenManager) {

    
    $rootScope.$broadcast('rootChange', 'Informes / Resumen');

    $scope.serieTotales = new Array();
    
    $scope.init = function() {

        $http({
            method: 'GET',
            url: "services/dashboard/funneldata/" + tokenManager.getDomainId()
        }).success(function(data, status) {
            //alert( data.tiempos);
            //$scope.serie1=data.tiempos;
            // Populate series
            if( $scope.serieTotales.length > 0)
            	return;
            $scope.serieTotales.push([data[0].key, parseInt(data[0].value)]);
            $scope.serieTotales.push([data[1].key, parseInt(data[1].value)]);
            $scope.serieTotales.push([data[2].key, parseInt(data[2].value)]);
            $scope.serieTotales.push([data[3].key, parseInt(data[3].value)]);
            
           // alert(JSON.stringify($scope.serieTotales));
            
        }).error(function(data, status) {
            //alert("Error");
            // Some error occurred
        });
      

    };

    // $scope.init();




        $scope.chartConfig = {
                chart: {
                    type: 'bar',
                    marginRight: 100
                },
                title: {
                    text: ' Resumen de operaciones',
                    x: -50
                },
                plotOptions: {
                    series: {
                    	
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b> ({point.y:,.0f})',
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            softConnector: true
                        },
                        neckWidth: '30%',
                        neckHeight: '45%'

                        //-- Other available options
                        // height: pixels or percent
                        // width: pixels or percent
                    }
                },
                legend: {
                    enabled: false
                },
            series: [{
            	type: 'funnel',
                data: $scope.serieTotales,
                name: ' Totales'

                

                } ]

        }





}]);