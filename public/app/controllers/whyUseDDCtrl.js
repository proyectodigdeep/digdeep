angular.module('digdeepApp.whyUseDDCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('whyusedigdeep', {
		url: '/whyusedigdeep',
		templateUrl: '/app/templates/whyusedigdeep.html',
		controller: 'whyUseDDCtrl'
	})
}])

.controller('whyUseDDCtrl', [ '$scope', '$state', '$rootScope', '$interval',
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