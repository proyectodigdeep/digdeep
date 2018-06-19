angular.module('digdeepApp.servicesHOCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('servicesHO', {
		url: '/servicesHO',
		templateUrl: '/app/templates/servicesHO.html',
		controller: 'servicesHOCtrl',
		params: {
        	idDigdeeper: ""
    	}
	})
}])

.controller('servicesHOCtrl', [ '$scope', '$state', '$rootScope', 'serviceService', '$localStorage','categoryService', '$interval','userService',
function (                  	 $scope,   $state,   $rootScope,   serviceService,   $localStorage,  categoryService,   $interval,  userService) {
	
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
    serviceService.getServicesOfUser($localStorage.idDigdeeper,function (services) {
        $scope.services = services
    },function (err) {
        console.log(err)
    })
    userService.getUser($localStorage.idDigdeeper,function (digdeeper) {
        $scope.digdeeperData = digdeeper
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

	$scope.goServicesHo = function (idSubcategory, titleSubcat) {
		//$state.go('servicesES', {idSubcat:idSubcategory})
		//$scope.titleSubcat = titleSubcat
		//$localStorage.idSubcategory = idSubcategory
	
        /*$scope.services = []
		// Obtener y seleccionar los servicios de la categoria Eventos sociales,
		// con la subctegoria seleccionada previamente.
		serviceService.getServices(function (services) {
		for (var i = 0; i < services.length; i++) {
			if (String(services[i]._subcategory) === String(idSubcategory)) {
                if (services[i].price <= $scope.rangePrice) {
                    $scope.services.push(services[i])   
                }
				//$scope.services.push(services[i])
			}
		}
		},function (err) {
			console.log(err)
		})*/
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
			serviceService.getServicesOfUser($localStorage.idDigdeeper,function (services) {
                $scope.services = []
				for (var i = 0; i < services.length; i++) {
				    if (services[i].price <= $scope.rangePrice) {
                        $scope.services.push(services[i])   
                    }
				}
			},function (err) {
				console.log(err)
			})
    	}else{
    		$scope.services = []
    		serviceService.getServicesOfUser($localStorage.idDigdeeper,function (services) {
                $scope.services = []
		        for (var i = 0; i < services.length; i++) {
        			var position = -1
        			var blocked  = false

        			if (blocked === false) {
        				if ($scope.filters.decorations === true) {
        					position = services[i].filters.indexOf("decorations");
        					if (position >= 0) {
    						    if (services[i].price <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
        					}
        				}
        			}
        			if (blocked === false) {
        				if ($scope.filters.fashion === true) {
        					position = services[i].filters.indexOf("fashion");
        					if (position >= 0) {
        						if (services[i].price <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
        					}
        				}
        			}
			 	
        			if (blocked === false) {
        				if($scope.filters.cocktails === true){
        					position = services[i].filters.indexOf("cocktails");
        					if (position >= 0) {
        						if (services[i].price <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
        					}
        				}
        			}
        			if (blocked === false) {
        				if($scope.filters.nutrition    === true){
        					position = services[i].filters.indexOf("nutrition");
        					if (position >= 0) {
        						if (services[i].price <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
        					}
        				}
        			}
        			if (blocked === false) {
        				if($scope.filters.concerts     === true){
        					position = services[i].filters.indexOf("concerts");
        					if (position >= 0) {
        						if (services[i].price <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
        					}
        				}
        			}
        			if (blocked === false) {
        				if ($scope.filters.parties     === true) {
        					position = services[i].filters.indexOf("parties");
        					if (position >= 0) {
        						if (services[i].price <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
        					}
        				}
        			}
        			if (blocked === false) {
        				if ($scope.filters.culture     === true) {
        					position = services[i].filters.indexOf("culture");
        					if (position >= 0) {
        						if (services[i].price <= $scope.rangePrice) {
                                    $scope.services.push(services[i])
                                    blocked = true   
                                }
        					}
        				}
        			}
        			if (blocked === false) {
        				if ($scope.filters.food        === true) {
        					position = services[i].filters.indexOf("food");
        					if (position >= 0) {
        						if (services[i].price <= $scope.rangePrice) {
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
