angular.module('digdeepApp.providersCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('providers', {
		url: '/providers',
		templateUrl: '/app/templates/providers.html',
		controller: 'providersCtrl'
	})
}])

.controller('providersCtrl', [ '$localStorage', '$scope', '$state', '$rootScope', '$interval', '$http', 'userService','ordersService',
function (                  	$localStorage,   $scope,   $state,	 $rootScope,   $interval,   $http,   userService,  ordersService) {
	
   	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
    // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
    $rootScope.$emit('checkRollUser',{done: function() {
    }})
    $scope.typeUser = $rootScope.typeUser
    $scope.numProviders = 0
    $scope.limitPage = 6
    $scope.finalIndex = 0
    $scope.initIndex = 0
    $scope.numProvidersFijo = 0
    $scope.showNewUser = false
    
    if ($localStorage.token == undefined) {
        $state.go("home")
    }else{
        userService.getProviders($scope.user._id,$localStorage.token,function (providers) {
            $scope.providers = providers
            $scope.numProviders = providers.length
            $scope.numProvidersFijo = providers.length
            $scope.initIndex    = 0 * $scope.limitPage
            $scope.finalIndex   = $scope.limitPage
        },function (err) {
            console.log(err)
        })
        /*$interval(function(){
            userService.getProviders($scope.user._id,$localStorage.token,function (providers) {
                if (providers.length > $scope.numProvidersFijo) {
                    $scope.showNewUser = true
                }
                $scope.providers = providers
                $scope.numProviders = providers.length
            },function (err) {
                console.log(err)
            })
        }, 5000)*/
    }
    
    $scope.pageChanged = function (currentPage) {
        $scope.initIndex    = (currentPage-1) * $scope.limitPage
        $scope.finalIndex   = ($scope.limitPage) * (currentPage)
    }
    $scope.aprobar = function (idProvider,emailDD) {
        userService.validateProvider(idProvider,$localStorage.token,function (user) {
            sendEmailDigdeeperTrue(emailDD)
        },function (err) {
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "No se pudo actualizar el proveedor intentelo más tarde"
            })
        })
    }

    $scope.desaprobar = function (idProvider,emailDD) {
        userService.disvalidateProvider(idProvider,$localStorage.token,function (user) {
            sendEmailDigdeeperFalse(emailDD)
        },function (err) {
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "No se pudo actualizar el proveedor intentelo más tarde"
            })
        })
    }

    function sendEmailDigdeeperTrue(emailDD) {
        $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Cuenta activada, Enviando un correo a tu proveedor."})
        var html =  "<div style='text-align:center'><h3>CUENTA ACTIVA EN DIGDEEP WEB</h3></div>"+
                    "<hr>"+
                    "<div style='text-align:center'><h3>Bienvenido a Digdeep</h3>"+
                    "<p>Ya puedes configurar tu perfil y empezar a crear tus servicios para que puedan contratarte tus clientes en la plataforma.</p>"+
                    "</div>"

        var data = {
            HTML:       html,
            subject:    "ACTIVACIÓN DE CUENTA",
            to:         emailDD,// Aqui poner el correo de DIGDEEP
            text:       "Gracias por digdeepear"
        }
        $http.post("v1/emails", data)
        .then(function(response) {
            if(response.data.status === "success"){
                location.reload()
            }
            else{
                $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a DIGDEEP contactalo."})
            }
        })
    }

    function sendEmailDigdeeperFalse(emailDD) {
        $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Cuenta desactivada, Enviando un correo a tu proveedor."})
        var html =  "<div style='text-align:center'><h3>CUENTA DESACTIVADA EN DIGDEEP WEB</h3></div>"+
                    "<hr>"+
                    "<div style='text-align:center'><h3>Lo sentimos tu cuenta ha sido desactivada por DIGDEEP, ponte en contacto con el por telefono o correo, para resolver el estatus de tu cuenta</h3>"+
                    "</div>"

        var data = {
            HTML:       html,
            subject:    "DESACTIVACIÓN DE CUENTA",
            to:         emailDD,// Aqui poner el correo de DIGDEEP
            text:       "Gracias por digdeepear"
        }
        $http.post("v1/emails", data)
        .then(function(response) {
            if(response.data.status === "success"){
                location.reload()
            }
            else{
                $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a DIGDEEP contactalo."})
            }
        })
    }
}])
