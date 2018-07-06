angular.module('digdeepApp.addMethodPayModalCtrl', ['ui.bootstrap'])

.controller('addMethodPayModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openMethodPay = function (id_user) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/addMethodPayModal.html',
            controller:  'addMethodPayInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                id_user: function() {return id_user}
            }
        })     
    }

    $rootScope.$on('openMethodPay', function(event,id_user) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/addMethodPayModal.html',
            controller: 'addMethodPayInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                id_user: function() {return id_user}
            }
        })     
    })

}])

.controller('addMethodPayInstanceCtrl', [ 'id_user', '$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state', 'conektaService', 'userService',
function (                                 id_user,   $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state, conektaService, userService) {
    $scope.id_user = id_user
    $scope.card = {
        number: null,
        name: null,
        exp_month: null,
        exp_year: null,
        cvc: null
    };
    $scope.errorMessage = null;
    $scope.nameFailed = false;
    verifyMethodPay()

    this.cancel = function () {
        $uibModalInstance.close()
    }
    
    this.agregarTarjetaNueva = function () {
       // Validacion de la tarjeta
        conektaService.validarTarjeta($scope.card).then(function (result) {                    
            $rootScope.$emit("openAlertDigdeepModal", { textAlert: "Guardando los datos de su tarjeta." });
            // creando token                    
            conektaService.tokenizar($scope.card).then(function (response) {
                if (response.success) {                        
                    $scope.errorMessage = null;
                    userService.addMethodPayToCustomer($scope.id_user, response.token.id, $localStorage.token, function (methodsPay) {
                        $scope.methodsPay = methodsPay.data
                        $rootScope.$emit("openAlert", { textAlert: "Su tarjeta ha sido agregada correctamente." })
                        verifyMethodPay()
                        $uibModalInstance.close()
                        location.reload()
                    }, function (err) {
                        console.log(err)
                        $rootScope.$emit("openAlert", { textAlert: err.data.message })

                    })              
                }else{
                    $rootScope.$emit("openAlert", { textAlert: "No se pudo guardar los datos de tu tarjeta. Verifica tus datos por favor." })
                }
            }, function (errResponse) {
                $scope.errorMessage = errResponse.message;
            });
        }, function (error) {                    
            $scope.errorMessage = error.message;
        });
    }

    function verifyMethodPay() {
        //$rootScope.$emit("openAlertDigdeepModal", { textAlert: "Preparando todo..." });
        userService.verifyMethodPay($scope.id_user, $localStorage.token, function (methodsPay) {
            if (methodsPay != undefined && methodsPay.data.length > 0) {
                console.log(methodsPay)
            }
        }, function (err) {
            console.log(err)
        })
    }
}])

