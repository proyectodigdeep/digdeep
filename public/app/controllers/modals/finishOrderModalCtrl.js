angular.module('digdeepApp.finishOrderModalCtrl', ['ui.bootstrap'])

.controller('finishOrderModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                            $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openFinishOrderModal = function (idOrder, size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/finishOrderModal.html',
            controller: "finishOrderModalInstanceCtrl",
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                idOrder: function() {return idOrder},
                done: function() {}
            }
        })     
    }

    $rootScope.$on('openFinishOrderModal', function(idOrder, size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/finishOrderModal.html',
            controller: "finishOrderModalInstanceCtrl",
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                idOrder: function() {return idOrder},
                done: function() {}
            }
        })     
    })

}])

.controller("finishOrderModalInstanceCtrl", ['$rootScope', '$uibModalInstance', 'ordersService', '$localStorage', 'idOrder', 'done', '$scope','$state',
function (                                    $rootScope,   $uibModalInstance,   ordersService,   $localStorage,   idOrder,   done,   $scope,  $state) {
    // Aceptar y confirmar un servicio
    this.finishOrder = function () {
        var endDateService = new Date()
        ordersService.finishOrder(idOrder,endDateService,$localStorage.token, function (order) {
            $uibModalInstance.close()
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Orden finalizada correctamente"
            })
        },function (err) {
            $uibModalInstance.close()
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: err.data.message
            })
        })
    } 

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }

}])

