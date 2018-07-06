angular.module('digdeepApp.servicesLSCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('servicesLS', {
		url: '/servicesLS',
		templateUrl: '/app/templates/servicesLS.html',
		controller: 'servicesLSCtrl',
		params: {
			idDigdeeper: ""
		}
	})
}])

.controller('servicesLSCtrl', [ '$scope', '$state', '$rootScope', 'serviceService', '$localStorage', 'categoryService', '$interval','userService',
function (                  	 $scope,   $state,   $rootScope,   serviceService,   $localStorage,   categoryService,   $interval,  userService) {
	
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
	$scope.max = 5;
    $scope.services = []
	$scope.filters        = {
        decorations:    false,
        fashion:        false,
        cocktails:      false,
        nutrition:      false,
        concerts:       false,
        parties:        false,
        culture:        false,
        food:           false
    }
    $scope.rangePrice = 10000
	if ($state.params.idDigdeeper) {
        $localStorage.idDigdeeper = $state.params.idDigdeeper
    }
	serviceService.getServicesByDigdeeperComments($localStorage.idDigdeeper,function (services) {
        $scope.services = services
    },function (err) {
        console.log(err)
    })
    userService.getUser($localStorage.idDigdeeper,function (digdeeper) {
        $scope.digdeeperData = digdeeper
        // Obtener el tipo de costos que debe de tener el usuario
        var userTemp = digdeeper
        if ((userTemp.kindServices.indexOf('athome') != -1) && (userTemp.kindServices.indexOf('presencial') != -1)) {
            $scope.typePrice = 1
        }else{
            if (userTemp.kindServices.indexOf('athome') != -1) {
                $scope.typePrice = 2
            }else{
                if (userTemp.kindServices.indexOf('presencial') != -1) {
                    $scope.typePrice = 3
                }
            }
        }
    },function (err) {
        console.log(err)
    })

    $scope.cleanFilters = function () {
        $scope.filters        = {
            decorations:    false,
            fashion:        false,
            cocktails:      false,
            nutrition:      false,
            concerts:       false,
            parties:        false,
            culture:        false,
            food:           false
        }
        $scope.chooseFilter()
    }
	
	function verifyNullFilters() {
		var nothingFilter = true 
		if ($scope.filters.decorations === true) {
			return false
		}
		if ($scope.filters.fashion === true) {
			return false
		}
		if ($scope.filters.cocktails === true) {
			return false
		}
		if ($scope.filters.nutrition === true) {
			return false
		}
		if ($scope.filters.concerts === true) {
			return false
		}
		if ($scope.filters.parties === true) {
			return false
		}
		if ($scope.filters.culture === true) {
			return false
		}
		if ($scope.filters.food === true) {
			return false
		}
		return true
	}
	
    $scope.choosePrice = function () {
        //console.log($scope.rangePrice)
        $scope.services = []
        $scope.chooseFilter()
    }
	// Función que recolecta los filtros de busqueda
    $scope.chooseFilter = function () {
    	if(verifyNullFilters()){
    		$scope.services = []
            serviceService.getServicesByDigdeeperComments($localStorage.idDigdeeper,function (services) {
                $scope.services = []
                for (var i = 0; i < services.length; i++) {
                    if (services[i].service.price_presencial <= $scope.rangePrice) {
                        $scope.services.push(services[i])   
                    }
                }
            },function (err) {
                console.log(err)
            })
    	}else{
            $scope.services = []
            serviceService.getServicesByDigdeeperComments($localStorage.idDigdeeper,function (services) {
                $scope.services = []
                for (var i = 0; i < services.length; i++) {
                    var position = -1
                    var blocked  = false

                    if (blocked === false) {
                        if ($scope.filters.decorations === true) {
                            position = services[i].service.filters.indexOf("decorations");
                            if (position >= 0) {
                                if (services[i].service.price_presencial <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
                            }
                        }
                    }
                    if (blocked === false) {
                        if ($scope.filters.fashion === true) {
                            position = services[i].service.filters.indexOf("fashion");
                            if (position >= 0) {
                                if (services[i].service.price_presencial <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
                            }
                        }
                    }
                
                    if (blocked === false) {
                        if($scope.filters.cocktails === true){
                            position = services[i].service.filters.indexOf("cocktails");
                            if (position >= 0) {
                                if (services[i].service.price_presencial <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
                            }
                        }
                    }
                    if (blocked === false) {
                        if($scope.filters.nutrition    === true){
                            position = services[i].service.filters.indexOf("nutrition");
                            if (position >= 0) {
                                if (services[i].service.price_presencial <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
                            }
                        }
                    }
                    if (blocked === false) {
                        if($scope.filters.concerts     === true){
                            position = services[i].service.filters.indexOf("concerts");
                            if (position >= 0) {
                                if (services[i].service.price_presencial <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
                            }
                        }
                    }
                    if (blocked === false) {
                        if ($scope.filters.parties     === true) {
                            position = services[i].service.filters.indexOf("parties");
                            if (position >= 0) {
                                if (services[i].service.price_presencial <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
                            }
                        }
                    }
                    if (blocked === false) {
                        if ($scope.filters.culture     === true) {
                            position = services[i].service.filters.indexOf("culture");
                            if (position >= 0) {
                                if (services[i].service.price_presencial <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
                            }
                        }
                    }
                    if (blocked === false) {
                        if ($scope.filters.food        === true) {
                            position = services[i].service.filters.indexOf("food");
                            if (position >= 0) {
                                if (services[i].service.price_presencial <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
                            }
                        }
                    }
                }
            },function (err) {
                console.log(err)
            })
    	}
    }
}])
