angular.module('digdeepApp.inboxProfileCtrl', ['digdeepApp.confirmOrderModalCtrl'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('inboxprofiledd', {
		url: '/inboxprofiledd',
		templateUrl: '/app/templates/inboxprofiledd.html',
		controller: 'inboxProfileCtrl'
	})
}])

.controller('inboxProfileCtrl', [ '$scope', '$state', '$rootScope', 'ordersService', '$localStorage', '$interval',
function (                  	   $scope,   $state,   $rootScope,   ordersService,   $localStorage,   $interval) {
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
	
	if ($localStorage.token == undefined) {
        $state.go("home")
    }else{
    	reloadOrders()
		/*$interval(function(){
			reloadOrders()
		}, 5000)*/
    }
	
	$scope.pageChanged = function (currentPage) {
        $scope.initIndex    = (currentPage-1) * $scope.limitPage
        $scope.finalIndex   = ($scope.limitPage) * (currentPage)
    }

    function reloadOrders() {
    	// Obtener las ordenes y buscar cuantos pedidos tiene el proveedor
		ordersService.getOrdersDigdeeper($scope.user._id, $localStorage.token, function (orders) {
			$scope.orders = orders
			$scope.numOrders = orders.length
		},function(err) {
			console.log(err)
		})
    }
}])
