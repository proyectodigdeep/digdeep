angular.module('digdeepApp.homeBECtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('homeBE', {
		url: '/homeBE',
		templateUrl: '/app/templates/homeBE.html',
		controller: 'homeBECtrl'
	})
}])

.controller('homeBECtrl', [ '$scope', '$state', '$rootScope', '$interval','categoryService',
function (                 	 $scope,   $state,	 $rootScope,   $interval, categoryService) {
	
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
	
	$scope.goServicesBe = function (idSubcategory, titlesubcat) {
		$state.go('profilesBE', {idSubcat:idSubcategory,titlesubcat:titlesubcat})
	}

}])
