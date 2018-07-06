angular.module('digdeepApp.editInfoUserModalCtrl', ['ui.bootstrap'])

.controller('editInfoUserModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                             $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openEditInfoUserModal = function (idUser,dataUsr,userTemp,rol,athome,presencial,size, parentSelector) {
        dataUsr.kindServices = []
        if (athome == true) {
            dataUsr.kindServices.push("athome")
        }
        if (presencial == true) {
            dataUsr.kindServices.push("presencial")
        }
        console.log(athome)
        console.log(presencial)
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

    // Abrir modal si es que se pide desde fuera a traves del evento "openDeleteServiceModal"
    $rootScope.$on('openEditInfoUserModal', function(idUser,dataUsr,userTemp,rol,size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/editInfoUserModal.html',
            controller: 'editInfoUserModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                idUser: function() {return idUser},
                dataUsr: function() {return dataUsr},
                userTemp: function () {return userTemp},
                rol: function (){return rol}, 
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

