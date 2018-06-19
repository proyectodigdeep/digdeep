	angular.module('digdeepApp.historyServicesCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('historyservices', {
		url: '/historyservices',
		templateUrl: '/app/templates/historyservices.html',
		controller: 'historyServicesCtrl'
	})
}])

.controller('historyServicesCtrl', [ '$scope', '$state', '$rootScope', 'ordersService', '$localStorage', '$interval',
function (                  		  $scope,   $state,   $rootScope,   ordersService,   $localStorage,   $interval) {
	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
	//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
	$rootScope.$emit('checkRollUser',{done: function() {
   	}})
   	$scope.typeUser = $rootScope.typeUser
	
	// Obtener las ordenes
    /*ordersService.getOrdersDigdeeper($scope.user._id,$localStorage.token, function (orders) {
        $scope.orders = orders
    },function(err) {
        console.log(err)
    })*/

    if ($localStorage.token == undefined) {
        $state.go("home")
    }else{
    	reloadOrders()
    	// Recargar órdenes cada 5 segundos
		$interval(function(){
			//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
			$rootScope.$emit('checkRollUser',{done: function() {
	   		}})
	   		if ($rootScope.typeUser === "userNoLogin") {
	   		}else{
	   			if ($rootScope.typeUser === "digdeeper") {
	   				reloadOrders()	
	   			}
	   		}
		}, 5000)
    }
	
	// Configuración para calificar una orden
	$scope.max = 5;
  	$scope.isReadonly = false;

  	function reloadOrders() {
  		// Obtener las ordenes
	    ordersService.getOrdersDigdeeper($scope.user._id,$localStorage.token, function (orders) {
	        $scope.orders = orders
	    },function(err) {
	        console.log(err)
	    })
  	}
}])
