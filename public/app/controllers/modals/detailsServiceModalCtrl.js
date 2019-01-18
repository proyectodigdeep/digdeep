angular.module('digdeepApp.detailsServiceModalCtrl', ['ui.bootstrap'])

.controller('detailsServiceModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                               $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openDetailsServiceModal = function (Service,typePrice,size, parentSelector, $event) {
        $event.stopPropagation();
		$uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/detailsServiceModal.html',
            controller: 'detailsServiceModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                Service: function() {return Service},
                typePrice: function (){return typePrice},
                done: function() {}
            }
        })     
    }

    // Abrir modal si es que se pide desde fuera a traves del evento "openDeleteServiceModal"
    $rootScope.$on('openDetailsServiceModal', function(Service,size, parentSelectora, $event) {
		$event.stopPropagation();
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/detailsServiceModal.html',
            controller: 'detailsServiceModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                Service: function() {return Service},
                done: function() {}
            }
        })     
    })

}])

.controller('detailsServiceModalInstanceCtrl', ['typePrice', 'Service', '$rootScope', '$uibModalInstance', 'serviceService', '$localStorage', 'done', '$scope','$state',
function (                                       typePrice,   Service,   $rootScope,   $uibModalInstance,   serviceService,   $localStorage,   done,   $scope,  $state) {
    $scope.service = Service
    $scope.typePrice = typePrice
    this.cancel = function () {
        $uibModalInstance.close()
    }
    $scope.myInterval = 4000;
    $scope.noWrapSlides = false;
    $scope.active = 0;

    var currIndex = 0;
    var slides = []
    $scope.slides = []
    for (var i = 0; i < Service.pictures.length; i++) {
        var slideTemp ={
            image: Service.pictures[i],
            id: currIndex++
        }
        slides = $scope.slides.push(slideTemp)
    }

    $scope.randomize = function() {
        var indexes = generateIndexesArray();
        assignNewIndexesToSlides(indexes);
    };

    function assignNewIndexesToSlides(indexes) {
        for (var i = 0, l = slides.length; i < l; i++) {
        slides[i].id = indexes.pop();
        }
    }

    function generateIndexesArray() {
        var indexes = [];
        for (var i = 0; i < currIndex; ++i) {
            indexes[i] = i;
        }
        return shuffle(indexes);
    }

    function shuffle(array) {
        var tmp, current, top = array.length;
        if (top) {
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
        }
        return array;
    }
}])

