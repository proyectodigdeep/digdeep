angular.module('digdeepApp.listOrdersCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('listOrders', {
		url: '/listOrders',
		templateUrl: '/app/templates/listOrders.html',
		controller: 'listOrdersCtrl'
	})
}])

.controller('listOrdersCtrl', [ '$localStorage', '$scope', '$state', '$rootScope', '$interval', '$http','ordersService',
function (                  	 $localStorage,   $scope,   $state,	 $rootScope,    $interval,   $http,  ordersService) {
	
   	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
    // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
    $rootScope.$emit('checkRollUser',{done: function() {
    }})
    $scope.typeUser = $rootScope.typeUser
    $scope.numOrders = 0
    $scope.tabCurrentOrders = 1 // ordenes pendientes por default 
    $scope.orders = []
    $scope.limitPage = 6
    $scope.finalIndex = 0
    $scope.initIndex = 0
    $scope.currentTab = 1 

     if ($localStorage.token == undefined) {
        $state.go("home")
    }else{
        ordersService.getOrdersPending($localStorage.token,function (orders) {
            $scope.orders = orders
            $scope.numOrders = orders.length
            $scope.initIndex    = 0 * $scope.limitPage
            $scope.finalIndex   = $scope.limitPage
        },function (err) {
            console.log(err)
        }) 
        // Recargar órdenes cada 5 segundos
        $interval(function(){
            if ($rootScope.typeUser === "root") {
                reloadOrders($scope.currentTab)
            }
        }, 5000)
    }
    
    $scope.pageChanged = function (currentPage) {
        $scope.initIndex    = (currentPage-1) * $scope.limitPage
        $scope.finalIndex   = ($scope.limitPage) * (currentPage)
    }
    
    $scope.selectTabmenu = function (tabCurrent) {
        reloadOrders(tabCurrent)
    }

    function reloadOrders (tabCurrent) {
        $scope.currentTab = tabCurrent
        $scope.tabCurrentOrders = tabCurrent
        if (tabCurrent === 1) {
            ordersService.getOrdersPending($localStorage.token,function (orders) {
                $scope.orders = orders
                $scope.numOrders = orders.length
            },function (err) {
                console.log(err)
            }) 
        }  
        if (tabCurrent === 2) {
            ordersService.getOrdersInprocess($localStorage.token,function (orders) {
                $scope.orders = orders
                $scope.numOrders = orders.length
            },function (err) {
                console.log(err)
            }) 
        }  
        if (tabCurrent === 3) {
            ordersService.getOrdersFinished($localStorage.token,function (orders) {
                $scope.orders = orders
                $scope.numOrders = orders.length
            },function (err) {
                console.log(err)
            }) 
        }  
        if (tabCurrent === 4) {
            ordersService.getOrdersCanceled($localStorage.token,function (orders) {
                $scope.orders = orders
                $scope.numOrders = orders.length
            },function (err) {
                console.log(err)
            }) 
        }  
        if (tabCurrent === 5) {
            ordersService.getOrdersPay($localStorage.token,function (orders) {
                $scope.orders = orders
                $scope.numOrders = orders.length
            },function (err) {
                console.log(err)
            }) 
        }  
    }
}])
