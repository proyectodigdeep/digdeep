angular.module('digdeepApp.registerUserModalCtrl', ['ui.bootstrap'])

.controller('registerUserModalCtrl', ['$scope', '$uibModal', '$document', '$rootScope',
function (                             $scope,   $uibModal,   $document,   $rootScope) {
    $scope.openRegisterUserModal = function (idUsr, size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/registerUserModal.html',
            controller: 'registerUserInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : false,
            resolve: {idUser: function() {return idUsr}}
        })
    }

    // Abrir modal si es que se pide desde fuera a traves del evento "openRegisterUserModal"
    $rootScope.$on('openRegisterUserModal', function(event, data) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/registerUserModal.html',
            controller: 'registerUserInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : false,
            resolve: {idUser: function() {return data.idUsr}}
        })     
    })
}])

.controller('registerUserInstanceModalCtrl', ['idUser', '$scope', '$rootScope', '$uibModalInstance', '$state', 'userService', '$localStorage',
function (                                     idUser,   $scope,   $rootScope,   $uibModalInstance,   $state,   userService,   $localStorage) {
    $scope.nextForm = false
    $scope.step = 0
    $scope.classProgreesRU = []
    $scope.classProgreesRU[0] = "active"
    $scope.classProgreesRU[1] = ""
    $scope.classProgreesRU[2] = ""
    $scope.classProgreesRU[3] = ""
    $scope.classProgreesRU[4] = ""
    $scope.classProgreesRU[5] = ""

    // Preferencias del usuario, para conocer sus posibles gustos.
    $scope.userPref ={
        gender:                 "mujer",
        categoriesServices:     [],
        budget:                 6000, 
    }
    $scope.category ={
        decorations:    false,
        fashion:        false,
        cocktails:      false,
        nutrition:      false, 
        concerts:       false,
        parties:        false,
        culture:        false,
        food:           false
    }

    this.chooseGender = function (gender) {
        $scope.userPref.gender = gender
    }

    this.chooseCategories = function () {
        if ($scope.category.decorations === true) {
            $scope.userPref.categoriesServices.push("decorations")
        }
        if ($scope.category.fashion     === true) {
            $scope.userPref.categoriesServices.push("fashion")
        }
        if($scope.category.cocktails    === true){
            $scope.userPref.categoriesServices.push("cocktails")
        }
        if($scope.category.nutrition    === true){
            $scope.userPref.categoriesServices.push("nutrition")
        }
        if($scope.category.concerts     === true){
            $scope.userPref.categoriesServices.push("concerts")
        }
        if ($scope.category.parties     === true) {
            $scope.userPref.categoriesServices.push("parties")
        }
        if ($scope.category.culture     === true) {
            $scope.userPref.categoriesServices.push("culture")
        }
        if ($scope.category.food        === true) {
            $scope.userPref.categoriesServices.push("food")
        }
    }

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }

    this.nextForm = function () {
        $scope.step++
        $scope.classProgreesRU[$scope.step] = "active"
    }

    this.sendData = function () {
        userService.updatePreferencesUser(idUser, $scope.userPref,
            function (user) {
                $uibModalInstance.close()
                $state.go("home")
            }, function (err) {
                console.log(err)
                alert("Algo salio mal, preferencias no guardadas: "+err.data.message)
            })
    }
}])

