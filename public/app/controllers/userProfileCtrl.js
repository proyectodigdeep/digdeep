angular.module('digdeepApp.userProfileCtrl', [])
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    }
}])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('userprofile', {
		url: '/userprofile',
		templateUrl: '/app/templates/userprofile.html',
		controller: 'userProfileCtrl'
	})
}])

.controller('userProfileCtrl', [ '$scope', '$state', '$rootScope', 'userService', '$localStorage', 'ordersService', 'serviceService','$interval',
	function (					  $scope,   $state,   $rootScope,	userService,   $localStorage,   ordersService,   serviceService,  $interval) {
	// Obtener el tipo de usuario para mostrar la barra de navegación acorde a el
	$rootScope.$emit('checkRollUser',{done: function() {
	}})
	$scope.typeUser = $rootScope.typeUser
	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
	$scope.limitPage = 6
    $scope.finalIndex = 0
    $scope.initIndex = 0
    
	// Recargar órdenes cada 5 segundos
	$interval(function(){
		//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
		$rootScope.$emit('checkRollUser',{done: function() {
   		}})
   		if ($rootScope.typeUser === "userNoLogin") {
   		}else{
   			if ($rootScope.typeUser === 'user') {
   				reloadOrders()	
   				verifyMethodPay()
   			}
   		}
	}, 5000)

	$scope.goAlertAddress = function (idusr) {
		userService.getUser(idusr,function (usr) {
			$rootScope.$emit("openAlert",{
                textAlert: "Dirección: \n"+usr.address+", # "+usr.numberHouse+","+usr.colony+", CP. "+ usr.postalCode+", "+usr.city+", "+usr.state
            })
		},function (err) {
			
		})
	}
	// Enviar un correo para configurar tu contraseña
	$scope.changePasswordAuth0 = function (email) {
		console.log($scope.user)
		if ($scope.user.auth0Id.indexOf('auth0') != -1) {
			userService.changePasswordAuth0(email, function (message) {
				if (message == "We've just sent you an email to reset your password.") {
					$rootScope.$emit("openAlertDigdeepModal",{
		                textAlert: "Te hemos enviado a tu correo un email para cambiar tu contraseña."
		            })
				}else{
					$rootScope.$emit("openAlertDigdeepModal",{
		                textAlert: "Lo sentimos tenemos problemas con restablecer tu constraseña intentalo más tarde."
		            })
				}
			}, function (err) {
				console.log(err)
			})
		}else{
			$rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Tu cuenta esta registrada con una red social, debes cambiar tu contraseña desde la cuenta de tu red social."
            })
		}
	}

	$scope.pageChanged = function (currentPage) {
        $scope.initIndex    = (currentPage-1) * $scope.limitPage
        $scope.finalIndex   = ($scope.limitPage) * (currentPage)
    }
    
	$scope.initDataProfileUser = function () {
		userService.getUser($scope.user._id, function (user) {
			$scope.profileUser = {
				fullname: 			user.fullname,
				address: 			user.address,
				colony: 			user.colony,
				postalCode: 		user.postalCode,
				numberHouse: 		user.numberHouse,
				city: 				user.city,
				state: 				user.state,
				email: 				user.email,
				phone: 				user.phone,
				newPassword: 		"",
				currencyPassword: 	"",
				birthdate: 			user.birthdate,
				urlImg: 			user.urlImg
			}
			// Separar la fecha de nacimiento para poder mostrarla en formulario 
			if (user.birthdate) {
				var arrayDate = user.birthdate.split("/")	
				$scope.profileUserTemp = {
					address:    user.address,
					colony:  	user.colony,
					postalCode: user.postalCode,
					numberHouse:user.numberHouse,
					city:       user.city,  
					state:      user.state,
					dayDate:  	parseInt(arrayDate[0]),
					monthDate: 	arrayDate[1],
					yearDate: 	parseInt(arrayDate[2])
				}
			}else{
				$scope.profileUserTemp = {
					address:    user.address,
					colony:  	user.colony,
					postalCode: user.postalCode,
					numberHouse:user.numberHouse,
					city:       user.city,  
					state:      user.state,
					dayDate:  	null,
					monthDate: 	null,
					yearDate: 	null
				}
			}
			
		},function (err) {
			if ($localStorage.token == undefined) {
				$state.go("home")
			}
			console.log(err)
		})
		if ($rootScope.typeUser === 'user'){
			ordersService.getOrdersClient($scope.user._id, $localStorage.token, function (orders) {
				$scope.orders = orders
				$scope.numOrders = orders.length
		        $scope.initIndex    = 0 * $scope.limitPage
		        $scope.finalIndex   = $scope.limitPage
			},function (err) {
				console.log(err)
			})
		}

		// Configuración para calificar una orden
		$scope.max = 5;
	  	$scope.isReadonly = false;
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
			$rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Este servicio ya lo has calificado antes"
            })
		})
	}

	$scope.updateUserProfile = function () {
		$scope.profileUser.birthdate = $scope.profileUserTemp.dayDate+"/"+$scope.profileUserTemp.monthDate+"/"+$scope.profileUserTemp.yearDate
		userService.updateUserProfile($scope.user._id, $scope.profileUser, $localStorage.token,
			function (user) {
				$rootScope.$emit("openAlertDigdeepModal",{
					textAlert: "Usuario actualizado correctamente"
				})
				$scope.initDataProfileUser()
			}, function (err) {
				console.log(err)
				$rootScope.$emit("openAlertDigdeepModal",{
					textAlert: "Algo salio mal, usuario no actualizado"
				})
			})
	}

	function reloadOrders() {
    	// Obtener las ordenes
	    ordersService.getOrdersClient($scope.user._id, $localStorage.token, function (orders) {
			$scope.orders = orders
		},function (err) {
			console.log(err)
		})
	}
	function verifyMethodPay() {
        userService.verifyMethodPay($scope.user._id, $localStorage.token, function (methodsPay) {
        	if (methodsPay != undefined && methodsPay.data.length > 0) {
                $scope.methodsPay = methodsPay.data
                console.log($scope.methodsPay)
            }
        }, function (err) {
            console.log(err)
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
	};
}])