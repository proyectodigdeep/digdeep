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
