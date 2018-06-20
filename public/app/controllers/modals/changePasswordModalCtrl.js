angular.module('digdeepApp.changePasswordModalCtrl', ['ui.bootstrap'])

.controller('changePasswordModalCtrl', ['$scope', '$uibModal', '$document',
function (                               $scope,   $uibModal,   $document) {
    $scope.openChangePasswordModal = function (idUser, size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/changePasswordModal.html',
            controller: 'changePasswordInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : true,
            resolve: {
                idUser: function() {return idUser}
            }
        })
    }

}])

.controller('changePasswordInstanceModalCtrl', ['idUser', '$scope', '$rootScope', '$uibModalInstance', '$localStorage', 'userService',
function (                                       idUser,   $scope,   $rootScope,   $uibModalInstance,   $localStorage,   userService) {
    $scope.confirmpassword = null
    $scope.profileUserPassword = {
        newPassword:        null,
        currencyPassword:   null

    }
    
    this.cancel = function () {
        $uibModalInstance.close()
    }

    this.saveChange = function () {
        var isValidForm = checkEmptyForm()
        if (isValidForm === true) {
            if ($scope.confirmpassword === $scope.profileUserPassword.newPassword) {
                userService.updatePasswordUser(idUser, $scope.profileUserPassword, $localStorage.token,
                    function (user) {
                        $uibModalInstance.close()
                        //alert("Constraseña actualizada correctamente, Inicia sesión nuevamente")
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "Cambio de contraseña correcto, Inicia sesión nuevamente"
                        })
                        // cerrar la sesión del usuario
                        $rootScope.$emit('reloadlogout',{done: function() {
                        }})
                    }, function (err) {
                        console.log(err)
                        //alert("Algo salio mal, contraseña no cambiada: "+err.data.message)
                        
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "Algo salio mal, inténtalo más tarde"
                        })
                    })
            }else{
                //alert("La contraseña nueva y la contraseña de confirmación no coinciden!!!")
                $rootScope.$emit("openAlertDigdeepModal",{
                    textAlert: "Contraseñas, nueva y de confirmación no coinciden!!!"
                })
            }
        }
        
    }

    function checkEmptyForm() {
        $scope.currencyPasswordFailed = false
        $scope.newPasswordFailed = false
        $scope.confirmPasswordFailed = false

        if ($scope.profileUserPassword.currencyPassword !== null && $scope.profileUserPassword.currencyPassword !== "") {
            $scope.currencyPasswordFailed = false
            if ($scope.profileUserPassword.newPassword !== null && $scope.profileUserPassword.newPassword !== "") {
                $scope.newPasswordFailed = false
                if ($scope.confirmpassword !== null && $scope.confirmpassword !== "") {
                    $scope.confirmPasswordFailed = false
                }else{
                    $scope.confirmPasswordFailed = true
                    return false
                }
            }else{
                $scope.newPasswordFailed = true
                return false
            }
        }else{
            $scope.currencyPasswordFailed = true
            return false
        }
        return true
    }
    
}])

