angular.module('digdeepApp.factOrderModalCtrl', ['ui.bootstrap'])

.controller('factOrderModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                          $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openFacturationModal = function (order) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/facturationContract.html',
            controller: 'facturationModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                Order: function() {return order}
            }
        })     
    }

    $rootScope.$on('openFacturationModal', function(order) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/facturationContract.html',
            controller: 'facturationModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                Order: function() {return order}
            }
        })     
    })

}])

.controller('facturationModalInstanceCtrl', ['Order', '$rootScope', '$uibModalInstance', 'ordersService', '$localStorage', '$scope','$state', 'userService', '$http',
function (                                    Order,   $rootScope,   $uibModalInstance,   ordersService,   $localStorage,   $scope,  $state,   userService,   $http) {
    $scope.billing = {
        fullname:   "",
        rfc:        "",
        phone:      "",
        cp:         null,
        email:      ""
    }
    this.cancel = function () {
        $uibModalInstance.close()
    }
    this.putBilling = function (billing) {
        if (validFormBilling(billing)) {
            sendEmailDigdeep(billing)
        }else{
            console.log("Formulario invalido")
        }
    }
    function sendEmailDigdeep(billing) {
        // Configurando datos para genarar el correo a enviar a Soporte Digdeeper
        $uibModalInstance.close()
        $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Enviando tus datos para tu factura."})
    
        var html =  "<div style='text-align:center'><h3>SOLICITUD DE FACTURACIÓN</h3></div>"+
                    "<hr>"+
                    "<div style='text-align:center'><h3>Datos del Cliente</h3>"+
                    "<p>Nombre del cliente: "+billing.fullname+"</p>"+
                    "<p>E-mail: "+billing.email+"</p>"+
                    "<p>RFC: "+billing.rfc+"</p>"+
                    "<p>Telefono: "+billing.phone+"</p>"+
                    "<p>C.P.: "+billing.cp+"</p>"+
                    "<p>Total: $"+Order.dataService.cost+".00</p>"+
                    "</div>"

        var data = {
            HTML:       html,
            subject:    "SOLICITUD DE FACTURA",
            to:         "manager@digdeep.com.mx",// Correo de DIGDEEP
            text:       "Gracias por digdeepear"
        }
        console.log(data)
        $http.post("v1/emails", data)
        .then(function(response) {
            if(response.data.status === "success"){
                //$uibModalInstance.close()
                $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Se ha enviado tus datos a DIGDEEP, tu factura se enviara a tu correo."})
            }
            else{
                $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a DIGDEEP contactalo."})
            }
        })
    }
    function validFormBilling(billing) {
        if (angular.isDefined(billing.fullname) && billing.fullname !== null) {
            if(billing.fullname.length === 0 || billing.fullname === undefined || billing.fullname === null){
                $scope.billingNameFailed = true
                return false
            }else $scope.billingNameFailed = false
        }
        else{
            $scope.billingNameFailed = true
            return false
        }

        if (angular.isDefined(billing.email) && billing.email !== null) {
            if(billing.email.length === 0 || billing.email === undefined || billing.email === null){
                $scope.billingEmailFailed = true
                return false
            }else $scope.billingEmailFailed = false
        }
        else{
            $scope.billingEmailFailed = true
            return false
        }

        if (angular.isDefined(billing.rfc) && billing.rfc !== null) {
            if(billing.rfc.length === 0 || billing.rfc === undefined || billing.rfc === null){
                $scope.billingRfcFailed = true
                return false
            }else $scope.billingRfcFailed = false
        }
        else{
            $scope.billingRfcFailed = true
            return false
        }

        if (angular.isDefined(billing.phone) && billing.phone !== null) {
            if(billing.phone.length === 0 || billing.phone === undefined || billing.phone === null){
                $scope.billingPhoneFailed = true
                return false
            }else $scope.billingPhoneFailed = false
        }
        else{
            $scope.billingPhoneFailed = true
            return false
        }

        if (angular.isDefined(billing.cp) && billing.cp !== null) {
            if(billing.cp.length === 0 || billing.cp === undefined || billing.cp === null){
                $scope.billingCPFailed = true
                return false
            }else $scope.billingCPFailed = false
        }
        else{
            $scope.billingCPFailed = true
            return false
        }
        return true
    }
}])

