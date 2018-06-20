angular.module('digdeepApp.loginToContractModalCtrl', ['ui.bootstrap','digdeepApp.loginToContractModalCtrl'])

.controller('loginToContractModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                                $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openLoginToContractModal = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/loginToContractModal.html',
            controller: 'loginContractModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : false
        })     
    }

    $rootScope.$on('openLoginToContractModal', function() {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/loginToContractModal.html',
            controller: 'loginContractModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : false
        })     
    })

}])

.controller('loginContractModalInstanceCtrl', ['$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state', 'userService', '$http',
function (                                      $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state,   userService,   $http) {
    
    $scope.usr = {
        email: "",
        password: ""
    }
    this.forgetPassword = function () {
        $rootScope.$emit("openForgetPasswordModal")
    }
    this.cancel = function () {
        $uibModalInstance.close()
        location.reload()
    }
    this.goRegister = function () {
        $state.go("registeruser")
        $uibModalInstance.close()
        location.reload()
    }
    this.back = function () {
        $uibModalInstance.close()
        location.reload()
    }
    this.login2 = function(user,pass) {
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
                // Verificar si el token es válido como DigDeeper(proveedor)
                if (userService.isTokenValidAsDigdeeper(response.data.token)) {
                    $localStorage.token = response.data.token //guardar token en local storage response.data.token
                    if (userService.isTokenValidAsUser(response.data.token)) {
                         // Obtener los datos del usuario para mostrar su perfil
                        $rootScope.$emit('reloadUser',{done: function() {
                        }})
                        // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
                        $rootScope.$emit('checkRollUser',{done: function() {
                        }})
                        $scope.typeUser = $rootScope.typeUser
                        $uibModalInstance.close()
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "Sesión iniciada correctamente, disfruta de tu compra."
                        })
                    }
                    else{
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "No tienes el rol autorizado para hacer compras"
                        })
                        // Obtener los datos del usuario para mostrar su perfil
                        $rootScope.$emit('reloadUser',{done: function() {
                        }})
                        // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
                        $rootScope.$emit('checkRollUser',{done: function() {
                        }})
                        $scope.typeUser = $rootScope.typeUser
                        $uibModalInstance.close()
                        $state.go('digdeeperprofile')   
                    }
                }
                else{
                    // Verificar si el token es válido como Usuario
                    if (userService.isTokenValidAsUser(response.data.token)) {
                        $localStorage.token = response.data.token //guardar token en local storage response.data.token
                         // Obtener los datos del usuario para mostrar su perfil
                        $rootScope.$emit('reloadUser',{done: function() {
                        }})
                        // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
                        $rootScope.$emit('checkRollUser',{done: function() {
                        }})
                        $scope.typeUser = $rootScope.typeUser
                        $uibModalInstance.close()
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "Sesión iniciada correctamente, disfruta de tu compra."
                        })
                    }else{
                        if (userService.isTokenValidAsRoot(response.data.token)) {
                            $localStorage.token = response.data.token //guardar token en local storage response.data.token
                            // Obtener los datos del usuario para mostrar su perfil
                            $rootScope.$emit('reloadUser',{done: function() {
                            }})
                            // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
                            $rootScope.$emit('checkRollUser',{done: function() {
                            }})
                            $scope.typeUser = $rootScope.typeUser
                            $uibModalInstance.close()
                            $state.go('userprofile')
                        }else{
                            delete $localStorage.token
                            //alert("Usuario no autorizado, solicita acceso como DigDeeper (proveedor) ó Usuario de DigDeep")
                            $rootScope.$emit("openAlertDigdeepModal",{
                                textAlert: "Usuario no autorizado, solicita acceso como DigDeeper (proveedor) ó Usuario de DigDeep"
                            })
                            $uibModalInstance.close()
                        }
                    }
                }
                
            }else{
                console.log(response.data.message)
                alert("Error al iniciar sesión")
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

