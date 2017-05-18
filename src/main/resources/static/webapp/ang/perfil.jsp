<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css"> 
    <script src= "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.16/angular.min.js"></script> 
    <link rel="stylesheet" href="../gc/css/fileinput.css" type="text/css"/>
    <script src="http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.13.4.js"></script>

    <link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
    
</head>
<body ng-app="postApp" ng-controller="postController">
<div class="container">
<div class="col-sm-6 col-sm-offset-2">
    <div class="page-header"><h2>Perfil de {{usuario}}</h2></div>
    <!-- FORM -->
    <form name="userForm" ng-submit="submitForm()">
    <div class="form-group">
        <label>Nombre</label>
        <input type="text" name="nombre" class="form-control" ng-model="user.nombre">
        <span ng-show="errorNombre">{{errorNombre}}</span>
    </div>
    <div class="form-group">
        <label>NIF</label>
        <input type="text" name="nif" class="form-control" ng-model="user.nif">
        <span ng-show="errorNif">{{errorUserNif}}</span>
    </div>
    <div class="form-group">
        <label>Contraseña</label>
        <input type="password" name="password" class="form-control" ng-change="changep1()" ng-model="user.password">
        <span ng-show="errorPassword">{{errorPassword}}</span>
    </div>
    <div class="form-group">
        <label>Repetir Contraseña</label>
        <input type="password" name="repassword" class="form-control" ng-change="changep2()" ng-model="repassword" ng-style="{'background-color': recolor}">
        <span ng-show="errorPassword">{{errorPassword}}</span>
    </div>
    <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" class="form-control" ng-model="user.email">
        <span ng-show="errorEmail">{{errorEmail}}</span>
    </div>
     <div class="form-group">
        <label>Moto</label>
        <input type="moto" name="moto" class="form-control" ng-model="user.moto">
        <span ng-show="errorMoto">{{errorMoto}}</span>
    </div>
    
    <button type="submit" ng-disabled="nolisto" class="btn btn-primary">Guardar</button>
    </form>
 <div collapse="isCollapsed" class="alert" type="danger">{{mensaje}}

</div>   
</div>
<div class="col-sm-4">
<div class="panel panel-danger">
	  <div class="panel-heading">Cambiar foto del perfil <span id="textoupload" ></span></div>
	  <div class="panel-body">

	   
	    <div class="col-sm-12">	 
		
	    <div class="col-sm-12">	 
		<input id="image_upload" name="image_upload" type="file" >
		</div>
		
		</div>


	  </div>
	</div>	

</div>
</div>
</body>
</html>

<script>
    // Defining angularjs application.
    var postApp = angular.module('postApp', ['ui.bootstrap']);
    // Controller function and passing $http service and $scope var.
    postApp.controller('postController', function($scope, $rootScope, $window, $http) {
    	
    	 $scope.init = function() {
    		   $rootScope.idusuario = $window.idusuario;
    		    $rootScope.usuario = $window.usuario;

				var urlz = "/LapTracker/servicios/webuser/datosperfil"
    	        $http({
    	            method: 'JSONP',
    	            url: urlz + '/' + $rootScope.idusuario + '/jsonp?callback=JSON_CALLBACK'
    	        }).success(function(data, status) {
    	           // alert( data);
    	            $scope.user=data;
    	            $atributos = angular.fromJson(data.atributos);
    	            $scope.user.moto = $atributos.moto;
    	            $scope.repassword = $scope.user.password;
    	            
    	            
    	        }).error(function(data, status) {
    	            alert("Error " + status);
    	            // Some error occurred
    	        });


    	    };

    	    $scope.init();
    	
			var urly = "/LapTracker/servicios/webuser/editaperfil"
				   	
      // create a blank object to handle form data.
        $scope.nolisto = false;
        $scope.user = {};
      
        $scope.submitForm = function() {
        
        $http({
          method  : 'POST',
          url     : urly,
          data    : $scope.user, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
          .success(function(data) {
            if (data.errors) {
              // Showing errors.
              $scope.errorNombre = data.errors.nombre;
              $scope.errorNif = data.errors.nif;
              $scope.errorEmail = data.errors.email;
              $scope.errorMoto = data.errors.moto;
              $scope.errorEmail = data.errors.email;
            } else {
              $scope.mensaje = data.descripcion;
              $scope.isCollapsed = false;
            }
          });
        };
        
        
        $scope.changep1 = function() {
        	if($scope.user.password != $scope.repassword){
            	$scope.recolor='red';
            	$scope.nolisto = true;
        	}
        	else{
        		$scope.recolor='lightgreen';
             	$scope.nolisto = false;
                     	}
          };
          $scope.changep2 = function() {
          	if($scope.user.password != $scope.repassword){
            	$scope.recolor='red';
             	$scope.nolisto = true;
         	}
        	else {
        		$scope.recolor='lightgreen';
             	$scope.nolisto = false;
               }
            };
           
        
    });
    
    
	$(function() {
 		
 		
 		
 		$("#image_upload").fileinput({
 		  	showUpload:false, 
 		  	showPreview: false,
 			browseClass: "btn btn-success",
 			browseLabel: "Foto de perfil ...",
 			browseIcon: '<i class="glyphicon glyphicon-picture"></i>',
 			
 		}); 		
	});
	
	
    $('#image_upload').change(function(){
        
        if($(this).val()!='') {   
          var formData = new FormData();
          formData.append('file', $(this)[0].files[0]);
          formData.append('idusuario',  <%=(String) request.getSession().getAttribute("Id_Usuario")%>);
          formData.append('nombre', 'fotoperfil.jpg');
          $.ajax({
            url: '/LapTracker/servicios/webuser/uploadfotobin',
            type: 'POST',
            data: formData,
            success: function (r) { 
             
              	 $("#fotoperfil").attr("src","/LapTracker/readFotoServlet");

	
        		},
       	cache: false,
        	contentType: false,
        	processData: false
     		});

    		}
    }); 	
    
	
</script>
