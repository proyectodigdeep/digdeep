angular.module('digdeepApp.mainCtrl', [])

.controller('mainCtrl', [ '$scope', '$state','$controller', '$rootScope', '$localStorage', 'userService', 'ordersService', '$interval', 'lock',
function (                 $scope,   $state,  $controller,	 $rootScope,   $localStorage,   userService,   ordersService,   $interval,   lock) {

	// Cargar controladores para los modales
    angular.extend(this, $controller('contractServiceModalCtrl', {$scope: $scope}))
    angular.extend(this, $controller('registerDigdeeperModalCtrl', {$scope: $scope}))
    angular.extend(this, $controller('registerUserModalCtrl', {$scope: $scope}))
    angular.extend(this, $controller('changePasswordModalCtrl', {$scope: $scope}))
    angular.extend(this, $controller('deleteServiceModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('confirmOrderModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('editInfoUserModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('cancelOrderModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('finishOrderModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('newServiceLoadingModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('editInfoServiceModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('detailsServiceModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('alertDigdeepModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('detailsDigdeeperModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('commentsToDigdeeperModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('dataDeliveryModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('payTotalServiceModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('commentsServiceModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('forgetPasswordModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('loginToContractModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('factOrderModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('alertCtrl', {$scope: $scope}))
	angular.extend(this, $controller('dateInfoModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('dateInfoOutModalCtrl', {$scope: $scope}))
	angular.extend(this, $controller('newEventCalendarModalCtrl', {$scope: $scope}))
	
    $scope.showLinksReg = false
    $scope.user = {}
    $scope.emailDigdeep = "manager@digdeep.com.mx"
    $scope.tab = 0
    $scope.tabRol = 0
    
    if (localStorage.accessToken) {
	    lock.getUserInfo(localStorage.accessToken, function(error, profile) {
			console.log(error)
		    if (profile && profile.email_verified == true) {
		    	var id_auth0 = profile.sub
		    	localStorage.setItem("profile", JSON.stringify(profile));
		    	userService.getTokenByIdAuth0(String(id_auth0), function (token) {
					$localStorage.token = token
					$state.go("https://digdeep.mx/#/home")
				}, function (err) {
					$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
				})
		    }
			console.log(profile)
		})	
    }

    $scope.selecTabTop = function (numTab) {
    	$scope.tab = numTab
    }
    $scope.selecRolLogin = function (numRol) {
    	$scope.tabRol = numRol
    }

    $scope.logout = function() {
		delete localStorage.accessToken
    	delete $localStorage.token
		delete localStorage.profile
		$scope.tab = 0
		$state.transitionTo("home", {
			reload: true,
			inherit: false,
			notify: true
		})
	}
	
	$scope.refr = function() {
		console.log("Click botón salir")
		location.reload();
	}
	
	$rootScope.$on('reloadlogout', function (event) {
		delete $localStorage.token
		delete localStorage.profile
		$scope.tab = 0
		$state.go("home")
		location.reload()
	})
	
	$scope.inicializar = function() {
		if ($localStorage.token)
			$scope.user = userService.getUserFromToken($localStorage.token)
	}

	$rootScope.$on('reloadUser', function(event) {
		if ($localStorage.token) {
			$scope.user = userService.getUserFromToken($localStorage.token)
			userService.getUser($scope.user._id, function (user) {
				$scope.user.urlImg = user.urlImg
			},function (err) {
				console.log(err)
			})	
		}
	})
	
    //verifica si existe $localStorage.token
    $rootScope.typeUser = ""
    $scope.numPendingOrders = 0
    $rootScope.$on('checkRollUser', function(event, data) {
    	if ($localStorage.token === undefined) {
    		$rootScope.typeUser = "userNoLogin"
        }else{
			//	Verificar que roll de usuario es, para seleccionar que barra de menu mostrarle
			if (userService.isTokenValidAsDigdeeper($localStorage.token)) {
				if (userService.isTokenValidAsUser($localStorage.token)) {
					$rootScope.typeUser = "bothTypesUser"
					// Obtener las ordenes y buscar cuantos pedidos tiene el proveedor
					ordersService.getOrdersDigdeeper($scope.user._id,$localStorage.token, function (orders) {
						$scope.numPendingOrders = 0
				        for (var i = 0; i < orders.length; i++) {
				            // Obtiene el numero de ordenes pendientes que tiene el proveedor
				            // para mostralas en la barra de navegación
				            if (orders[i].status === 1) {
				                $scope.numPendingOrders++
				            }
				        }
				    },function(err) {
				        //console.log(err)
				    })
				}else{
					$rootScope.typeUser = "digdeeper"	
					// Obtener las ordenes y buscar cuantos pedidos tiene el proveedor
					ordersService.getOrdersDigdeeper($scope.user._id,$localStorage.token, function (orders) {
						$scope.numPendingOrders = 0
				        for (var i = 0; i < orders.length; i++) {
				            // Obtiene el numero de ordenes pendientes que tiene el proveedor
				            // para mostralas en la barra de navegación
				            if (orders[i].status === 1) {
				                $scope.numPendingOrders++
				            }
				        }
				    },function(err) {
				        //console.log(err)
				    })
				}
			}else{
				if (userService.isTokenValidAsUser($localStorage.token)) {
					if (userService.isTokenValidAsDigdeeper($localStorage.token)) {
						$rootScope.typeUser = "bothTypesUser"
						// Obtener las ordenes y buscar cuantos pedidos tiene el proveedor
						ordersService.getOrdersDigdeeper($scope.user._id,$localStorage.token, function (orders) {
							$scope.numPendingOrders = 0
					        for (var i = 0; i < orders.length; i++) {
					            // Obtiene el numero de ordenes pendientes que tiene el proveedor
					            // para mostralas en la barra de navegación
					            if (orders[i].status === 1) {
					                $scope.numPendingOrders++
					            }
					        }
					    },function(err) {
					        //console.log(err)
					    })
					}else{
						$rootScope.typeUser = "user"	
					}
				}else{
					if (userService.isTokenValidAsRoot($localStorage.token)){
						$rootScope.typeUser = "root"
					}else{
						$rootScope.typeUser = "userNoLogin"
					}
				}
			}
		}
    })

    $scope.showsubLinksReg = function () {
    	$scope.showLinksReg = true
    }

    $scope.slectTabMenu = function (numTabActive) {
    	// Tab como ser digdeep
		if (numTabActive===1) {
			$scope.classTab1 = 	"active"
			$scope.classTab2 = 	""
			$scope.classTab3 = 	""
			$scope.classTab4 =	""

			$scope.classSTab0 = ""
			$scope.classSTab1 = ""
			$scope.classSTab2 = ""
			$scope.classSTab3 = ""
			$scope.classSTab4 = ""
			$scope.classSTab5 = ""
		}
		// Tab quiero ser digdeeper
		if (numTabActive===2) {
			$scope.classTab1 = 	""
			$scope.classTab2 = 	"active"
			$scope.classTab3 = 	""
			$scope.classTab4 = 	""

			$scope.classSTab0 = ""
			$scope.classSTab1 = ""
			$scope.classSTab2 = ""
			$scope.classSTab3 = ""
			$scope.classSTab4 = ""
			$scope.classSTab5 = ""
		}
		// Tab registro
		if (numTabActive===3) {
			$scope.classTab1 = 	""
			$scope.classTab2 = 	""
			$scope.classTab3 = 	"active"
			$scope.classTab4 = 	""

			$scope.classSTab0 = ""
			$scope.classSTab1 = ""
			$scope.classSTab2 = ""
			$scope.classSTab3 = ""
			$scope.classSTab4 = ""
			$scope.classSTab5 = ""
		}
		// Tab inicio de sesión
		if (numTabActive===4) {
			$scope.classTab1 = 	""
			$scope.classTab2 = 	""
			$scope.classTab3 = 	""
			$scope.classTab4 = 	"active"

			$scope.classSTab0 = ""
			$scope.classSTab1 = ""
			$scope.classSTab2 = ""
			$scope.classSTab3 = ""
			$scope.classSTab4 = ""
			$scope.classSTab5 = ""
		}
	}
	$scope.selectTabSubMenu = function (numTabActive) {
		if (numTabActive===0) {
			$scope.classSTab0 = "color:#1D75B6 !important;"
			$scope.classSTab1 = ""
			$scope.classSTab2 = ""
			$scope.classSTab3 = ""
			$scope.classSTab4 = ""
			$scope.classSTab5 = ""

			$scope.classTab1 = ""
			$scope.classTab2 = ""
			$scope.classTab3 = ""
			$scope.classTab4 = ""
		}
		if (numTabActive===1) {
			$scope.classSTab0 = ""
			$scope.classSTab1 = "color:#1D75B6 !important;"
			$scope.classSTab2 = ""
			$scope.classSTab3 = ""
			$scope.classSTab4 = ""
			$scope.classSTab5 = ""

			$scope.classTab1 = ""
			$scope.classTab2 = ""
			$scope.classTab3 = ""
			$scope.classTab4 = ""
		}
		if (numTabActive===2) {
			$scope.classSTab0 = ""
			$scope.classSTab1 = ""
			$scope.classSTab2 = "color:#1D75B6 !important;"
			$scope.classSTab3 = ""
			$scope.classSTab4 = ""
			$scope.classSTab5 = ""

			$scope.classTab1 = ""
			$scope.classTab2 = ""
			$scope.classTab3 = ""
			$scope.classTab4 = ""
		}
		if (numTabActive===3) {
			$scope.classSTab0 = ""
			$scope.classSTab1 = ""
			$scope.classSTab2 = ""
			$scope.classSTab3 = "color:#1D75B6 !important;"
			$scope.classSTab4 = ""
			$scope.classSTab5 = ""

			$scope.classTab1 = ""
			$scope.classTab2 = ""
			$scope.classTab3 = ""
			$scope.classTab4 = ""
		}
		if (numTabActive===4) {
			$scope.classSTab0 = ""
			$scope.classSTab1 = ""
			$scope.classSTab2 = ""
			$scope.classSTab3 = ""
			$scope.classSTab4 = "color:#1D75B6 !important;"
			$scope.classSTab5 = ""

			$scope.classTab1 = ""
			$scope.classTab2 = ""
			$scope.classTab3 = ""
			$scope.classTab4 = ""
		}
		if (numTabActive===5) {
			$scope.classSTab0 = ""
			$scope.classSTab1 = ""
			$scope.classSTab2 = ""
			$scope.classSTab3 = ""
			$scope.classSTab4 = ""
			$scope.classSTab5 = "color:#1D75B6 !important;"
			
			$scope.classTab1 = ""
			$scope.classTab2 = ""
			$scope.classTab3 = ""
			$scope.classTab4 = ""
		}
	}
}])
