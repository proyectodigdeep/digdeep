angular.module('digdeepApp.dateInfoOutModalCtrl', ['ui.bootstrap'])

.controller('dateInfoOutModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document', 'calendarService',
function (                         $rootScope,   $scope,   $uibModal,   $document,      calendarService) {
    
    $scope.openDateInfoOutModal = function (eventOut) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/dateInfoOutModal.html',
            controller:  'dateInfoOutModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                eventOut: function() {return eventOut}
            }
        })     
    }

    $rootScope.$on('openDateInfoOutModal', function(event, eventOut) {
        console.log(eventOut)
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/dateInfoOutModal.html',
            controller: 'dateInfoOutModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                eventOut: function() {return eventOut}
            }
        })     
    })

}])

.controller('dateInfoOutModalInstanceCtrl', [ 'eventOut', '$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state', 'calendarService',
function (                                  eventOut,   $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state, calendarService) {
    $scope.eventOut = eventOut
    console.log($scope.eventOut)
    this.cancel = function () {
        //location.reload()
        $uibModalInstance.close()
    }
    this.delete = function () {
        calendarService.deleteEvent($scope.eventOut._id, $localStorage.token, function (message) {
            $uibModalInstance.close()
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Evento eliminado correctamente"
            })
            setTimeout(function() {
                location.reload()
            }, 2000)
        },function (err) {
            //alert("Lo sentimos tenemos problemas con nuestros servicios")
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Algo salio mal, inténtalo más tarde"
            })
        })
    }
}])

