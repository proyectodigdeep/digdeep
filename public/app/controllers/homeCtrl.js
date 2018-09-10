angular.module('digdeepApp.homeCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: '/app/templates/home.html',
		controller: 'homeCtrl'
	})
}])

.controller('homeCtrl', [ '$scope', '$state', 'userService', '$localStorage','$rootScope', '$interval', 'lock',
	function (             $scope,   $state,   userService,	  $localStorage,  $rootScope,   $interval, lock) {
	$scope.state = ""
	$scope.wordSearch = ""
	console.log("******************Home******************")
	if (localStorage.accessToken) {
		lock.getUserInfo(localStorage.accessToken, function(error, profile) {
			console.log(error)
		    if (profile && profile.email_verified == true) {
		    	var id_auth0 = profile.sub
		    	localStorage.setItem("profile", JSON.stringify(profile));
		    	userService.getTokenByIdAuth0(String(id_auth0), function (token) {
					$localStorage.token = token
					//$state.go("https://digdeep.mx/#/home")
					//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
					// Obtener los datos del usuario para mostrar su perfil
					$rootScope.$emit('reloadUser',{done: function() {
					}})
					
					$rootScope.$emit('checkRollUser',{done: function() {
				   	}})
				}, function (err) {
					$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
				})
		    }
			console.log(profile)
		})	
	}
		
	//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
	
	$rootScope.$emit('checkRollUser',{done: function() {
   	}})
   	$scope.typeUser = $rootScope.typeUser
	// Recargar órdenes cada 5 segundos
	$interval(function(){

		//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
		$rootScope.$emit('checkRollUser',{done: function() {
   		}})
	}, 5000)
	
	$scope.searchService = function () {
		console.log($scope.state)
		console.log($scope.wordSearch)
	}
}])
