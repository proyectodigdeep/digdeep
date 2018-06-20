angular.module('digdeepApp.homeLSCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('homeLS', {
		url: '/homeLS',
		templateUrl: '/app/templates/homeLS.html',
		controller: 'homeLSCtrl'
	})
}])

.controller('homeLSCtrl', [ '$scope', '$state', '$rootScope', 'categoryService', '$interval',
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
	categoryService.getCategoryBySlug("life-style",function (category) {
		var subcategoriesLS = category.subcategories
		// Obtener los nombres de las Subcategorias de la categoria: Life Style, para mostrarlas en el home
		categoryService.getSubcategories(function (subcategories) {
			//$scope.subcategories = subcategories
			for (var i = 0; i < subcategories.length; i++) {
				for (var j = 0; j < subcategoriesLS.length; j++) {
					if (String(subcategories[i]._id) === String(subcategoriesLS[j])) {
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
	
	$scope.goServicesLs = function (idSubcategory,titlesubcat) {
		$state.go('profilesLS', {idSubcat:idSubcategory,titlesubcat:titlesubcat})
	}
}])
