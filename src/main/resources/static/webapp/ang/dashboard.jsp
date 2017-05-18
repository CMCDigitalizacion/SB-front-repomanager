<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://s3.amazonaws.com/codecademy-content/projects/bootstrap.min.css" rel="stylesheet" />

    <!-- Include the AngularJS library -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.5/angular.min.js"></script>
    <script src="http://maps.google.com/maps/api/js"></script>
    <script src="http://rawgit.com/allenhwkim/angularjs-google-maps/master/build/scripts/ng-map.min.js"></script>
    <script src="<%=request.getContextPath() %>/ang/js/shared/highcharts.js"></script>
    <script src="<%=request.getContextPath() %>/ang/js/shared/highcharts-ng.js"></script>

   <script>
       window.idusuario = '<%= (String) request.getSession().getAttribute("Id_Usuario") %>';
       window.usuario='<%= (String) request.getSession().getAttribute("Nombre_Usuario") %>';
   </script>

</head>
<body ng-app="chartsApp">

<div class="main" ng-controller="MisRodadasController">

 
    <div class="container">
        <div class="row">
		<h3>Mi última rodada: {{cabecera.circuito}}</h3>
		<h3>{{cabecera.fechaFmt}}</h3>

		<div ng-controller="UltimaRodadaChartController">
			<highchart config="chartConfig"></highchart>
		</div>
        </div>
        </ul>
    </div>
    <div class="col-sm-12">

    </div>


</div>
<div class="main col-sm-12"  ng-controller="TodasMisRodadasController">

 
    <div class="container" ng-repeat="circuito in circuitos"  ng-model="circuito" >
        <div class="col-sm-6">
		<h3>{{circuito.circuito}}</h3>
		

		<div ng-controller="HighChartController2">
			<highchart config="chartConfig"></highchart>
		</div>
        </div>
        </ul>
    </div>
    <div class="col-sm-12">

    </div>


</div>
<!-- Modules -->
<script src="<%=request.getContextPath() %>/ang/js/app2.js"></script>

<!-- Controllers -->
    <script src="<%=request.getContextPath() %>/ang/js/controllers/MisRodadasController.js"></script>
    <script src="<%=request.getContextPath() %>/ang/js/controllers/TodasMisRodadasController.js"></script>
    <script src="<%=request.getContextPath() %>/ang/js/controllers/UltimaRodadaChartController.js"></script>
<script src="<%=request.getContextPath() %>/ang/js/controllers/HighChartController2.js"></script>

<!-- Services -->


<!-- Directives -->

<script>

 </script>

</body>
</html>
