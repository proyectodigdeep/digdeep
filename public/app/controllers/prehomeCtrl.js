angular.module('digdeepApp.prehomeCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('prehome', {
		url: '/',
		templateUrl: '/app/templates/prehome.html',
		controller: 'prehomeCtrl'
	})
}])

.controller('prehomeCtrl', [ '$scope', '$state', '$rootScope', '$interval', '$localStorage', 'userService',
function (                    $scope,   $state,   $rootScope,   $interval, $localStorage,  userService) {
	/*if (localStorage.accessToken) {
	    lock.getUserInfo(localStorage.accessToken, function(error, profile) {
	    	console.log("verificando cuenta")
		    if (profile && profile.email_verified == true) {
		    	var id_auth0 = profile.sub
		    	localStorage.setItem("profile", JSON.stringify(profile));
		    	userService.getTokenByIdAuth0(String(id_auth0), function (token) {
					$localStorage.token = token
					//$state.go("https://digdeep.mx/#/home")
					$rootScope.$emit('reloadUser',{done: function() {
					}})
				}, function (err) {
					$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
				})
		    }
			console.log(profile)
		})	
	}*/
	//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
	$rootScope.$emit('checkRollUser',{done: function() {
   	}})
   	$scope.typeUser = $rootScope.typeUser
	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
	// Recargar órdenes cada 5 segundos
	$interval(function(){
		//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
		$rootScope.$emit('checkRollUser',{done: function() {
   		}})
	}, 5000)
}])
