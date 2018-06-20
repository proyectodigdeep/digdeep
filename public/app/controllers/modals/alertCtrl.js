angular.module('digdeepApp.alertCtrl', ['ui.bootstrap'])

.controller('alertCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openAlert = function (textAlert) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/alertdd.html',
            controller:  'alertInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                textAlert: function() {return textAlert}
            }
        })     
    }

    $rootScope.$on('openAlert', function(event,data) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/alertdd.html',
            controller: 'alertInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                textAlert: function() {return data.textAlert}
            }
        })     
    })

}])

.controller('alertInstanceCtrl', [ 'textAlert', '$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state',
function (                          textAlert,   $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state) {
    $scope.textAlert = textAlert
    this.cancel = function () {
        $uibModalInstance.close()
    }
}])

