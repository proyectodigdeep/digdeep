angular.module('digdeepApp.whatIsDDCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('whatisdigdeep', {
		url: '/whatisdigdeep',
		templateUrl: '/app/templates/whatisdigdeep.html',
		controller: 'whatIsDDCtrl'
	})
}])

.controller('whatIsDDCtrl', [ '$scope', '$state', '$rootScope', '$interval',
function (                     $scope,   $state,   $rootScope,   $interval) {
	
	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
	//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
	$rootScope.$emit('checkRollUser',{done: function() {
   	}})
   	$scope.typeUser = $rootScope.typeUser
	// Recargar órdenes cada 5 segundos
	$interval(function(){
		//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
		$rootScope.$emit('checkRollUser',{done: function() {
   		}})
	}, 5000)
}])