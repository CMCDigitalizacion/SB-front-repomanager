angular.module('O2DigitalSite').controller('MenuController', ['$scope', '$http', '$state', '$stateParams', '$uibModal', 'tokenManager', 'Idle', '$rootScope', '$interval',
  function ($scope, $http, $state, $stateParams, $uibModal, tokenManager, Idle, $rootScope, $interval) {

    console.log('Loading the menu controller');

    Idle.unwatch();
    Idle.watch();

    $rootScope.$broadcast('changeStyle');
    var source2;

    $scope.toggleUser = function (e) {
      if ($("#dropdownEvents").css('display') == 'block') {
        e.stopPropagation();
        e.preventDefault();
        $("#dropdownEvents").toggle();
      }
      $("#dropdownUser").toggle();
      e.stopPropagation();
      e.preventDefault();
    }

    $scope.openNotifications = function (e) {
      if ($scope.notificationsNumber > 0) {
        if ($("#dropdownUser").css('display') == 'block') {
          e.stopPropagation();
          e.preventDefault();
          $("#dropdownUser").toggle();
        }
        $("#dropdownEvents").toggle();
        e.stopPropagation();
        e.preventDefault();
      } else {
        e.stopPropagation();
        e.preventDefault();
      }
    }

    $scope.toggleNotificationsDropdown = function () {
      $("#dropdownEvents").toggle();
    }

    $scope.notifications;
    $scope.notificationsNumber = 0;

    $scope.$on('closeSSEs', function (event, message) {
      if(!angular.isUndefinedOrNull(source2)){
        source2.removeEventListener("message", notificationHandler);
        source2.close();
      }
    });

    var notificationHandler = function (e) {
      var json = JSON.parse(e.data);
      if (json.state === 0) {
        source2.close();
      } else {
        $scope.$apply(function () {
          $scope.notifications = json;
          var localNumberOfNotifications = 0;

          for (var i = 0; i < $scope.notifications.length; i++) {
            localNumberOfNotifications = localNumberOfNotifications + $scope.notifications[i].notifications.length;
          }

          $scope.notificationsNumber = localNumberOfNotifications;
        })
      }
    }

    if (tokenManager.checkIfTokenExist() && (tokenManager.getUserRole() === 1 || tokenManager.getUserRole() === -1 || tokenManager.getUserRole() === 2 || tokenManager.getUserRole() === 3)) {

      source2 = new EventSource($rootScope.url + 'sse/events/notifications?token=' + tokenManager.getToken() + '&idDomain=' + tokenManager.getDomainId());

      source2.addEventListener("message", notificationHandler);

    }

    $scope.goToOperationDetail = function (notificationObject) {
      $scope.toggleNotificationsDropdown();
      if (!angular.isUndefinedOrNull(JSON.parse(notificationObject.objectStringified).operationUuid)) {
        $state.go('operationsListOf_domain_with_id', { id: tokenManager.getDomainId(), fromNotification: true, idOperation: JSON.parse(notificationObject.objectStringified).operationUuid, message: notificationObject.message }, { reload: true });
      } else {
        $rootScope.$broadcast('callError', 'La operación no tiene un uuid válido.');
      }

    }

    $scope.refreshModules = function () {
      if (tokenManager.checkIfTokenExist() && tokenManager.getSessionData().availableFunct1 === 1)
        $scope.availableFunct1 = true;
      else
        $scope.availableFunct1 = false;

      if (tokenManager.checkIfTokenExist() && tokenManager.getSessionData().availableFunct2 === 1)
        $scope.availableFunct2 = true;
      else
        $scope.availableFunct2 = false;

      if (tokenManager.checkIfTokenExist() && tokenManager.getSessionData().availableFunct3 === 1)
        $scope.availableFunct3 = true;
      else
        $scope.availableFunct3 = false;

      if (tokenManager.checkIfTokenExist() && tokenManager.getSessionData().availableFunct4 === 1)
        $scope.availableFunct4 = true;
      else
        $scope.availableFunct4 = false;

    }

    if (tokenManager.checkIfTokenExist()) {

      $scope.idDomain = tokenManager.getDomainId();
      $rootScope.idDomain = $scope.idDomain;
      $scope.logoSrc = "services/logos/biglogo/" + $scope.idDomain + "?" + new Date().getTime();
      $scope.idConfiguration = tokenManager.getBSignId();
      if (tokenManager.getUserName().indexOf("/") != -1) {
        $scope.domainName = tokenManager.getUserName().split("/")[0];
        $scope.username = tokenManager.getUserName().split("/")[1];
      } else {
        $scope.domainName = tokenManager.getDomainName();
        $scope.username = tokenManager.getUserName();
      }

      if (tokenManager.checkIfTokenExist() && tokenManager.getUserRole() === 0)
        $scope.isVideoUser = true;
      else
        $scope.isVideoUser = false;

      if (tokenManager.checkIfTokenExist() && tokenManager.getUserRole() === 1)
        $scope.isNormal = true;
      else
        $scope.isNormal = false;

      if (tokenManager.checkIfTokenExist() && tokenManager.getUserRole() === -1)
        $scope.isSupervisor = true;
      else
        $scope.isSupervisor = false;

      if (tokenManager.checkIfTokenExist() && tokenManager.getUserRole() === -2)
        $scope.isVisor = true;
      else
        $scope.isVisor = false;

      if (tokenManager.checkIfTokenExist() && tokenManager.getUserRole() === 3)
        $scope.isSuperAdmin = true;
      else
        $scope.isSuperAdmin = false;

      if (tokenManager.checkIfTokenExist() && tokenManager.getUserRole() === 2)
        $scope.isAdmin = true;
      else
        $scope.isAdmin = false;

      $scope.refreshModules();

    } else {
      $scope.idDomain = 0;
      $scope.idConfiguration = 0;
      $scope.$emit('endSession');
      if (!angular.isUndefinedOrNull(sessionStorage.getItem('ldap')))
        $state.go('loginldap');
      else
        $state.go('login');
    }

    $scope.goToLogin = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'sm',
        templateUrl: 'logout.html',
        controller: 'LogoutController',
        windowClass: 'dialogPass'
      });

      modalInstance.result.then(
        function (argument) {
          $scope.$emit('endSession');
          if (!angular.isUndefinedOrNull(sessionStorage.getItem('ldap')))
            $state.go('loginldap');
          else
            $state.go('login');
        }
      )
    }

    $scope.$on('imgChange', function (event, message) {
      $scope.logoSrc = "services/logos/biglogo/" + $scope.idDomain + "?" + new Date().getTime();
    })

    $scope.$on('rootChange', function (event, message) {
      $scope.road = message;
    })

    $scope.$on('removeDocumentRejectedNotification', function (event, messageNotification) {
      var foundIt = false;
      for (var i = 0; i < $scope.notifications.length; i++) {
        for (var j = $scope.notifications[i].notifications.length - 1; j >= 0; j--) {
          if ($scope.notifications[i].notifications[j].message === messageNotification) {
            $scope.notifications[i].notifications.splice(j, 1);
            foundIt = true;
            break;
          }
        }
        if (foundIt) {
          break;
        }
      }

      $scope.notificationsNumber = $scope.notificationsNumber - 1;

    })

    $scope.$on('closeMenu', function (event, message) {
      if ($("#dropdownUser").css('display') == 'block') {
        event.preventDefault();
        $("#dropdownUser").toggle();
      }
      if ($("#dropdownEvents").css('display') == 'block') {
        event.preventDefault();
        $("#dropdownEvents").toggle();
      }
      closeMenu();
    })

    $scope.changeDomain = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'xl',
        templateUrl: 'changeDomain.html',
        controller: 'ChangeDomainController',
        windowClass: 'dialogPass',
        resolve: {
          domains: function (superRESTServices) {
            return superRESTServices.getAllDomains().then(function (responseSuccess) {
              return responseSuccess.data
            }).catch()
          }
        }
      });

      modalInstance.result.then(function () {
        var domainSaved = JSON.parse(sessionStorage.domainSaved)
        $scope.idDomain = domainSaved.domainid;
        $scope.domainName = domainSaved.domainName;
        $scope.refreshModules();

        $rootScope.$broadcast('changeStyle');
        $rootScope.$broadcast('imgChange');

        $state.reload();

      }, function () {

      })
    }

    $scope.changePsw = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'sm',
        templateUrl: 'changePass.html',
        controller: 'ChangePassController',
        windowClass: 'dialogPass'
      });

    }

    function closeMenu() {

      var $showLeft = $('#showLeft'),
        $hamb = $(".c-hamburger");

      if ($hamb.hasClass("is-active")) {
        $showLeft.trigger('click');

        if ($hamb.hasClass("is-active"))
          $hamb.removeClass("is-active");
        else
          $hamb.toggleClass("c-hamburger--htx is-active");
      }


    }



    $scope.initAll = function () {
      "use strict";

      $http({
        method: 'GET',
        url: 'services/repository/version',
      }).then(function (successResponse) {
        $scope.versionNumber = successResponse.data.version;
      }).catch(function (errorResponse) {

      });

      var toggles = document.querySelectorAll(".c-hamburger");

      for (var i = toggles.length - 1; i >= 0; i--) {
        var toggle = toggles[i];
        toggleHandler(toggle);
      };

      function toggleHandler(toggle) {
        toggle.addEventListener("click", function (e) {
          e.preventDefault();
          (this.classList.contains("is-active") === true) ? this.classList.remove("is-active") : this.classList.add("is-active");
        });
      }




      var menuLeft = document.getElementById('cbp-spmenu-s1'),

        showLeft = document.getElementById('showLeft'),

        body = document.body;

      showLeft.onclick = function (event) {
        classie.toggle(this, 'active');
        classie.toggle(menuLeft, 'cbp-spmenu-open');
        disableOther('showLeft');
        if ($("#dropdownUser").css('display') == 'block') {
          event.preventDefault();
          $("#dropdownUser").toggle();
        }
        if ($("#dropdownEvents").css('display') == 'block') {
          event.preventDefault();
          $("#dropdownEvents").toggle();
        }
      };

      function closeMenu() {



        var $showLeft = $('#showLeft'),
          $hamb = $(".c-hamburger");

        $showLeft.trigger('click');

        if ($hamb.hasClass("is-active"))
          $hamb.removeClass("is-active");
        else
          $hamb.toggleClass("c-hamburger--htx is-active");
      }

      function disableOther2(button, showLeft2) {
        if (button !== 'showLeft') {
          classie.toggle(showLeft2, 'disabled');
        }

      }


      function disableOther(button) {
        if (button !== 'showLeft') {
          classie.toggle(showLeft, 'disabled');
        }

      }

      $.fn.accordion = function (custom) {
        var defaults = {
          keepOpen: false,
          startingOpen: false
        }
        var settings = $.extend({}, defaults, custom);
        if (settings.startingOpen) {
          $(settings.startingOpen).show();
        }

        return this.each(function () {
          var obj = $(this);
          $('li a', obj).click(function (event) {
            var elem = $(this).next();
            if (elem.is('ul')) {
              event.preventDefault();
              if (!settings.keepOpen) {
                obj.find('ul:visible').not(elem).not(elem.parents('ul:visible')).slideUp();
              }
            } else if ($(this).is('a')) {
              var stringClicked = this.innerHTML.toString();
              if (stringClicked.indexOf('tica de privacidad') > -1) {
                closeMenu();
              } else {
                var parent = $(this).parent().parent();
                parent.slideUp();
                closeMenu();
              }
            }
            elem.slideToggle();
          });
        });
      };

      $('.menu').accordion({ keepOpen: false });
    }

  }]);



/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('ChangePassController',
  ['$scope', '$uibModalInstance', '$stateParams', '$http', '$rootScope', 'menuRESTServices', 'tokenManager',
    function ($scope, $uibModalInstance, $stateParams, $http, $rootScope, menuRESTServices, tokenManager) {

      $scope.checkIfAltering = function () {
        return false;
      }
      $scope.savePsw = function (psw) {
        var userObjectTemp = {};
        userObjectTemp.idUser = tokenManager.getUserIdFromToken();
        userObjectTemp.username = tokenManager.getUserName();
        var pwdHashed = CryptoJS.SHA256("" + psw);
        var pwdHashedB64 = pwdHashed.toString(CryptoJS.enc.Base64);
        userObjectTemp.userpassword = pwdHashedB64;

        menuRESTServices.changePass(userObjectTemp).then(
          function (responseSuccess) {
            $uibModalInstance.dismiss('');
            $rootScope.$broadcast('callSuccess', 'Su contraseña ha sido cambiada.');

          },
          function (responseError) {
            $uibModalInstance.dismiss('');
            $rootScope.$broadcast('callError', responseError.data.failure + ' (desde: savePsw)');
          }
        )

      }

      $scope.cancel = function () {
        $uibModalInstance.dismiss('');
      }

      function checkIfPass(argument) {
        // body...
      }
    }]);

/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('ChangeDomainController',
  ['$scope', '$uibModalInstance', '$state', '$rootScope', 'tokenManager', 'menuRESTServices', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'domains', '$timeout',
    function ($scope, $uibModalInstance, $state, $rootScope, tokenManager, menuRESTServices, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, domains, $timeout) {

      $scope.isDomainSelected = false;
      $scope.domainSelected = undefined;

      $timeout(function () {
        $('#body').addClass('modal-open');
      }, 500);

      $scope.dtOptionsDomains = DTOptionsBuilder.newOptions().withOption('rowCallback', rowCallback).withPaginationType('full_numbers');
      $scope.dtColumnDefsDomains = [
        DTColumnDefBuilder.newColumnDef(0)
      ];

      $scope.domainsList = domains;

      $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
      }

      function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function () {
          $scope.$apply(function () {
            clickHandler(aData[0]);
          });
        });
        return nRow;
      }

      function clickHandler(domainNameSelected) {
        for (var i = $scope.domainsList.length - 1; i >= 0; i--) {
          if ($scope.domainsList[i].domainName === domainNameSelected) {
            $scope.isDomainSelected = true;
            $scope.domainSelected = $scope.domainsList[i];
            break;
          }
        }
      }

      $scope.saveNewDomain = function () {

        var domainSaved = {
          domainName: $scope.domainSelected.domainName,
          domainid: $scope.domainSelected.id,
          availableFunct1: $scope.domainSelected.availableFunct1,
          availableFunct2: $scope.domainSelected.availableFunct2,
          availableFunct3: $scope.domainSelected.availableFunct3,
          availableFunct4: $scope.domainSelected.availableFunct4
        }

        sessionStorage.domainSaved = JSON.stringify(domainSaved);
        tokenManager.refreshDomain();
        $uibModalInstance.close();
      }

      $scope.cancel = function () {
        $uibModalInstance.dismiss('ko');
      }
    }]);


/**
*   Controller
*
*   Description
*/
angular.module('O2DigitalSite').controller('LogoutController',
  ['$scope', '$uibModalInstance', '$state', '$rootScope', 'tokenManager',
    function ($scope, $uibModalInstance, $state, $rootScope, tokenManager) {

      $scope.closeSession = function () {
        tokenManager.removeToken();
        $uibModalInstance.close('ok');
      }

      $scope.cancel = function () {
        $uibModalInstance.dismiss('ko');
      }
    }]);



angular.module('O2DigitalSite').controller('basicDemoCtrl', ['$scope', '$rootScope', '$location', 'growl',
  function ($scope, $rootScope, $location, growl) {

    // the last received msg
    $scope.msg = {};

    // handles the callback from the received event
    var handleCallback = function (msg) {
      if ($rootScope.attendingVideoconference == false) {
        $scope.$apply(function () {
          //              $scope.msg = JSON.parse(msg.data);
          $scope.msg = msg.data;
          $scope.basicUsage("success", $scope.msg);
        });

      }
    }

    var source = new EventSource($rootScope.url + 'VideoconfEventsServlet?domain=' + $rootScope.idDomain);
    source.addEventListener('message', handleCallback, false);

    $scope.$on('closeSSEs', function (event, message) {
      if(!angular.isUndefinedOrNull(source)){
        source.removeEventListener("message", handleCallback, false);
        source.close();
      }
    });

    $scope.myClickFunction = function () {
      alert('Clicked through growl');
    };

    $scope.basicUsage = function (type, value) {
      var config = {};
      switch (type) {
        case "success":

          if (document.hasFocus()) {
            growl.success("<button class=\"btn btn-primary\" onclick=\"window.location.replace(\'" + $rootScope.url + "#/videoConferenciaAtender\');\" >Pulsa para atender</button>", { title: "Videoconferencia en espera" });

          }
          else {
            if (Notification.permission !== "granted")

              growl.success("<button class=\"btn btn-primary\" onclick=\"window.location.replace(\'" + $rootScope.url + "#/videoConferenciaAtender\');\" >Pulsa para atender</button>", { title: "Videoconferencia en espera" });

            if (Notification.permission !== "granted")
              Notification.requestPermission();
            else {



              // Thanks to the tag, we should only see the "Hi! 9" notification 
              var notification = new Notification('Video identificación en espera', {

                icon: $rootScope.url + '/webapp/img/favicon.ico',
                body: "Tiene una videoconferencia para identificación en espera",
                tag: 'soManyNotification'
              });

              setTimeout(notification.close.bind(notification), 10000);


              notification.onclick = function () {
                parent.focus();
                window.focus(); //just in case, older browsers

                window.open($rootScope.url + "#/videoConferenciaAtender", "_self", false);
              };

            }
          }
          //growl.success("<span onclick='$scope.myClickFunction()'>Click me!</span>", {userFunctions: {myClickFunction2: $rootScope.myClickFunction2}});
          break;
        case "info":
          growl.info("I'm an info message", config);
          break;
        case "warning":
          growl.warning("I'm the warning message", config);
          break;
        default:
          growl.error("Ups, error message here!", config);
      }
    };


  }]);

