angular.module('digdeepApp.registerDigdeeperModalCtrl', ['ui.bootstrap'])

.controller('registerDigdeeperModalCtrl', ['$scope', '$uibModal', '$document', '$rootScope',
function (                                  $scope,   $uibModal,   $document,   $rootScope) {
    
    $scope.openRegisterDigdeeperModal = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/registerDigdeeperModal.html',
            controller: 'registerDigdeeperInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : false,
            backdrop  : 'static',
            resolve: {}
        })
    }

    $rootScope.$on('openRegisterDigdeeperModal', function(event,data) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/registerDigdeeperModal.html',
            controller: 'registerDigdeeperInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : false,
            backdrop  : 'static',
            resolve: {
                dataUser: function() {return data.user}
            }
        })     
    })

}])

.controller('registerDigdeeperInstanceModalCtrl', ['dataUser', '$scope', '$rootScope', '$uibModalInstance', '$state', '$http',
function (                                          dataUser,   $scope,   $rootScope,   $uibModalInstance,   $state,   $http) {
    $scope.nextForm = false
    console.log(dataUser)

    this.cancel = function () {
        $uibModalInstance.close()
    }

    this.nextForm = function () {
        $scope.nextForm = true
        processRegisterFinished()
    }

    function processRegisterFinished() {
        sendEmailToDigdeeper()
        setTimeout(function() {
            $scope.$apply(function() {
                $uibModalInstance.close()
                $state.go("home")
            });
        }, 3500);
    }

    function sendEmailToDigdeeper() {
        // Configurando datos para genarar el correo a enviar a digdeep
        var html =  "<div style='text-align:center'><h3>Bienvenido a DIGDEEP</h3></div>"+
                    "<div style='text-align:center'><p>Esto solo es un mensaje para confirmar tus datos,"+ 
                    "y darte a conocer los pasos que siguen, para tu proceso</p></div>"+
                    "<div style='text-align:center'>"+
                        "<p>Nombre: "+dataUser.fullname+"</p>"+
                        "<p>Telefono: "+dataUser.phone+"</p>"+
                        "<p>E-mail de contacto: "+dataUser.email+"</p>"+
                        "<p>Proceso a seguir:</p>"+
                        "<p>1.- DIGDEEP evaluara tus datos y te contactara.</p>"+
                        "<p>2.- Recibe una visita.</p>"+
                        "<p>3.- Edita tu perfil.</p>"+
                        "<p>4.- Vende.</p>"+
                    "</div>"
        var data = {
            HTML:       html,
            subject:    "Confirmación de registro a DIGDEEP WEB",
            to:         dataUser.email //Correo del nuevo digdeeper 
        }
        $http.post("v1/emails", data)
        .then(function(response) {
            //console.log("here")
            //sendEmailToDIGDEEP()
        },function (response) {
            console.log(response)
            //$rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo enviar su correo de confirmación comuniquese al télefono o por correo con DIGDEEP porfavor."})
        })
    }
    
    function sendEmailToDIGDEEP() {
        // Configurando datos para genarar el correo a enviar a digdeep
        var html =  "<div style='text-align:center'><h3>Registro de un nuevo DIGDEEPER</h3></div>"+
                    "<div style='text-align:center'><p>Un usuario inicio su proceso para ser digdeeper."+ 
                    "Sus datos son los siguientes: </p></div>"+
                    "<div style='text-align:center'>"+
                        "<p>Nombre: "+dataUser.fullname+"</p>"+
                        "<p>Telefono: "+dataUser.phone+"</p>"+
                        "<p>E-mail de contacto: "+dataUser.email+"</p>"+
                        "<p>Fecha de nacimiento: "+dataUser.birthdate+"</p>"+
                        "<p>Calle: "+dataUser.address+"</p>"+
                        "<p>Colonia: "+dataUser.colony+"</p>"+
                        "<p>Ciudad: "+dataUser.city+"</p>"+
                        "<p>Estado: "+dataUser.state+"</p>"+
                        "<p>Especialidad: "+dataUser.specialty+"</p>"+
                        "<p>Página web: "+dataUser.webPage+"</p>"+
                        "<p>Fan page: "+dataUser.fanPage+"</p>"+
                        "<p>Instagram: "+dataUser.instagram+"</p>"+
                        "<p>RFC: "+dataUser.rfc+"</p>"+
                    "</div>"
        var data = {
            HTML:       html,
            subject:    "Inicio de proceso de un DIGDEEPER nuevo",
            to:         "manager@digdeep.com.mx"//Correo de digdeep
        }
        $http.post("v1/emails", data)
        .then(function(response) {
        },function (response) {
             $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo enviar su correo de confirmación comuniquese al télefono o por correo con DIGDEEP porfavor."})
        })
    }
}])

