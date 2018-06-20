angular.module('digdeepApp.loginCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: '/app/templates/login.html',
		controller: 'loginCtrl'
	})
}])

.controller('loginCtrl', ['$rootScope', '$scope', '$http', '$localStorage', '$state', 'userService',
function (                 $rootScope,   $scope,   $http,   $localStorage,   $state,   userService) {
	//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
	$rootScope.$emit('checkRollUser',{done: function() {
	}})
	$scope.login = function(user,pass) {
		$http({
		    method: 'POST',
		    url: "v1/authenticate",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    transformRequest: function(obj) {
		        var str = []
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
		        return str.join("&")
		    },
		    data: {email: user, password: pass}
		}).then(function (response) {
			if (response.data.success) {
				// Verificar si el rol a sido seleccionado
				if ($scope.tabRol === 0) {
					// Checar si el rol es root
					if (userService.isTokenValidAsRoot(response.data.token)) {
						$localStorage.token = response.data.token //guardar token en local storage response.data.token
						$state.go('userprofile')
					}else{
						delete $localStorage.token
						$rootScope.$emit("openAlertDigdeepModal",{
							textAlert: "Debes seleccionar un rol primero."
						})	
					}
				}
				// Verificar si el rol es cliente
				if ($scope.tabRol === 1) {
					// Checa si tiene los dos roles
					if (userService.isTokenValidAsUser(response.data.token) && userService.isTokenValidAsDigdeeper(response.data.token)) {
						$localStorage.token = response.data.token //guardar token en local storage response.data.token
						$state.go('digdeeperprofile')
					}else{
						// Checa si tiene el rol cliente
						if (userService.isTokenValidAsUser(response.data.token)) {
							$localStorage.token = response.data.token //guardar token en local storage response.data.token
							$state.go('userprofile')
						}else{
							if (userService.isTokenValidAsDigdeeper(response.data.token)) {
								$rootScope.$emit("openAlertDigdeepModal",{
									textAlert: "El rol que seleccionaste no coincide con el correo."
								})
							}else{
								$rootScope.$emit("openAlertDigdeepModal",{
									textAlert: "Este correo no se encuentra en nuestra base de datos."
								})
							}
						}
					}
				}
				// Verificar si el rol proveedor
				if ($scope.tabRol === 2) {
					// Checa si tiene los dos roles
					if (userService.isTokenValidAsUser(response.data.token) && userService.isTokenValidAsDigdeeper(response.data.token)) {
						$localStorage.token = response.data.token //guardar token en local storage response.data.token
						$state.go('digdeeperprofile')
					}else{
						// Checa si tiene el rol proveedor
						if (userService.isTokenValidAsDigdeeper(response.data.token)) {
							$localStorage.token = response.data.token //guardar token en local storage response.data.token
							$state.go('digdeeperprofile')
						}else{
							if (userService.isTokenValidAsUser(response.data.token)) {
								$rootScope.$emit("openAlertDigdeepModal",{
									textAlert: "El rol que seleccionaste no coincide con el correo."
								})
							}else{
								$rootScope.$emit("openAlertDigdeepModal",{
									textAlert: "Este correo no se encuentra en nuestra base de datos."
								})
							}
						}
					}
				}
				
			}else{
				$rootScope.$emit("openAlertDigdeepModal",{
					textAlert: "Error al iniciar sesión, verifica tus datos e inténtalo de nuevo"
				})
			}
		},function (err){
			//console.log(err)
			//alert("Error al iniciar sesión")
			$rootScope.$emit("openAlertDigdeepModal",{
				textAlert: "Error al iniciar sesión, verifica tus datos e inténtalo de nuevo"
			})
   		})
	}
}])