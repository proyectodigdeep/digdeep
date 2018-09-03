angular.module('digdeepApp.editInfoUserModalCtrl', ['ui.bootstrap'])

.controller('editInfoUserModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                             $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openEditInfoUserModal = function (idUser,dataUsr,userTemp,rol,athome,presencial,service_time,size, parentSelector) {
        dataUsr.kindServices = []
        if (athome == true) {
            dataUsr.kindServices.push("athome")
        }
        console.log(service_time)
        if (presencial == true) {
            dataUsr.kindServices.push("presencial")
        }
        dataUsr.service_time = service_time
        if (service_time) {
            dataUsr.service_time.init = service_time.init
            dataUsr.service_time.finish = service_time.finish
        }
        
        console.log(dataUsr)
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/editInfoUserModal.html',
            controller: 'editInfoUserModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                idUser: function() {return idUser},
                dataUsr: function () {return dataUsr},
                userTemp: function () {return userTemp},
                rol: function (){return rol}, 
                done: function() {}
            }
        })     
    }

    $rootScope.$on('openEditInfoUserModal', function(event,data) {
        console.log(data.rol)
        data.dataUsr.kindServices = []
        if (data.athome == true) {
            data.dataUsr.kindServices.push("athome")
        }
        console.log(data.service_time)
        if (data.presencial == true) {
            data.dataUsr.kindServices.push("presencial")
        }
        data.dataUsr.service_time = data.service_time
        if (data.service_time) {
            data.dataUsr.service_time.init = data.service_time.init
            data.dataUsr.service_time.finish = data.service_time.finish
        }
        
        console.log(data.dataUsr)
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/editInfoUserModal.html',
            controller: 'editInfoUserModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                idUser: function() {return data.idUser},
                dataUsr: function () {return data.dataUsr},
                userTemp: function () {return data.userTemp},
                rol: function (){return data.rol}, 
                done: function() {}
            }
        })     
    })

}])

.controller('editInfoUserModalInstanceCtrl', ['userTemp','$rootScope', '$uibModalInstance', 'userService', '$localStorage', 'idUser','dataUsr', 'done', '$scope','rol',
function (                                     userTemp,  $rootScope,   $uibModalInstance,   userService,   $localStorage,   idUser,  dataUsr,   done,   $scope,  rol) {
   
    this.updateUserProfile = function () {
        // Actualizar un usuario con rol 'user'
        if (rol === "user") {
            if (userTemp) {
                dataUsr.birthdate = userTemp.dayDate+"/"+userTemp.monthDate+"/"+userTemp.yearDate    
            }
            userService.updateUserProfile(idUser, dataUsr, $localStorage.token,
                function (user) {
                    //alert("Usuario actualizado correctamente")
                    $uibModalInstance.close()
                    $rootScope.$emit("openAlert",{
                        textAlert: "Tus datos se actualizaron correctamente."
                    })
                }, function (err) {
                    console.log(err)
                    //alert("Algo salio mal, usuario no actualizado: "+err.data.message)
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Algo salio mal, inténtalo más tarde."
                    })
                })
        }
        // Actualizar un usuario con rol 'digdeeper'
        if (rol === "digdeeper") {
            console.log(dataUsr)
            if (userTemp) {
                dataUsr.birthdate = userTemp.dayDate+"/"+userTemp.monthDate+"/"+userTemp.yearDate   
            }
            userService.updateDigdeeperProfile(idUser, dataUsr, $localStorage.token,
                function (user) {
                    //alert("Digdeeper actualizado correctamente")
                    $uibModalInstance.close()
                    $rootScope.$emit("openAlert",{
                        textAlert: "Tus datos se actualizaron correctamente"
                    })
                }, function (err) {
                    console.log(err)
                    //alert("Algo salio mal, usuario no actualizado: "+err.data.message)
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Algo salio mal, inténtalo más tarde"
                    })
                })
        }
        
    }
    this.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }

}])

