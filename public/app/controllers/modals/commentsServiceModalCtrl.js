angular.module('digdeepApp.commentsServiceModalCtrl', ['ui.bootstrap'])

.controller('commentsServiceModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                                $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openCommentsServiceModal = function (comment1,comment2,size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/commentsServiceModal.html',
            controller: 'commentsServiceModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                comment1: function() {return comment1},
                comment2: function() {return comment2}
            }
        })     
    }

    $rootScope.$on('openCommentsServiceModal', function(comment1,comment2,size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/commentsServiceModal.html',
            controller: 'commentsServiceModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                comment1: function() {return comment1},
                comment2: function() {return comment2}
            }
        })     
    })

}])

.controller('commentsServiceModalInstanceCtrl', ['comment2', 'comment1', '$uibModalInstance', '$scope','$state',
function (                                        comment2,   comment1,   $uibModalInstance,   $scope,  $state) {
   $scope.comments = []
   if (comment1 != null) {
        $scope.comments.push(comment1)
   }
   if (comment2 != null) {
        $scope.comments.push(comment2)
   }
   $scope.numComments = $scope.comments.length
   this.cancel = function () {
        $uibModalInstance.close()
    }
}])

