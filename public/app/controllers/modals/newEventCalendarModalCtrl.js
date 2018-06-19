angular.module('digdeepApp.newEventCalendarModalCtrl', ['ui.bootstrap'])

.controller('newEventCalendarModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openNewEventCalendar = function (dateSelected, userId) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/newEventCalendarModal.html',
            controller:  'newEventInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                dateSelected: function() {return dateSelected},
                userId: function() {return userId}
            }
        })     
    }

    $rootScope.$on('openNewEventCalendar', function(event,data) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/newEventCalendarModal.html',
            controller: 'newEventInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                dateSelected: function() {return data.dateSelected}
            }
        })     
    })

}])

.controller('newEventInstanceCtrl', [ 'dateSelected', 'userId','$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state', 'calendarService',
function (                          dateSelected, userId, $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state, calendarService) {
    $scope.event = {}
    $scope.dateSelected = new Date(dateSelected)
    $scope.event.date = $scope.dateSelected.setDate($scope.dateSelected.getDate() + 1)
    $scope.event.date = new Date($scope.event.date)
    this.cancel = function () {
        $uibModalInstance.close()
    }
    this.getHourInit = function (hourinit) {
        $scope.event.hourFinal = hourinit
    }
    this.ok = function () {
        if(validateForm()){
            console.log($scope.event)  
            $scope.event.digdeeper = userId
            calendarService.createEvent($scope.event, $localStorage.token, function (event) {
                $uibModalInstance.close()
                location.reload()
            },function (err) {
                console.log(err)
                location.reload()
                alert("Lo sentimos tenemos problemas con nuestros servicios, intentalo más tarde")
            }) 
        }
    }
    function validateForm() {
        if ($scope.event.title == undefined || $scope.event.title == "") {
            alert("Necesitas seleccionar un titulo para el evento")
            return false
        }
        if ($scope.event.hourInit == undefined || $scope.event.hourInit == null) {
            alert("Necesitas seleccionar una hora valida")
            return false
        }
        if ($scope.event.hourFinal == undefined || $scope.event.hourFinal == null) {
            alert("Necesitas seleccionar una hora valida")
            return false
        }
        return true
    }
}])

