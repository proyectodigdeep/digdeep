angular.module('digdeepApp.howToBeDDCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('howtobedigdeep', {
		url: '/howtobedigdeep',
		templateUrl: '/app/templates/howtobedigdeep.html',
		controller: 'howToBeDDCtrl'
	})
}])

.controller('howToBeDDCtrl', [ '$scope', '$state', 'userService', '$rootScope', '$interval',
function (                      $scope,   $state,	userService,   $rootScope,   $interval) {
	
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