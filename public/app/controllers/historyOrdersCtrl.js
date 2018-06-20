angular.module('digdeepApp.historyOrdersCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('historyorders', {
		url: '/historyorders',
		templateUrl: '/app/templates/historyorders.html',
		controller: 'historyOrdersCtrl'
	})
}])

.controller('historyOrdersCtrl', ['serviceService', 'userService', '$scope', '$state', '$rootScope', '$interval', 'ordersService', '$localStorage',
function (                  	   serviceService,   userService,   $scope,   $state,   $rootScope,   $interval,   ordersService,   $localStorage) {
	//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
	$rootScope.$emit('checkRollUser',{done: function() {
   	}})
   	$scope.typeUser = $rootScope.typeUser
	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})

	// Obtener las ordenes
    /*if ($rootScope.typeUser === 'bothTypesUser'){
		ordersService.getOrdersClient($scope.user._id, $localStorage.token, function (orders) {
			$scope.orders = orders
		},function (err) {
			console.log(err)
		})
	}*/
	// Configuración para calificar una orden
	$scope.max = 5;
  	$scope.isReadonly = false;

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
	   			if ($rootScope.typeUser === "bothTypesUser") {
	   				reloadOrders()	
	   			}
	   		}
		}, 5000)
    }

	// bloquear cancelación si el servicio es express(menor a 3 dias)
	// bloquear cancelación si el servicio es puntual(mayor a 3 dias pero ya paso ñas 24 horas de que lo contrato)
	$scope.checkDateBlocked = function (orden) {
		var dateStandar1 = new Date(orden.requestedDate)
        dateStandar1.setDate(dateStandar1.getDate() + 3)
		var dateInitTemp = new Date(orden.dataService.dateInit)
        if (dateInitTemp > dateStandar1) {
			var dateCurrent = new Date()
			var limitDate = new Date(orden.requestedDate)
			limitDate.setHours(limitDate.getHours() + 24)
			if (dateCurrent <= limitDate) {
	        	return true
	        }else{
	        	return false
	        }
        }else{
            return false
        }
	}
	
	$scope.goAlertAddress = function (idusr) {
		userService.getUser(idusr,function (usr) {
			$rootScope.$emit("openAlert",{
                textAlert: "Dirección: \n"+usr.address+", # "+usr.numberHouse+","+usr.colony+", CP. "+ usr.postalCode+", "+usr.city+", "+usr.state
            })
		},function (err) {
			
		})
	}
	
	$scope.hoveringOver = function(value) {
	    $scope.overStar = value;
	    $scope.percent = 100 * (value / $scope.max);
	}

	$scope.selecRate = function (id_order, value) {
		ordersService.qualifyService(id_order, value, $localStorage.token, function (order) {
			$rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Calificado con éxito"
            })
		},function (err) {
			alert("Este servicio ya lo has calificado antes")
		})
	}

	$scope.createOrdenToSpei = function(order) {		
		var payDate = new Date()
		ordersService.payOrder(order._id, payDate, null, 'spei', $localStorage.token, function (ord) {			
			$rootScope.$emit("openAlertDigdeepModal", {
				textAlert: "Orden generada exitosamente, en unos minutos recibirá un correo con la información de pago."
			});
		}, function (err) {			
			console.error('err ordern response: ', err);
			$rootScope.$emit("openAlertDigdeepModal", {
				textAlert: "Algo salio mal, orden no generada"
			})
		});                        
	}

	function reloadOrders() {
    	// Obtener las ordenes
	    ordersService.getOrdersClient($scope.user._id, $localStorage.token, function (orders) {
			$scope.orders = orders
		},function (err) {
			console.log(err)
		})
    }
}])
