angular.module('digdeepApp.confirmEmailCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('confirmemail', {
		url: '/confirmemail',
		//templateUrl: '/app/templates/confirmemail.html',
		controller: 'confirmEmailCtrl'
	})
}])

.controller('confirmEmailCtrl', [ '$scope', '$state', 'userService', '$localStorage','$rootScope', '$interval', 'lock',
	function (             $scope,   $state,   userService,	  $localStorage,  $rootScope,   $interval, lock) {
	$state.go('prehome')
	//widow.location.href="https://digdeep.mx"
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
				   	$state.go('home')
				}, function (err) {
					$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
				})
		    }
			console.log(profile)
		})	
	}else{
		$state.go('home')
	}
		
	//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
	
	$rootScope.$emit('checkRollUser',{done: function() {
   	}})
   	$scope.typeUser = $rootScope.typeUser
}])
