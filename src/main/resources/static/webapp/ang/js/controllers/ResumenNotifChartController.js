
angular.module('O2DigitalSite').controller('ResumenNotifChartController', ['$scope','$rootScope','$http','$window','$stateParams', 'tokenManager', function($scope, $rootScope, $http, $window, $stateParams, tokenManager) {

    $rootScope.$broadcast('rootChange', 'Informes / Notificaciones');


    $scope.serieTotales = new Array();
    $scope.serieEmail = new Array();
    $scope.serieSMS = new Array();
    $scope.fechas = new Array();
    $scope.init = function(domainid) {


        $http({
            method: 'GET',
            url:  'services/dashboard/resumennotif/'  + tokenManager.getDomainId(),
        }).success(function(data, status) {
            //alert( data.tiempos);
            //$scope.serie1=data.tiempos;
            // Populate series
            if( $scope.serieTotales.length > 0)
            	return;

            for (i = 0; i < data.totales.length; i++){
                $scope.serieTotales.push([data.totales[i].key, parseInt(data.totales[i].value)]);
            }
            for (i = 0; i < data.email.length; i++){
                $scope.serieEmail.push([data.email[i].key, parseInt(data.email[i].value)]);
            }
            for (i = 0; i < data.sms.length; i++){
                $scope.serieSMS.push([data.sms[i].key, parseInt(data.sms[i].value)]);
            }            
        }).error(function(data, status) {
            //alert("Error");
            // Some error occurred
        });


    };

    $scope.init();


    function millisecondsToTime(milli)
    {
        var milliseconds = milli % 1000;
        var seconds = Math.floor((milli / 1000) % 60);
        var minutes = Math.floor((milli / (60 * 1000)) % 60);

        return minutes + ":" + seconds + "." + milliseconds;
    }

//See: https://github.com/pablojim/highcharts-ng



        $scope.chartConfig = {
            chart: {
            	
                type: "bar"
            },
            title: {
                text: "Notificaciones por dia"
            },
            yAxis: {
         	   floor: 0,
            	tickInterval: 1,
                title: {
                    text: "Notificaciones"
                }
            },
            xAxis: [{
            	categories: 1,
            
                title: {
                    text: 'Fecha'
                }
            }
            ],
            series: [{
                data: $scope.serieTotales,
                name: 'Notificaciones Totales',

                color: 'green',
                tooltip: {
                    crosshairs: [true,true],
                    useHTML: true,
                    pointFormatter: function() {
                        return '<span style="color:{point.color}">\u25CF</span>'+this.y;
                    },
                    backgroundColor: {
                        linearGradient: [0, 0, 0, 60],
                        stops: [
                            [0, '#FFFFFF'],
                            [1, '#E0E0E0']
                        ]
                    },
                    borderWidth: 1,
                    borderColor: '#AAA'
                }

            },
            {
            	
                	type: 'bar',
                	data: $scope.serieEmail,
                	name: 'EMAIL',
                
                
                	color: 'red',
                    tooltip: {
                    	crosshairs: [true,true],
                    	useHTML: true,
                    	pointFormatter: function() {
                            return '<span style="color:{point.color}">\u25CF</span>'+ this.y;
                        },
                        backgroundColor: {
                            linearGradient: [0, 0, 0, 60],
                            stops: [
                                [0, '#FFFFFF'],
                                [1, '#E0E0E0']
                            ]
                        },
                        borderWidth: 1,
                        borderColor: '#AAA'
                    },

                },
                
                {
                	
                	type: 'bar',
                	data: $scope.serieSMS,
                	name: 'SMS',
                
                
                	color: 'blue',
                    tooltip: {
                    	crosshairs: [true,true],
                    	useHTML: true,
                    	pointFormatter: function() {
                            return '<span style="color:{point.color}">\u25CF</span>'+this.y ;
                        },
                        backgroundColor: {
                            linearGradient: [0, 0, 0, 60],
                            stops: [
                                [0, '#FFFFFF'],
                                [1, '#E0E0E0']
                            ]
                        },
                        borderWidth: 1,
                        borderColor: '#AAA'
                    },

                }                
                
            ]

        }





}]);