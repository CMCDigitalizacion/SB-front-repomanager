angular
  .module('O2DigitalSite')
  .controller('SuperController', SuperController);

  function SuperController(superRESTServices, DTOptionsBuilder, DTColumnBuilder, $compile, $scope, $rootScope, $uibModal, superUtilities, $q, tokenManager, $state, sweet, $filter) {
      var vm                = this;
      vm.isLoaded           = true;
      vm.dtInstanceDomain   = {};
      vm.dtInstanceUsers    = {};
      vm.dtInstanceNotaries = {};
      vm.dtInstanceBatches  = {};
      vm.domains            = [];
      vm.users              = [];
      vm.notaries           = [];

      $rootScope.$broadcast('rootChange', 'Administración / Configuración Empresas')

      vm.loadSuperData = function () {

          var deferredDomains  = $q.defer();
          var deferredUsers    = $q.defer();
          var deferredNotaries = $q.defer();
          var deferredBatches  = $q.defer();

          //LOADING DOMAINS TABLE
          vm.dtOptionsDomain = DTOptionsBuilder.newOptions()
                .withOption('createdRow', createdRow)
                .withOption('ajax', function(data, callback, settings) {
                    superRESTServices.getAllDomains().then(
                        function successCallback(responseSuccess) {
                            callback(responseSuccess.data);
                            deferredDomains.resolve();
                            superUtilities.setDomainsList(responseSuccess.data);
                            if(angular.isDefined($scope.domain))
                              $scope.domain.domainName = "";
                        }, function errorCallback(responseError) {
                            deferredDomains.reject(responseError);
                      });
                })
                .withPaginationType('full_numbers');

                vm.dtColumnsDomain = [
                    DTColumnBuilder.newColumn('id')              .withClass('center-text valign-middle').withTitle('ID Domain'),
                    DTColumnBuilder.newColumn('domainName')      .withClass('center-text valign-middle').withTitle('Nombre'),
                    DTColumnBuilder.newColumn('availableFunct1') .withClass('center-text valign-middle').withTitle('Bsign')   .renderWith(availableFunct1Html),
                    DTColumnBuilder.newColumn('availableFunct2') .withClass('center-text valign-middle').withTitle('Video Id').renderWith(availableFunct2Html),
                    DTColumnBuilder.newColumn('availableFunct3') .withClass('center-text valign-middle').withTitle('IMAE')    .renderWith(availableFunct3Html),
                    DTColumnBuilder.newColumn('availableFunct4') .withClass('center-text valign-middle').withTitle('Witness') .renderWith(availableFunct4Html),
                    DTColumnBuilder.newColumn(null)              .withClass('center-text valign-middle').withTitle('Acciones').notSortable().renderWith(actionsNotificationHtml)
                ];

                function availableFunct1Html(data, type, full, meta) {
                    if(data===1){
                        return '<i ng-click="super.deactiveFunct1(super.domains[' + meta.row + '])" confirm="¿Está seguro de desactivar el módulo BSign para el dominio ' + full.domainName + '?"><span class="glyphicon glyphicon-ok-sign pointer-span"> Activo</span></i>';
                    }
                    else{
                        return '<i ng-click="super.activeFunct1(super.domains[' + meta.row + '])" confirm="¿Está seguro de activar el módulo BSign para el dominio ' + full.domainName + '?"><span class="glyphicon glyphicon-remove-sign pointer-span"> Inactivo</span></i>';
                    }
                }
                function availableFunct2Html(data, type, full, meta) {
                    if(data===1){
                        return '<i ng-click="super.deactiveFunct2(super.domains[' + meta.row + '])" confirm="¿Está seguro de desactivar el módulo Video Identificación para el dominio ' + full.domainName + '?"><span class="glyphicon glyphicon-ok-sign pointer-span"> Activo</span></i>';
                    }
                    else{
                        return '<i ng-click="super.activeFunct2(super.domains[' + meta.row + '])" confirm="¿Está seguro de activar el módulo Video Identificación para el dominio ' + full.domainName + '?"><span class="glyphicon glyphicon-remove-sign pointer-span"> Inactivo</span></i>';
                    }
                }
                function availableFunct3Html(data, type, full, meta) {
                    if(data===1){
                        return '<i ng-click="super.deactiveFunct3(super.domains[' + meta.row + '])" confirm="¿Está seguro de desactivar el módulo IMAE para el dominio ' + full.domainName + '?"><span class="glyphicon glyphicon-ok-sign pointer-span"> Activo</span></i>';
                    }
                    else{
                        return '<i ng-click="super.activeFunct3(super.domains[' + meta.row + '])" confirm="¿Está seguro de activar el módulo IMAE para el dominio ' + full.domainName + '?"><span class="glyphicon glyphicon-remove-sign pointer-span"> Inactivo</span></i>';
                    }
                }

                function availableFunct4Html(data, type, full, meta) {
                    if(data===1){
                        return '<i ng-click="super.deactiveFunct4(super.domains[' + meta.row + '])" ><span class="glyphicon glyphicon-ok-sign pointer-span"> Activo</span></i>';
                    }
                    else{
                        return '<i ng-click="super.activeFunct4(super.domains[' + meta.row + '])" ><span class="glyphicon glyphicon-remove-sign pointer-span"> Inactivo</span></i>';
                    }
                }
                
                function actionsNotificationHtml(data, type, full, meta) {
                    vm.domains[meta.row] = full;

                    return '<i ng-click="super.addAdmin(super.domains[' + meta.row + '])"><span class="pointer-span"><img style="height:33px;" src="webapp/img/add-user.svg"></img></span></i>';
                }


            //LOADING USERS TABLE
            vm.dtOptionsUsers = DTOptionsBuilder.newOptions()
                .withOption('createdRow', createdRow)
                .withOption('ajax', function(data, callback, settings) {
                    superRESTServices.getAllUsers().then(
                        function successCallback(responseSuccess) {
                        	angular.forEach(responseSuccess.data, function(value, key) {
                        		if (value.extradata == null) {
                        			value.extradata = {};
                        			value.extradata.firstName = "";
                        			value.extradata.lastName1 = "";
                        			value.extradata.nif = "";
                        			value.extradata.phone = "";
                        		}
                        	});
                            callback(responseSuccess.data);
                            deferredUsers.resolve();
                            // superUtilities.setDomainsList(responseSuccess.data);
                            if(angular.isDefined($scope.domain))
                              $scope.domain.domainName = "";
                        }, function errorCallback(responseError) {
                            deferredUsers.reject(responseError);
                      });
                })
                .withPaginationType('full_numbers');

                vm.dtColumnsUsers = [
                    DTColumnBuilder.newColumn('id')         .withTitle('ID Usuario').withClass('col-sm-1 center-text'),
                    DTColumnBuilder.newColumn('role')       .withTitle('Rol')       .withClass('col-sm-2 center-text').renderWith(formatRoleHtml),
                    DTColumnBuilder.newColumn('domainName') .withTitle('Empresa')   .withClass('col-sm-2 center-text'),
                    DTColumnBuilder.newColumn('useremail')  .withTitle('Correo')    .withClass('col-sm-3 center-text'),
                    DTColumnBuilder.newColumn('username')   .withTitle('Usuario')   .withClass('col-sm-3 center-text'),
                    DTColumnBuilder.newColumn('extradata.firstName')	.notVisible(),
                    DTColumnBuilder.newColumn('extradata.lastName1')	.notVisible(),
                    DTColumnBuilder.newColumn('extradata.nif')			.notVisible(),
                    DTColumnBuilder.newColumn('extradata.phone')		.notVisible(),
                    DTColumnBuilder.newColumn(null)         .withTitle('Acciones')  .withClass('col-sm-1')            .renderWith(actionsModifyUsersHtml).notSortable(),
                ];

            function formatRoleHtml(data, type, full, meta) {
                if(data === 0)       return 'VIDEO'
                else if(data === -1) return 'SUPERVISOR'
                else if(data === -2) return 'VISOR'
                else if(data === 1)  return 'NORMAL'
                else if(data === 2)  return 'ADMIN'
                else if(data === 3)  return 'SUPERADMIN'
                else if(data === -3) return 'FIRMANTE'
                else return '---'
            }

            function actionsModifyUsersHtml(data, type, full, meta) {
                vm.users[meta.row] = full;
                return '<i ng-click="super.modifyUser(super.users[' + meta.row + '])"><span class="glyphicon glyphicon-edit pointer-span"></span></i>'+
                       '<i class="fa fa-edit" confirm="¿Está seguro de que desea eliminar el usuario ' + full.username + '?" ng-click="super.deleteUser(super.users['+ meta.row +'])"><span class="icon glyphicon glyphicon-trash pointer-span"></span></i>';;
            }

            //LOADING NOTARIES TABLE
            vm.dtOptionsNotaries = DTOptionsBuilder.newOptions()
                .withOption('createdRow', createdRow)
                .withOption('ajax', function(data, callback, settings) {
                    superRESTServices.getAllNotaries().then(
                        function successCallback(responseSuccess) {
                            callback(responseSuccess.data);
                            deferredNotaries.resolve();
                            // superUtilities.setDomainsList(responseSuccess.data);
                            if(angular.isDefined($scope.domain))
                              $scope.domain.domainName = "";
                        }, function errorCallback(responseError) {
                            deferredNotaries.reject(responseError);
                      });
                })
                .withPaginationType('full_numbers');

                vm.dtColumnsNotaries = [
                    DTColumnBuilder.newColumn('nombre')        .withTitle('Nombre')        .withClass('col-sm-4'),
                    DTColumnBuilder.newColumn('apellidos')     .withTitle('Apellidos')     .withClass('col-sm-4'),
                    DTColumnBuilder.newColumn('identificador') .withTitle('Identificador') .withClass('col-sm-2'),
                    DTColumnBuilder.newColumn(null)            .withTitle('Acciones')      .withClass('col-sm-2').notSortable().renderWith(actionsModifyNotaries),
                ];

                function actionsModifyNotaries(data, type, full, meta) {
                    vm.notaries[meta.row] = full;
                    return '<i ng-click="super.modifyNotary(super.notaries[' + meta.row + '])"><span class="glyphicon glyphicon-edit pointer-span"></span></i>'+
                           '<i class="fa fa-edit" confirm="¿Está seguro de que desea eliminar el notario ' + full.nombre + ' ' + full.appellidos + '?" ng-click="super.deleteNotary(super.notaries['+ meta.row +'])"><span class="icon glyphicon glyphicon-trash pointer-span"></span></i>';;
                }

            //LOADING NOTARIES TABLE
            vm.dtOptionsBatches = DTOptionsBuilder.newOptions()
                .withOption('createdRow', createdRow)
                .withOption('ajax', function(data, callback, settings) {
                    superRESTServices.getDomainBatches(tokenManager.getDomainId()).then(
                        function successCallback(responseSuccess) {
                            callback(responseSuccess.data);
                            deferredBatches.resolve();
                            // superUtilities.setDomainsList(responseSuccess.data);
                            if(angular.isDefined($scope.domain))
                              $scope.domain.domainName = "";
                        }, function errorCallback(responseError) {
                            deferredBatches.reject(responseError);
                      });
                })
                .withPaginationType('simple_numbers');

                vm.dtColumnsBatches = [
                    DTColumnBuilder.newColumn('identificador')     .withTitle('Identificador Lote') ,
                    DTColumnBuilder.newColumn('fechacreacion')     .withTitle('Fecha Creación')     ,
                    DTColumnBuilder.newColumn('fechadesde')        .withTitle('Fecha Desde')        ,
                    DTColumnBuilder.newColumn('fechahasta')        .withTitle('Fecha Hasta')        ,
                    DTColumnBuilder.newColumn('numerooperaciones') .withTitle('Número Operaciones') ,
                    DTColumnBuilder.newColumn('estado')            .withTitle('Estado')             .renderWith(parseState)

                ];

                function parseState(data, type, full, meta) {
                  if(full.estado === 0){
                    return 'PENDIENTE'
                  } else if(full.estado === 1){
                    return 'BLOQUEADO'
                  } else if(full.estado === 2){
                    return 'FIRMADO'
                  }
                }


            $q.allSettled([deferredDomains.promise, deferredUsers.promise, deferredNotaries.promise, deferredBatches.promise]).then(
              function(responseArray){
                  var errorArray = [];
                    console.log('All the ajax returned! Checking for some error...');
                    angular.forEach(responseArray, function (response, index) {
                      if (response.state !== 'fulfilled')
                          errorArray.push(response.reason);
                        
                    })

                    if(errorArray.length === 0){
                      console.log('No error identified');
                      $rootScope.$broadcast('callSuccess', 'Dominios cargados.');
                      vm.isLoaded = false;
                    } else {
                        var listError = ''
                        angular.forEach(errorArray, function (error, index) {
                          if(errorArray.length == 1)
                          listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
                          else if(errorArray.length -1 === index)
                          listError = listError + error.data.failure + ' (desde: ' + error.from + ')';
                          else
                          listError = listError + error.data.failure + ' (desde: ' + error.from + ')  ---  ';
                        })
                        $rootScope.$broadcast('callError', listError);
                    }
              })
      }

      function createdRow(row, data, dataIndex) {
          // Recompiling so we can bind Angular directive to the DT
          $compile(angular.element(row).contents())($scope);
      }

      vm.deleteNotary = function(notary) {
        superRESTServices.deleteNotary(notary).then(
            function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'El notario ' + notary.nombre + ' ' + notary.apellidos + ' ha sido borrado correctamente.');
                vm.dtInstanceNotaries.reloadData();
            },
            function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deleteNotary)');
              
            }
        )
      }

      vm.deleteUser = function (user) {
        superRESTServices.deleteUser(user).then(
            function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'El usuario ' + user.username + ' ha sido borrado correctamente.');
                vm.dtInstanceUsers.reloadData();
            },
            function (responseError) {
              $rootScope.$broadcast('callError', responseError.data.failure);
            }
        )
      }

      vm.modifyUser = function (user) {
        var userToModify = {}
        userToModify = angular.copy(user);
        userToModify.extradata.lastName = user.extradata.lastName1;
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'userModal.html',
          controller: 'SuperAddUserController',
          resolve: {
            userSelected: function () {
              return userToModify;
            },
            usersTableInstance: function () {
              return vm.dtInstanceUsers;
            }
          },
          windowClass: 'dialogGeneral'
        });
      }

      vm.saveDomain = function (domain) {
          console.log(domain);
          domain.logos = '{}';
          domain.extraFields = [];

          superRESTServices.saveDomain(domain).then(
              function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'Dominio con nombre "' + domain.domainName + '" guardado correctamente.');
                vm.dtInstanceDomain.reloadData();
              },
              function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveDomain)');
              }
          )
        }

      vm.deactiveFunct1 = function (domain) {
          console.log(domain);
          domain.availableFunct1=0;
          superRESTServices.updateDomain(domain).then(
              function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'Dominio con nombre "' + domain.domainName + '" actualizado correctamente.');
                vm.dtInstanceDomain.reloadData();
              },
              function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deactiveFunct1)');
              }
          );
      }
      
      vm.activeFunct1 = function (domain) {
          console.log(domain);
          domain.availableFunct1=1;
          superRESTServices.updateDomain(domain).then(
              function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'Dominio con nombre "' + domain.domainName + '" actualizado correctamente.');
                vm.dtInstanceDomain.reloadData();
              },
              function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: activeFunct1)');
              }
          )
        }

      vm.deactiveFunct2 = function (domain) {
          console.log(domain);
          domain.availableFunct2=0;
          superRESTServices.updateDomain(domain).then(
              function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'Dominio con nombre "' + domain.domainName + '" actualizado correctamente.');
                vm.dtInstanceDomain.reloadData();
              },
              function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deactiveFunct1)');
              }
          );
      }
      
      vm.activeFunct2 = function (domain) {
          console.log(domain);
          domain.availableFunct2=1;
          superRESTServices.updateDomain(domain).then(
              function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'Dominio con nombre "' + domain.domainName + '" actualizado correctamente.');
                vm.dtInstanceDomain.reloadData();
              },
              function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: activeFunct1)');
              }
          )
        }

      vm.deactiveFunct3 = function (domain) {
          console.log(domain);
          domain.availableFunct3=0;
          superRESTServices.updateDomain(domain).then(
              function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'Dominio con nombre "' + domain.domainName + '" actualizado correctamente.');
                vm.dtInstanceDomain.reloadData();
              },
              function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: deactiveFunct3)');
              }
          );
      }
      
      vm.activeFunct3 = function (domain) {
          console.log(domain);
          domain.availableFunct3=1;
          superRESTServices.updateDomain(domain).then(
              function (responseSuccess) {
                $rootScope.$broadcast('callSuccess', 'Dominio con nombre "' + domain.domainName + '" actualizado correctamente.');
                vm.dtInstanceDomain.reloadData();
              },
              function (responseError) {
                $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: activeFunct1)');
              }
          )
        }

      vm.activeFunct4 = function (domain) {
          console.log(domain);
          $state.go('witness_configuration', { idDomain : domain.id })
      }

      vm.deactiveFunct4 = function (domain) {
          console.log(domain);
          $state.go('witness_configuration', { idDomain : domain.id })
      }

      vm.addAdmin = function (domain) {
        var adminObject = {};
        adminObject.domainid = domain.id;
        superUtilities.setAdminObject(adminObject);

        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'userModal.html',
          controller: 'AdminController',
          windowClass: 'dialogGeneral',
        });
      }

      vm.modifyNotary = function(notary) {
        console.log(notary)
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'notaryModal.html',
          controller: 'NotaryController',
          windowClass: 'dialogGeneral',
          resolve: {
            notary: function () {
              return notary;
            },
            notaryTableInstance: function() {
              return vm.dtInstanceNotaries;
            }
          }
        });
      }

      function createdRow(row, data, dataIndex) {
          // Recompiling so we can bind Angular directive to the DT
          $compile(angular.element(row).contents())($scope);
      }

      vm.searchOperation = function(operation) {
        var date;
        if(angular.isDefined(operation.date) && operation.date !== null){
          operation.dateString = $filter('date')(new Date(operation.date), 'yyyy-MM-dd');
          
          if(angular.isDefined(operation.time) && operation.time !== null){
            var time = $filter('date')(new Date(operation.time), 'HH:mm');
            if(operation.time !== '')
              operation.dateString = operation.dateString + ' ' + time + ':00';
            else
              operation.dateString = operation.dateString + ' ' + '00:00:00';
          } else
            operation.dateString = operation.dateString + ' ' + '00:00:00';

        } else {
          operation.dateString = 'undefined';
        }

        console.log(operation);

        superRESTServices.findOperation(tokenManager.getDomainId(), operation).then(function(responseSuccess) {
            if(responseSuccess.status === 204){
              sweet.show({
                  title: '',
                  text: 'No se han encontrado resultados.',
                  type: 'success',
                  confirmButtonColor: '#A5DC86',
                  confirmButtonText: 'Cerrar',
                  closeOnConfirm: true
                }, function(isConfirm) {
                });
            } else if(responseSuccess.status === 200){
              $scope.batch = responseSuccess.data;
            }
        }).catch(function(responseError) {
            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: findOperation)');
        })

      }

      vm.resetField = function(operation) {
        $scope.operation.uuid = ''; 
        $scope.operation.date = undefined; 
        $scope.operation.time = null;
        $scope.batch = {};
      }
  }



/**
*   Controller NotaryController
*
*   Description:
*   used to modify or insert a new notary in the db.
*/
angular.module('O2DigitalSite').controller('NotaryController', function($scope, $uibModalInstance, $http, superRESTServices, $rootScope, notary, notaryTableInstance){

        console.log(notary)
        var isNew;
        if(angular.isUndefined(notary)) isNew = true;
        else isNew = false;

        $scope.notary = notary;

        $scope.saveNotary= function (notaryToSave) {
          console.log(notaryToSave);
          superRESTServices.saveNotary(notaryToSave).then(
            function(responseSuccess) {
              notaryTableInstance.reloadData();
              if(isNew)
                $rootScope.$broadcast('callSuccess', 'El notario ' + notaryToSave.nombre + ' ' + notaryToSave.apellidos + ' ha sido guardado correctamente.');
              else
                $rootScope.$broadcast('callSuccess', 'El notario ' + notaryToSave.nombre + ' ' + notaryToSave.apellidos + ' ha sido modificado correctamente.');
              $uibModalInstance.dismiss('');
            },
            function(responseError) {
              $uibModalInstance.dismiss('')
              $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: NotaryController)');
              $uibModalInstance.dismiss('');
            }
          )
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
});

/**
*   Controller SuperAddUserController
*
*   Description:
*   used to modify a system user.
*/
angular.module('O2DigitalSite').controller('SuperAddUserController', function($scope, $uibModalInstance, $http, $rootScope, superUtilities, $log, superRESTServices, $timeout, userSelected, usersTableInstance){

        $scope.checkIfAltering = function() {
          return false;
        }

        var userPassword = userSelected.userpassword;
        $scope.hide = true;
        if (userSelected){
          $scope.user = userSelected;
          $scope.user.role = userSelected.role.toString();
          if (userSelected.state >= 0) 
        	  $scope.user.state = "0";
          else
        	  $scope.user.state = "-1";
          $scope.user.userpasswordrepeated = userSelected.userpassword;
        }

        $scope.saveUser= function (user) {
            var userToModify = {}
            userToModify.id = user.id;
            userToModify.domainid = user.domainid;
            userToModify.role = parseInt(user.role);
            userToModify.state = parseInt(user.state);
            userToModify.useralias = user.useralias;
            userToModify.useremail = user.useremail;
            userToModify.username = user.username;
            userToModify.groupid = 1;
            userToModify.extradata = {};
            if (user.extradata != null && user.extradata != undefined) {
            	
            	if (user.extradata.nif != null && user.extradata.nif != undefined)
            		userToModify.extradata.nif =  user.extradata.nif;
            	if (user.extradata.phone != null && user.extradata.phone != undefined)
            		userToModify.extradata.phone =  user.extradata.phone;
            	if (user.extradata.firstName != null && user.extradata.firstName != undefined)
            		userToModify.extradata.firstName =  user.extradata.firstName;
            	if (user.extradata.lastName1 != null && user.extradata.lastName1 != undefined)
            		userToModify.extradata.lastName1 =  user.extradata.lastName1;
            }
            	
            if(user.userpassword !== null && user.userpassword !== ''){
                var pwdHashed = CryptoJS.SHA256(""+user.userpassword);
                var pwdHashedB64= pwdHashed.toString(CryptoJS.enc.Base64); 
                userToModify.userpassword = pwdHashedB64;
            }


            superRESTServices.modifyUser(userToModify).then(
                function (responseSuccess) {
                    $uibModalInstance.dismiss('');
                    $rootScope.$broadcast('callSuccess', 'Usuario: ' + userToModify.username + ' modificado correctamente');
                    usersTableInstance.reloadData();
                },
                function (responseError) {
                    if(responseError.status === 409){
                        $scope.response = responseError.data.failure;
                        $scope.hide = false;
                        $timeout(function() {
                          $scope.hide = true;
                        }, 6000);
                    } else
                      $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: SuperAddUserController)');
                }
            )

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
});
/**
*   Controller AdminController
*
*   Description:
*   Used to save a new admin or general user to one domain.
*/
angular.module('O2DigitalSite').controller('AdminController', function($scope, $uibModalInstance, $http, $rootScope, superUtilities, $log, superRESTServices, $timeout){

         $scope.hide = true;

         $scope.checkIfAltering = function() {
           return true;
         }

        $scope.saveUser= function (user) {
            var adminToSave = {}
            adminToSave.domainid = superUtilities.getAdminObject().domainid;
            adminToSave.role = parseInt(user.role);
            adminToSave.state = parseInt(user.state);
            adminToSave.useremail = user.useremail;
            adminToSave.username = user.username;
            adminToSave.extradata = {};
            if (user.extradata != null && user.extradata != undefined) { 
                
                if (user.extradata.nif != null && user.extradata.nif != undefined) 
                	adminToSave.extradata.nif =  user.extradata.nif; 
                if (user.extradata.phone != null && user.extradata.phone != undefined) 
                	adminToSave.extradata.phone =  user.extradata.phone; 
                if (user.extradata.firstName != null && user.extradata.firstName != undefined) 
                	adminToSave.extradata.firstName =  user.extradata.firstName; 
                if (user.extradata.lastName1 != null && user.extradata.lastName1 != undefined) 
                	adminToSave.extradata.lastName1 =  user.extradata.lastName1; 
              } 

            var pwdHashed = CryptoJS.SHA256(""+user.userpassword);
            var pwdHashedB64= pwdHashed.toString(CryptoJS.enc.Base64); 

            adminToSave.userpassword = pwdHashedB64;
            adminToSave.groupid = 1;
            superRESTServices.saveAdminUser(adminToSave).then(
                function (responseSuccess) {
                  $uibModalInstance.dismiss('');
                  $rootScope.$broadcast('callSuccess', 'Saved');
                },
                function (responseError) {
                  if(responseError.status === 409){
                      $scope.response = responseError.data.failure;
                      $scope.hide = false;
                      $timeout(function() {
                        $scope.hide = true;
                      }, 6000);
                  } else
                     $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: saveUser)');
                }
            )
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('');
        }
});