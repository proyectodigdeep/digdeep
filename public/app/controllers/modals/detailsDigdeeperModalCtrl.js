angular.module('digdeepApp.detailsDigdeeperModalCtrl', ['ui.bootstrap'])

.controller('detailsDigdeeperModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                                 $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openDetailsDigdeeperModal = function (Digdeeper,size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/detailsDigdeeperModal.html',
            controller: 'detailsDigdeeperModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                Digdeeper: function() {return Digdeeper},
                done: function() {}
            }
        })     
    }

    $rootScope.$on('openDetailsDigdeeperModal', function(Digdeeper,size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/detailsDigdeeperModal.html',
            controller: 'detailsDigdeeperModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                Digdeeper: function() {return Digdeeper},
                done: function() {}
            }
        })     
    })

}])

.controller('detailsDigdeeperModalInstanceCtrl', [ 'Digdeeper', '$uibModalInstance', 'done', '$scope','$state',
function (                                          Digdeeper,   $uibModalInstance,   done,   $scope,  $state) {
   $scope.digdeeper = Digdeeper
   this.cancel = function () {
        $uibModalInstance.close()
    }
}])

