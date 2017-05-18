	var socket2;
	//var host = "ws://172.26.0.160:82/";
	var host = "ws://127.0.0.1:82/";
	var BASE64_MARKER = ';base64,';
	var dialogUuid = -1;
	var tempUuid = -1;
	var firmante = 0;
	var $gestionEventos = $("#gestionEventos");
	var isConnected = false;
	var idoperation;
	var signersGlobal;
	var buttonsState = new Array();
	var $signButton;
	var allDocsData;
	var selectedDocumentName;
	var selectedDocumentCounter;
	

	
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
	
	function isDocsAllSigned(){
		var allDocsAreSigned = true;
		$.each(allDocsData, function(index, value){
			if(value.docstate === 0){
				allDocsAreSigned = false;
				return false;
			}
		})

		return allDocsAreSigned;

	}

	function loadIframe(iframeName, data) {
		var $iframe = $('#' + iframeName);
		if ( $iframe.length ) {
			$iframe.attr('src','data:application/pdf;base64,'+data.Data);
		}
		var $content = $('<div class="col-sm-12" ></div>');
		var signers = JSON.parse(data.Data2);
		signersGlobal = JSON.parse(data.Data2);
		var divSigners= $('<div class="col-sm-12"><div>');
		
		var temp = '<div class="col-sm-12 bg-info">';
		for (i = 0; i < signers.length; i++) {
			if(!signers[i].Signed){
				temp += '<div class="col-sm-12" style="padding-top:3px;"> <div class="col-sm-2"></div><div class="col-sm-4 ">'+signers[i].Nombre+'</div>'+
				'<div class=col-sm-4"><a id="'+i+'" class="btn btn-success" href="javascript:signPDF('+dialogUuid+','+i+')" ><i class="fa fa-pencil-square-o fa-lg"></i> Firmar</a></div>'+
				'</div>';
			}
		}
		temp += "</div>";
		divSigners.append(temp);
		$content.append(divSigners);

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

	function setDocToBeSignedAndShowIt(uuid){
		
		$.each(allDocsData, function(index, value){
			if(value.uuid === uuid){
				selectedDocumentName = value.docname;
				selectedDocumentCounter = 0;
				return false;
			}
		})
		showPDFUnsigned(uuid);

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

		buttonsState.unshift({"value" : signerId, state : true});
		$signButton = $("#"+signerId);
		$signButton.css('pointer-events', 'none');
		$signButton.css('cursor', 'default');
		var $Searching_Modal = $('#Searching_Modal');
		$Searching_Modal.modal('show');

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
		if( row.docstate != 0 ){
			return [
					'<div class="btn-group btn-warning ">',
						'<a class="btn btn-info" href=javascript:showPDFUnsigned('+row.uuid+') >',
				        	'<i class="fa icon-eye-open fa-lg"></i>',
							' Ver Documento',
				        '</a>',
			        '</div>'
			    ].join('');			
			
		}
	return [
						'<div class="btn-group ">',
							'<a class="btn btn-info" href="javascript:setDocToBeSignedAndShowIt('+row.uuid+')" >',
					        	'<i class="fa icon-pencil fa-lg"></i>',
								' Firmar Documento',
					        '</a>',
				        '</div>'
				    ].join('');
	}
	
	function drawSigner(value, row, index){
		console.log(value);
		console.log(row);
		console.log(index)
		return [
						'<div class="btn-group ">',
							'<a class="btn btn-info" href=javascript:signPDF('+dialogUuid+') >',
					        	'<i class="fa fa-gg fa-lg"></i>',
								' Firmarxxx',
					        '</a>',
				        '</div>'
				    ].join('');
	}

	function drawIsSigned(value, row, index){

		if(row.docstate){
			return [
					'<div>',
							'<span>',
					        	'<i class="fa fa-check"></i>',
							'</span>',
				    '</div>'
		        
			].join('');
		} else{
			return [
					'<div>',
							'<span>',
					        	'<i class="fa fa-times"></i>',
							'</span>',
				    '</div>'
			].join('');
		}
	}
	

	
	function pdfDialog(data){
		var $content = $('<div class="col-sm-12" ></div>');
//        $content.append('<iframe height="750px" width="800px" style="text-align: center;" height="auto" width="auto" id="qrCode" scrolling="no" frameborder="0" src="data:application/pdf;base64,'+data.Data+'"/></iframe>');
		var divSigners = $('<div class="col-sm-12" id="signerDiv" >')
		var signers = JSON.parse(data.Data2);
		var signersGlobal = JSON.parse(data.Data2);
		var temp = '<div class="col-sm-12 bg-info">';
		for (i = 0; i < signers.length; i++) {
			temp += '<div class="col-sm-12" style="padding-top:3px;"> <div class="col-sm-2"></div><div class="col-sm-4 ">'+signers[i].Nombre+'</div>'+
			'<div class=col-sm-4"><a id="'+i+'" class="btn btn-success" href="javascript:signPDF('+dialogUuid+','+i+')" ><i class="fa fa-pencil-square-o fa-lg"></i> Firmar</a></div>'+
			'</div>';

							
		}
		temp += "</div>";
		divSigners.html(temp);
		if( signers.length == 0){
			$('#confirmBtn').show();
		}
		
		$content.append(divSigners);
        $content.append('<iframe height="280px" width="800px" style="text-align: center;" height="auto" width="auto" id="pdfViewer" scrolling="no" frameborder="0" src="data:application/pdf;base64,'+data.Data+'"/></iframe>');
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
							cssClass: 'btn-info',
							action: function(dialogRef){
								dialogUuid = -1;
								firmante = 0;
								var $mytable = $("#mytable");
								$mytable.bootstrapTable('destroy');
								dialogQRCode(allDocsData);

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
								class: "col-sm-4",
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
				if(isDocsAllSigned())
					$("#confirmBtn").show();
			//	document.getElementById("cancelBtn").style.display='block';
				$mytable.bootstrapTable({
					data: data,
					height: "200px",
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
							},
							{
								title: 'Firmado',
								align: 'center',
								valign: 'middle',
								class: "col-sm-4",
								sortable: false,
								formatter: drawIsSigned
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
		 $(".modal").modal("hide");
	}
	
	function confirmOperation(){
		$('#confirmBtn').hide();
		$('#mensajeFin').show();
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
		
		$('#cancelBtn').click(function(e){		
			e.preventDefault();
			cancelOperation();
		})		
            
        if (!("WebSocket" in window)) {
            $('#chatLog, input, button, #examples').fadeOut("fast");
            $('<p>you need a browser that supports WebSockets. </p>').appendTo('#container');
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
                    	$("#mensajeOK").html("CONEXION ESTABLECIDA CON EL PAD DE  FIRMA");
                    	$("#mensajeOK").show();
                        var data = { Type: 0 };
						var str = JSON.stringify(data);
						socket2.send(str);
						$('#Searching_Modal').modal('show');
                    }

                    socket.onmessage = function (msg) {
                    	$("#startButton").hide();
                    	$("#mensajeOK").hide();
                    	$('#Searching_Modal').modal('hide');
                        var datos = JSON.parse(msg.data);
						switch(datos.Type){
							case -1:
								if(buttonsState.length !== 0){
									var cancelled = buttonsState.pop();
									$signButton = $("#"+cancelled.value);
									$signButton.removeAttr("style");
								}
								//socket2.send(str);
								break;
							case 0:
								data = { Type: 2, idFile: idoperation };
								var str = JSON.stringify(data);
								socket2.send(str);
								break;
							case 2:
								allDocsData = JSON.parse(datos.Data);
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
								if(buttonsState.length !== 0){
									var cancelled = buttonsState.pop();
								}
								selectedDocumentCounter++;
								$.each(allDocsData, function(index, value){
									if(value.docname === selectedDocumentName && value.docmetadata.length === selectedDocumentCounter){
										value.docstate = 1;
									}
								})
								showPDFSigned(dialogUuid);
								break;								
							case 7:
								$("#mensajeFin").hide();
								$('#confirmBtn').show();
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
         	$("#startButton").show();
        	$("#mensajeOK").html("CONEXION ESTABLECIDA CON EL PAD DE  FIRMA");
        	$("#mensajeOK").show();
        	$("#mensajeEspera").hide();
			webSocket();
		}
			
		
		else{
			
        	$("#mensajeEspera").hide();
        	$("#mensajeKO").html("NO ES POSIBLE ESTABLECER CONEXION CON EL PAD DE FIRMA");
        	$("#mensajeKO").show();
			
		}
				
		},5000);

    });
	