angular.module('digdeepApp.homeCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: '/app/templates/home.html',
		controller: 'homeCtrl'
	})
}])

.controller('homeCtrl', [ '$scope', '$state', 'userService', '$localStorage','$rootScope', '$interval',
	function (             $scope,   $state,   userService,	  $localStorage,  $rootScope,   $interval) {
	$scope.state = ""
	$scope.wordSearch = ""
	console.log("******************Home******************")
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
