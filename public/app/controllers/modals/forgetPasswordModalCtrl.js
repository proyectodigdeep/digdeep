angular.module('digdeepApp.forgetPasswordModalCtrl', ['ui.bootstrap'])

.controller('forgetPasswordModalCtrl', ['$scope', '$uibModal', '$document','$rootScope',
function (                               $scope,   $uibModal,   $document,  $rootScope) {
    $scope.openForgetPasswordModal = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/forgetPasswordModal.html',
            controller: 'forgetPasswordInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : true
        })
    }
    $rootScope.$on('openForgetPasswordModal', function() {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/forgetPasswordModal.html',
            controller: 'forgetPasswordInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : true
        })     
    })

}])

.controller('forgetPasswordInstanceModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$localStorage', 'userService','$http',
function (                                       $scope,   $rootScope,   $uibModalInstance,   $localStorage,   userService,  $http) {
    $scope.emailUser = ""
    
    this.cancel = function () {
        $uibModalInstance.close()
    }
    this.verifyEmail = function () {
        userService.verifyUserByEmail($scope.emailUser,function (user) {
            if (user) {
                saveChange(user._id)
            }else{
                $rootScope.$emit("openAlertDigdeepModal",{
                    textAlert: "Este correo no ha sido registrado en DIGDEEP verifica tu correo."
                })
            }
        },function (err) {
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Este correo no ha sido registrado en DIGDEEP, verifica tu correo."
            })
        })
    }
    function saveChange(idUser) {
        userService.updateForgetPasswordUser(idUser,function (passwordTemp) {
            console.log(passwordTemp)
            sendEmailClient(passwordTemp)
            $uibModalInstance.close()
            //alert("Constraseña actualizada correctamente, Inicia sesión nuevamente")
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Se enviara un correo a "+$scope.emailUser+" con una contraseña temporal, y cámbiala lo antes posible."
            })
        }, function (err) {
            console.log(err)
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Algo salio mal, inténtalo más tarde"
            })
        })
    }
    function sendEmailClient(pass) {
        // Configurando datos para genarar el correo a enviar a digdeep
        var html =  "<div style='text-align:center'><h3>SALUDOS POR PARTE DE DIGDEEP</h3></div>"+
                    "<div style='text-align:center'><p>Se solicito un cambio de contraseña con tu correo</p></div>"+
                    "<div style='text-align:center'>"+
                        "<p>E-mail: "+$scope.emailUser+"</p>"+
                        "<p>Tu contraseña fue cambiada por una temporalmente, ingresa con tu nueva contraseña y cámbiala lo antes posible.</p>"+
                        "<p>Contraseña temporal: "+pass+"</p>"+
                    "</div>"
        var data = {
            HTML:       html,
            subject:    "Solicitud de cambio de contraseña DIGDEEP WEB",
            to:         $scope.emailUser //Correo del cliente 
        }
        $http.post("v1/emails", data)
        .then(function(response) {
        },function (response) {
            $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo enviar su correo de confirmación comuniquese al télefono o por correo con DIGDEEP por favor."})
        })
    }
}])

