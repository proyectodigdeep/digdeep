angular.module('digdeepApp.alertDigdeepModalCtrl', ['ui.bootstrap'])

.controller('alertDigdeepModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                        $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openAlertDigdeepModal = function (textAlert) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/alertDigdeepModal.html',
            controller:  'alertDigdeepModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                textAlert: function() {return textAlert}
            }
        })     
    }

    $rootScope.$on('openAlertDigdeepModal', function(event,data) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/alertDigdeepModal.html',
            controller: 'alertDigdeepModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                textAlert: function() {return data.textAlert}
            }
        })     
    })

}])

.controller('alertDigdeepModalInstanceCtrl', [ 'textAlert', '$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state',
function (                                      textAlert,   $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state) {
    $scope.textAlert = textAlert
    this.cancel = function () {
        $uibModalInstance.close()
    }
    setTimeout(function() {
        $scope.$apply(function() {
            $uibModalInstance.close()
        })
    }, 4000)
}])

