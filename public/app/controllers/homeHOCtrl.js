angular.module('digdeepApp.homeHOCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('homeHO', {
		url: '/homeHO',
		templateUrl: '/app/templates/homeHO.html',
		controller: 'homeHOCtrl'
	})
}])

.controller('homeHOCtrl', [ '$scope', '$state', '$rootScope', 'categoryService', '$interval',
function (                   $scope,   $state,   $rootScope,   categoryService,   $interval) {
	
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

	$scope.subcategories = []

	/*categoryService.getCategoryBySlug("home",function (category) {
		var subcategoriesES = category.subcategories
		// Obtener los nombres de las Subcategorias de la categoria: Home, para mostrarlas en el home
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
	})*/
	
	$scope.goServicesHo = function (idSubcategory, titlesubcat) {
		$state.go('profilesHO', {idSubcat:idSubcategory,titlesubcat:titlesubcat})
	}

}])
