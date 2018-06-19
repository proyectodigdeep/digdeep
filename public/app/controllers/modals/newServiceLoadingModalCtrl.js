angular.module('digdeepApp.newServiceLoadingModalCtrl', ['ui.bootstrap'])

.controller('newServiceLoadingModalCtrl', ['$scope', '$uibModal', '$document','$rootScope',
function (                                  $scope,   $uibModal,   $document,  $rootScope) {
    $scope.openNewServiceModalLoading = function (size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/newServiceModalLoading.html',
            controller: 'newServiceLoadingInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : false
        })
    }

    $rootScope.$on('openNewServiceModalLoading', function(event, data) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/newServiceModalLoading.html',
            controller: 'newServiceLoadingInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
                idUser: function() {return data.idUser},
                newService: function () {return data.newService},
                done: function() {}
            }
        })     
    })

}])

.controller('newServiceLoadingInstanceModalCtrl', [ '$state','serviceService', 'newService','idUser','$scope', '$rootScope', '$uibModalInstance', '$localStorage', 'userService',
function (                                           $state,  serviceService,   newService,  idUser,  $scope,   $rootScope,   $uibModalInstance,   $localStorage,   userService) {
    
    this.cancel = function () {
        $uibModalInstance.close()
    }
    serviceService.createService(newService, function (service) {
        userService.addService(idUser, service, $localStorage.token,function (user) {
            if (user!= null) {
                //alert("Servicio creado correctamente "+service.title) 
                $uibModalInstance.close()
                $state.go("servicesdigdeeper")    
                location.reload("#/#!/servicesdigdeeper")
                //$scope.myDropzone.removeAllFiles();
            }else{
                $uibModalInstance.close()
                alert("Algo salio mal, no se puede asignar los servicios a este usuario")
                $state.go("servicesdigdeeper")    
                location.reload("#/#!/servicesdigdeeper")
            }
        },function (err) {
           $uibModalInstance.close()
           alert("Algo salio mal: "+err)
           $state.go("servicesdigdeeper")    
           location.reload("#/#!/servicesdigdeeper")
        })
    },function (err) {
        $uibModalInstance.close()
        alert("Algo salio mal: "+err)
        $state.go("servicesdigdeeper")    
        location.reload("#/#!/servicesdigdeeper")
    })

}])

