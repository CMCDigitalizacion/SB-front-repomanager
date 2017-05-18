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
<style>
.odd {
  background-color: gray;
}
.even {
  background-color: white;
}
</style>

</head>
<body ng-app="chartsApp">

<div class="main" ng-controller="MainController">

 	<input type="hidden" ng-model="idusuario" value='<%= (String) request.getSession().getAttribute("Id_Usuario") %>' />
	<input type="hidden" ng-model="usuario" value='<%= (String) request.getSession().getAttribute("Nombre_Usuario") %>' />
 
    <div class="container">
        <div class="row">


        </div>
        </ul>
    </div>
    <div class="col-sm-12">
    <div   ng-repeat="circuito in circuitos">
      <div ng-class-odd="odd" ng-class-even="even" >
        <div class="col-sm-7">
        <ranking-info info="circuito" ></ranking-info>
        </div>
        <div class="col-sm-5" data-ng-include="'/LapTracker/ang/partial/chart.html'"></div>
     
	  </div>
    </div>
    </div>


</div>

<!-- Modules -->
<script src="<%=request.getContextPath() %>/ang/js/app2.js"></script>

<!-- Controllers -->
    <script src="<%=request.getContextPath() %>/ang/js/controllers/MainController.js"></script>
<script src="<%=request.getContextPath() %>/ang/js/controllers/CircuitoController.js"></script>
<script src="<%=request.getContextPath() %>/ang/js/controllers/HighChartController.js"></script>

<!-- Services -->
    <script src="<%=request.getContextPath() %>/ang/js/services/forecast.js"></script>
    <script src="<%=request.getContextPath() %>/ang/js/services/circuitos.js"></script>


<!-- Directives -->
    <script src="<%=request.getContextPath() %>/ang/js/directives/ranking.js"></script>

<script>

 </script>

</body>
</html>
