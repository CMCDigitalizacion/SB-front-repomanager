<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html lang="ES-es">

<html>
<head>
	<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
	<link rel="stylesheet" href="bootstrap.min.css">
	<link rel="stylesheet" href="bootstrap-table.css">
	<link rel="stylesheet" href="bootstrap-dialog.css">
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link rel="stylesheet" href="../certifica02/css/bootstrap-dialog.css" type="text/css">	
    <script src="bootstrap.min.js"></script>
    <script src="bootstrap-table.js"></script>	
    <script src="bootstrap-dialog.js"></script>
	<script src="webSocketClient2.js"></script>
	<title>Firma </title>
	
	<link rel="shortcut icon" type="image/png" href="img/favicon.ico"/>

</head>
 <style>
.modal-dialog {
  width: 98%;
  height: 92%;
  padding: 0;
}

.modal-content {
  height: 99%;
}

</style>
<body>
<div id="wrapper">
 
    <div id="container" class="container-fluid">
 
        <h3>Firma de documentos  </h3>
        <input type="hidden" id="operacion" value='<%=request.getParameter("idoperacion") %>' />
        <div id="mensajeEspera"  class="alert alert-info"   role="alert" >Comprobando conexión con pad de firma...</div>
        <div id="mensajeKO"  class="alert alert-danger"  style="display: none;" role="alert" ></div>
        <div id="mensajeOK"  class="alert alert-success" style="display: none;" role="alert" ></div> 
        <div id="mensajeFin"  class="alert alert-success" style="display: none;" role="alert" >La operación se ha ejecutado correctamente. Pulse en CERRAR para finalizar.</div> 
        <div class="col-sm-4" >
        		<button id="startButton" title="Iniciar Firma " style="display: none;" class="btn btn-success">Iniciar Firma</button>    
        </div>
 		 <div class="col-sm-4" >
		<button id="cancelBtn" title=" " class="btn btn-danger" style="display: none;">Cancelar Operación</button>
		</div>       <div class="col-sm-4" >       
		<button id="confirmBtn" title="Iniciar Firma " class="btn btn-success" style="display: none;">Confirmar Operación</button>
		</div>

		<table id="mytable" class="table table-striped" style=""></table>
		<br>
		

	</div>
</div>
	<div id="Searching_Modal" class="modal " tabindex="-1"  data-keyboard="false"
         data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content" style="width: 350px;">

                <div class="modal-body"  >
                    <div style="height:200px; width: 200px; " >
                     
                      <img style="position: relative;left: 30%;" src="img/712.GIF" />
                    </div>
                </div>
                <div class="modal-footer" style="text-align: center"></div>
            </div>
        </div>
    </div>
	
</body>
