	var socket2;
	//var host = "ws://172.26.0.160:82/";
	var host = "ws://localhost:82/";
	var BASE64_MARKER = ';base64,';
	var dialogUuid = -1;
	var tempUuid = -1;
	var firmante = 0;
	var $gestionEventos = $("#gestionEventos");
	var isConnected = false;
	var idoperation;
	

	
	function checkPad(){
		if (!("WebSocket" in window)) {
            $('#chatLog, input, button, #examples').fadeOut("fast");
            $('<p>Necesitas un navegador que soporte WebSockets.  </p>').appendTo('#container');
        } else {
            //The user has WebSockets
            function connect2() {
                var socket;
                try {
                    socket = new WebSocket(host);
					
					console.log(socket);
					socket.onopen = function () {
                        var data = { Type: 0 };
						var str = JSON.stringify(data);
						socket.send(str);
                    }
					socket.onerror = function(){
						$gestionEventos.trigger("eventNoConnections");
					}
					 socket.onmessage = function (msg) {
                        var datos = JSON.parse(msg.data);
						switch(datos.Type){
							case 0:
								socket.close();
								isConnected =true;
								break;
							case -1:
								socket.close();
								break;
						}
					 }
					 socket.onclose = function () {
						 
					 }
				} catch (exception) {
				}
				
				
			}
		}
		
			
		connect2();
	}
	


	function loadIframe(iframeName, data) {
		var $iframe = $('#' + iframeName);
		if ( $iframe.length ) {
			$iframe.attr('src','data:application/pdf;base64,'+data.Data);
		}
		var signers = JSON.parse(data.Data2);
		var divSigners= $('<div><div>');
		for (i = 0; i < signers.length; i++) {
			if(!signers[i].Signed)
				divSigners.append(
							'<label>'+signers[i].Nombre+'</label>',
							'<a rel="tooltip" class="btn btn-info" href=javascript:signPDF('+dialogUuid+','+i+') >',
								'<i class="fa fa-list-alt fa-lg"></i>Firmar',
							'</a>'
				);
		}
		$.when(function(){
			$('#signerDiv').remove();
		})
		.done(function(){
			$('#signerDiv').html(divSigners);
		})
		.fail(function(){
			$('#signerDiv').html(divSigners);
		});
		
	}
		
	function showPDFUnsigned(uuid){
		var data = {Type:3, idFile:uuid};
		tempUuid = uuid;
		var str = JSON.stringify(data);
        socket2.send(str);		
	}
	
	function signPDF(uuid, signerId){
		var data = {Type:4, idFile:uuid, idSigner:signerId };		
		var str = JSON.stringify(data);
		socket2.send(str);
	}
	
	function showPDFSigned(uuid){					
		var data = {Type:5, idFile:uuid };
		var str = JSON.stringify(data);
		socket2.send(str);			
	}
	
	function drawActions(value, row, index){
		//row.docmetadata2 = "";
		//row.docmetadata = "";
		console.log(JSON.stringify(row))
	return [
						'<div class="btn-group ">',
							'<a rel="tooltip" class="btn btn-info" href=javascript:showPDFUnsigned('+row.uuid+') >',
					        	'<i class="fa fa-list-alt fa-lg"></i>',
								'Ver Documento',
					        '</a>',
				        '</div>'
				    ].join('');
	}
	
	function drawSigner(value, row, index){
		return [
						'<div class="btn-group ">',
							'<a rel="tooltip" class="btn btn-info" href=javascript:signPDF('+dialogUuid+') >',
					        	'<i class="fa fa-list-alt fa-lg"></i>',
								'Firmar',
					        '</a>',
				        '</div>'
				    ].join('');
	}

	
	function pdfDialog(data){
		var $content = $('<div style="text-align: center;" height="auto" width="auto"></div>');
//        $content.append('<iframe height="750px" width="800px" style="text-align: center;" height="auto" width="auto" id="qrCode" scrolling="no" frameborder="0" src="data:application/pdf;base64,'+data.Data+'"/></iframe>');
        $content.append('<iframe height="750px" width="800px" style="text-align: center;" height="auto" width="auto" id="pdfViewer" scrolling="no" frameborder="0" src="data:application/pdf;base64,'+data.Data+'"/></iframe>');
		var divSigners = $('<div id="signerDiv" style="text-align: center;" height="auto" width="auto">')
		var signers = JSON.parse(data.Data2);
		for (i = 0; i < signers.length; i++) { 
			var temp = '<a rel="tooltip" class="btn btn-info" href="javascript:signPDF('+dialogUuid+','+i+')" ><i class="fa fa-pencil-square-o fa-lg"></i> Firmar</a>';
			divSigners.append('<div ><span>'+signers[i].Nombre+'</span>'+temp,

							'</div>');
		}
		divSigners.append('</div>');
		$content.append(divSigners);
		signerTable(data.Data2);
		return new BootstrapDialog({
						title: 'Operacion: '+idoperation,
						type: BootstrapDialog.TYPE_DEFAULT,
						size: BootstrapDialog.SIZE_WIDE,
						message: $content,
						closable: false,
						draggable: true,
						buttons: [{
				
							label: 'Cerrar',
							action: function(dialogRef){
								dialogUuid = -1;
								firmante = 0;
								dialogRef.close();
							}					
						}]
				});
	}

	var signerTable = function(data){
		var $signers = $("#signers");
		$signers.bootstrapTable({
					data: data,
					 columns: 
						[
							{
								field: 'Nombre',
								title: 'Firmante',
								align: 'center',
								class: "col-sm-8",
								valign: 'middle'
							},
							{
								field: 'Nif',
								title: 'Documento de identidad',
								align: 'center',
								class: "col-sm-8",
								valign: 'middle'
							},
							{								
								title: 'acciones',
								align: 'center',
								valign: 'middle',
								class: "col-sm-4",
								sortable: false,
								formatter: drawSigner
							}
						]	
				})
	}
	
	var dialogQRCode = function(data){
			
				//var $qrcode = $('<div style="text-align: center;"><table id="mytable"/></div>');
				var $mytable= $("#mytable");
				document.getElementById("confirmBtn").style.display='block';
				document.getElementById("cancelBtn").style.display='block';
				$mytable.bootstrapTable({
					data: data,
					 columns: 
						[
							{
								field: 'docname',
								title: 'Nombre Documento',
								align: 'center',
								class: "col-sm-8",
								valign: 'middle'
							},
							{
								field: 'acciones',
								title: '',
								align: 'center',
								valign: 'middle',
								class: "col-sm-4",
								sortable: false,
								formatter: drawActions
							}
						]	
				})        		
// 				return new BootstrapDialog({
// 					title: 'Operacion: '+idoperation,
// 					type: BootstrapDialog.TYPE_DEFAULT,
// 		            message: $mytable.html(),
// 		            closable: false,
// 		            draggable: true,
// 		            buttons: [{
// 		               label: 'Cancelar',
// 		               action: function(dialogRef){
// 							data = { Type: 7, idFile: idoperation };
// 							var str = JSON.stringify(data);
// 							socket2.send(str);
// 		                   dialogRef.close();
// 		                   window.location = document.referrer;
// 		               }
// 		           },
// 					{
// 						label: 'Confirmar Operacion',
// 						action: function(dialogRef){
// 							data = { Type: 6, idFile: idoperation };
// 							var str = JSON.stringify(data);
// 							socket2.send(str);
// 		                   dialogRef.close();
// 		                   window.location = document.referrer;
// 						}
// 					}]
// 				});
		
			}

	function cancelOperation(){
		data = { Type: 7, idFile: idoperation };
		var str = JSON.stringify(data);
		socket2.send(str);
	}
	
	function confirmOperation(){
		data = { Type: 6, idFile: idoperation };
		var str = JSON.stringify(data);
		socket2.send(str);
	}
	
	function webSocket(){
		$('#startButton').click(function(e){		
			e.preventDefault();
			var temp = $("#operacion").val();
			if( temp.length > 5 )
				idoperation = temp;
			connect();	
		})
		$('#confirmBtn').click(function(e){		
			e.preventDefault();
			confirmOperation();
		})
            
        if (!("WebSocket" in window)) {
            $('#chatLog, input, button, #examples').fadeOut("fast");
            $('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');
        } else {
            //The user has WebSockets
            function connect() {
                var socket;
                

                try {
                    var socket = new WebSocket(host);
					
                    window.socket2 = socket;

                    message('<p class="event">Socket Status: ' + socket.readyState);

                    socket.onopen = function () {
                    	$("#startButton").show();
                    	$("#mensajeestado").html("<span>COnexión establecida con el pad de firma</span>")
                        var data = { Type: 0 };
						var str = JSON.stringify(data);
						socket2.send(str);
                    }

                    socket.onmessage = function (msg) {
                        var datos = JSON.parse(msg.data);
						switch(datos.Type){
							case 0:
								data = { Type: 2, idFile: idoperation };
								var str = JSON.stringify(data);
								socket2.send(str);
								break;
							case 2:
								dialogQRCode(JSON.parse(datos.Data));
								break;
							case 3:
								if(dialogUuid ===-1){
									dialogUuid = tempUuid;
									
									pdfDialog(datos).open();
								}
								else
									loadIframe('pdfViewer',datos);
								break;
							case 4:
								showPDFSigned(dialogUuid);
								break;								
							case 7:
								window.alert("Faltan firmantes por firmar");
								break;
						
						}
                          
                    }

                    socket.onclose = function () {
                        message('<p class="event">Socket Status: ' + socket.readyState + ' (Closed)');
                        socket.close();
                        socket = new WebSocket(host);
                        window.socket2 = socket;

                    }

                } catch (exception) {
                    message('<p>Error' + exception);
                }

                function send() {
                    var text = $('#text').val();

                    if (text == "") {
                        message('<p class="warning">Please enter a message');
                        return;
                    }
                    try {
                        socket.send(text);
                        message('<p class="event">Sent: ' + text)

                    } catch (exception) {
                        message('<p class="warning">');
                    }
                    $('#text').val("");
                }

                function message(msg) {
                    $('#chatLog').append(msg + '</p>');
                }

                $('#text').keypress(function (event) {
                    if (event.keyCode == '13') {
                        send();
                    }
                });

                $('#disconnect').click(function () {
                    alert("Cierre");
                    socket.close();
                });
                $('#lista').click(function () {
                    alert("Enviar");
                    var data = { Type: 3, Name: $('#text').val() };
                    var str = JSON.stringify(data);
                    socket.send(str);
                });
            } //End connect

           


        } //End else

	}
	
    $(document).ready(function () {

		//alertSize();
		checkPad()
		setTimeout(function(){
		if(isConnected){
			window.alert("Hay conexion");
			webSocket();
		}
			
		
		else{
			
        	$("#mensajeKO").html("<span class='bg-danger' >No es posible establecer conexión con el pad de firma</span>");
			
			
		}
				
		},10000);

    });
	