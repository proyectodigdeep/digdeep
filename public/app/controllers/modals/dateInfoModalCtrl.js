angular.module('digdeepApp.dateInfoModalCtrl', ['ui.bootstrap'])

.controller('dateInfoModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                         $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openDateInfoModal = function (order) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/dateInfoModal.html',
            controller:  'dateInfoModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                order: function() {return order}
            }
        })     
    }

    $rootScope.$on('openDateInfoModal', function(event, order) {
        console.log(order)
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/dateInfoModal.html',
            controller: 'dateInfoModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                order: function() {return order}
            }
        })     
    })

}])

.controller('dateInfoModalInstanceCtrl', [ 'order', '$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state',
function (                                  order,   $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state) {
    $scope.order = order
    
    var mapOptions = {
        clickableIcons: false,
        fullscreenControl: false,
        keyboardShortcuts: false,
        streetViewControl: false,
        mapTypeControl: false,
        minZoom: 11, 
        scrollwheel: false
    }
    $scope.deliveryMap = {
        center: {
            latitude: -23.598763,
            longitude: -46.676547
        }, 
        zoom: 18, 
        options: mapOptions
    }
    $scope.showMap = false
    if ($scope.order.dataService.coordinates != null && $scope.order.dataService.coordinates != undefined) {
        $scope.deliveryMap = {center: cleanLatLng($scope.order.dataService.coordinates), zoom: 18, options: mapOptions}   
        $scope.showMap = true 
    }else{
        console.log("sin mapa")
        $scope.showMap = false
    }
    this.cancel = function () {
        //location.reload()
        $uibModalInstance.close()
    }
    // Para mandar a la directive de mapa la lat, lng debe ser un objeto simple tipo {latitude:123,longitude:456}
    function cleanLatLng(object) {
        var string = JSON.stringify(object).replace("lat", 'latitude').replace('lng', 'longitude')
        return JSON.parse(string)
    }
}])

