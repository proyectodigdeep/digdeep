angular.module('digdeepApp.profilesBECtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('profilesBE', {
		url: '/profilesBE',
		templateUrl: '/app/templates/profilesBE.html',
		controller: 'profilesBECtrl',
		params: {
        	idSubcat: "",
        	titlesubcat: ""
    	}
	})
}])

.controller('profilesBECtrl', [ '$scope', '$state', '$rootScope', 'serviceService', '$localStorage','categoryService', '$interval','userService',
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
	$scope.subcategories = []
	$scope.titleSubcat = $state.params.titlesubcat
	if ($state.params.idSubcat) {
        $localStorage.idSubcategory = $state.params.idSubcat
    }
    // Obtener los perfiles de los digdeepers con esa subcategoria seleccionada previamente
    userService.getUsersBySubcategories($localStorage.idSubcategory, function (digdeepers) {
        $scope.digdeepers = digdeepers
    },function (err) {
        console.log(err)
    })

    // Obtener las subcategorias para llenar el menu de subcategorias
	categoryService.getCategoryBySlug("beauty",function (category) {
		var subcategoriesES = category.subcategories
		// Obtener los nombres de las Subcategorias de la categoria: Eventos sociales, para mostrarlas en el home
		categoryService.getSubcategories(function (subcategories) {
			//$scope.subcategories = subcategories
			for (var i = 0; i < subcategories.length; i++) {
				for (var j = 0; j < subcategoriesES.length; j++) {
					if (String(subcategories[i]._id) === String(subcategoriesES[j])) {
						$scope.subcategories.push(subcategories[i])
					}
				}
			}
		},function (err) {
			console.log("Algo salio mal" +err)
		})
	},function (err) {
		console.log("Algo salio mal: "+err)
	})

	$scope.goDigdeepersBe = function (idSubcategory, titleSubcat) {
		$scope.titleSubcat = titleSubcat
		$localStorage.idSubcategory = idSubcategory
		 // Obtener los perfiles de los digdeepers con esa subcategoria seleccionada previamente
         userService.getUsersBySubcategories($localStorage.idSubcategory, function (digdeepers) {
            $scope.digdeepers = digdeepers
        },function (err) {
            console.log(err)
        })
	}

    $scope.goServicesToDigdeeper = function (idDigdeeper) {
        $state.go("servicesBE",{idDigdeeper: idDigdeeper})
    }
}])
