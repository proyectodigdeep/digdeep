angular.module('digdeepApp.dataDeliveryModalCtrl', ['ui.bootstrap'])

.controller('dataDeliveryModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                             $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openDataDeliveryModal = function (dataDelivery,coordinatesService,size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/dataDeliveryModal.html',
            controller: 'dataDeliveryModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            keyboard  : false,
            backdrop : 'static',
            resolve: {
                dataDelivery: function() {return dataDelivery},
                coordinatesService: function() {return coordinatesService}
            }
        })     
    }

    // Abrir modal si es que se pide desde fuera a traves del evento "openDeleteServiceModal"
    $rootScope.$on('openDataDeliveryModal', function(dataDelivery,coordinatesService,size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/dataDeliveryModal.html',
            controller: 'dataDeliveryModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            backdrop  : 'static',
            resolve: {
                dataDelivery: function() {return dataDelivery},
                coordinatesService: function() {return coordinatesService}
            }
        })     
    })

}])

.controller('dataDeliveryModalInstanceCtrl', ['coordinatesService', 'dataDelivery','$rootScope', '$uibModalInstance', 'serviceService', '$localStorage', '$scope','$state',
function (                                     coordinatesService,   dataDelivery,  $rootScope,   $uibModalInstance,   serviceService,   $localStorage,   $scope,  $state) {
    $scope.dataDelivery = dataDelivery

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
    if (coordinatesService != null && coordinatesService != undefined) {
        $scope.deliveryMap = {center: cleanLatLng(coordinatesService), zoom: 18, options: mapOptions}   
        $scope.showMap = true 
    }else{
        console.log("sin mapa")
        $scope.showMap = false
    }
    this.cancel = function () {
        location.reload()
        $uibModalInstance.close()
    }
    // Para mandar a la directive de mapa la lat, lng debe ser un objeto simple tipo {latitude:123,longitude:456}
    function cleanLatLng(object) {
        var string = JSON.stringify(object).replace("lat", 'latitude').replace('lng', 'longitude')
        return JSON.parse(string)
    }
}])

