angular.module('digdeepApp.homeESCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('homeES', {
		url: '/homeES',
		templateUrl: '/app/templates/homeES.html',
		controller: 'homeESCtrl'
	})
}])

.controller('homeESCtrl', [ '$scope', '$state', '$rootScope', 'categoryService', '$interval',
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

	categoryService.getCategoryBySlug("eventos-sociales",function (category) {
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
	
	$scope.goServicesEs = function (idSubcategory, titlesubcat) {
		$state.go('profilesES', {idSubcat:idSubcategory,titlesubcat:titlesubcat})
	}

}])
