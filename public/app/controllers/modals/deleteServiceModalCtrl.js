angular.module('digdeepApp.deleteServiceModalCtrl', ['ui.bootstrap'])

.controller('deleteServiceModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                              $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openDeleteServiceModal = function (services,user,idService, size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/deleteServiceModal.html',
            controller: 'deleteServiceModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                services: function() {return services},
                user: function() {return user},          
                idService: function() {return idService},
                done: function() {}
            }
        })     
    }

    // Abrir modal si es que se pide desde fuera a traves del evento "openDeleteServiceModal"
    $rootScope.$on('openDeleteServiceModal', function(services,user,idService, size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/deleteServiceModal.html',
            controller: 'deleteServiceModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                services: function() {return services},
                user: function() {return user},          
                idService: function() {return idService},
                done: function() {}
            }
        })     
    })

}])

.controller('deleteServiceModalInstanceCtrl', ['user', 'services','$rootScope', '$uibModalInstance', 'serviceService', '$localStorage', 'idService', 'done', '$scope', 'userService',
function (                                      user,   services,  $rootScope,   $uibModalInstance,   serviceService,   $localStorage,   idService,   done,   $scope,   userService) {

    this.ok = function () {
        $rootScope.$emit("openAlertDigdeepModal",{
            textAlert: "Eliminando el servicio"
        })
        var arrayServicesTemp = []
        for (var i = 0; i < services.length; i++) {
            if (String(idService) === String(services[i]._id)) {
            }else{
                arrayServicesTemp.push(services[i]._id)
            }
        }
        var data = {
            postedServices: arrayServicesTemp
        }
        serviceService.deleteService(idService,function (status) {
            if (status === "success") {
                
                userService.updateDigdeeperProfile(user._id, data, $localStorage.token,
                function (user) {
                    $uibModalInstance.close()
                    //alert("Servicio dado de baja correctamente")
                    location.reload("#/#!/servicesdigdeeper")
                }, function (err) {
                    console.log(err)
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Algo salio mal, inténtalo más tarde"
                    })
                })
            }
        },function (err) {
            //alert("Algo salio mal: "+err)
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Algo salio mal, inténtalo más tarde"
            })
        })    
    }  

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }

}])

