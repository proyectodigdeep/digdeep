angular.module('digdeepApp.editInfoServiceModalCtrl', ['ui.bootstrap'])

.controller('editInfoServiceModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                                $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openEditInfoServiceModal = function (idUser,Service,typePrice,size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/editInfoServiceModal.html',
            controller: 'editServiceModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                idUser: function() {return idUser},
                Service: function() {return Service},
                typePrice: function(){return typePrice},
                done: function() {}
            }
        })     
    }

    // Abrir modal si es que se pide desde fuera a traves del evento "openDeleteServiceModal"
    $rootScope.$on('openEditInfoServiceModal', function(idUser,Service,typePrice,size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/editInfoServiceModal.html',
            controller: 'editServiceModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                idUser: function() {return idUser},
                Service: function() {return Service},
                typePrice: function () {return typePrice},
                done: function() {}
            }
        })     
    })

}])

.controller('editServiceModalInstanceCtrl', ['typePrice', 'categoryService', 'Service', '$rootScope', '$uibModalInstance', 'serviceService', '$localStorage', 'idUser', 'done', '$scope','$state',
function (                                    typePrice,   categoryService,   Service,   $rootScope,   $uibModalInstance,   serviceService,   $localStorage,   idUser,   done,   $scope,  $state) {
    $scope.typePrice = typePrice
    // Datos del servicio a editar
    $scope.newService = Service
    $scope.pictureCurrent = Service.pictures[0]
    $scope.filters        = {
        decorations:    false,
        fashion:        false,
        cocktails:      false,
        nutrition:      false,
        concerts:       false,
        parties:        false,
        culture:        false,
        food:           false
    }
    for (var i = 0; i < Service.filters.length; i++) {
        if (Service.filters[i] === "decorations"){
            $scope.filters.decorations = true
        }
        if (Service.filters[i] === "fashion"){
            $scope.filters.fashion = true
        }
        if (Service.filters[i] === "cocktails"){
            $scope.filters.cocktails = true
        }
        if (Service.filters[i] === "nutrition"){
            $scope.filters.nutrition = true
        }
        if (Service.filters[i] === "parties"){
            $scope.filters.parties = true
        }
        if (Service.filters[i] === "culture"){
            $scope.filters.culture = true
        }
        if (Service.filters[i] === "food"){
            $scope.filters.food = true
        }
        if (Service.filters[i] === "concerts"){
            $scope.filters.concerts = true
        }
    }
    $scope.subCategories  = []
    $scope.categories     = []
    // Obtener todas las categorias para mostrarlas en el formulario 
    // Y seleccionando la categoria y subcategoria que tiene ya guardada anteiormente
    categoryService.getCategories(function (categories) {
        //console.log(categories)
        $scope.categories = categories
        for (var i = 0; i < categories.length; i++) {
            if (String(categories[i]._id) === String($scope.newService._category)) {
                $scope.newService.category = categories[i]._id
                var subcategoriesIds = categories[i].subcategories
                categoryService.getSubcategories(function (subcategories) {
                    var subCategoriesTemp = subcategories
                    for (var i = 0; i < subCategoriesTemp.length; i++) {
                        for (var j = 0; j < subcategoriesIds.length; j++) {
                            if (subCategoriesTemp[i]._id === subcategoriesIds[j]) {
                                $scope.subCategories.push(subCategoriesTemp[i])
                            }
                            if (String(subcategoriesIds[j]) === String($scope.newService._subcategory)) {
                                $scope.newService.subcategory = subcategoriesIds[j]
                            }
                        }
                    }
                },function (err) {
                    //alert("Algo salio mal: "+err)
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Algo salio mal, inténtalo más tarde"
                    })
                })

            }
        }
    },function (err) {
        $rootScope.$emit("openAlertDigdeepModal",{
            textAlert: "Algo salio mal, inténtalo más tarde"
        })
    })
    // Configuración del dropzone
    $scope.dropzoneConfig = {
        init            : function() {
            this.on('addedfile', function(file) {
                $scope.$apply(function() {
                    $scope.filesUploading = true;
                });
            });
            this.on("success", function(file, response) {
                if (response === "error") {
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Hay un archivo que no esta permitido, inténtalo nuevamente."
                    })
                    this.removeAllFiles()
                }else{
                    $scope.newService.pictures = response
                }
            })
            this.on("error", function(file, response) {
                console.log(response)
                if (response === "You can not upload any more files.") {
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "No puedes subir más de 5 imagenes, inténtalo nuevamente."
                    })
                    this.removeAllFiles()
                }
            });
            this.on("complete", function(file) {
              //this.removeFile(file);
            });
        },
        url             : 'v1/digdeeperImgServiceTemp/',
        parallelUploads : 5,
        uploadMultiple  : true,
        maxFileSize     : 30,
        addRemoveLinks  : 'dictCancelUpload',
        paramName: "photos",
        maxFiles: 5
    }

    // Aceptar y confirmar un servicio
    this.updateService = function () {
        chooseFilters()
        var formValid = formIsValid($scope.newService)
        if (formValid === true) {
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Actualizando servicio..."
            })
            serviceService.updateService($scope.newService._id,$scope.newService, $localStorage.token,function (service) {
                location.reload("#/#!/servicesdigdeeper")
                $uibModalInstance.close()
            },function (err) {
                $rootScope.$emit("openAlertDigdeepModal",{
                    textAlert: "No se pudo actualizar el servicio, inténtalo más tarde."
                })
            })
        }
    }

    this.cancel = function () {
        location.reload("#/#!/servicesdigdeeper")
        $uibModalInstance.close()
    }

    // Función que modifica el select de subcategoria, segun la categoria seleccionada
    this.chooseCategory = function () {
        $scope.subCategories = []
        categoryService.getCategory($scope.newService.category, function (category) {
            var subcategoriesIds = category.subcategories
            categoryService.getSubcategories(function (subcategories) {
                var subCategoriesTemp = subcategories
                for (var i = 0; i < subCategoriesTemp.length; i++) {
                    for (var j = 0; j < subcategoriesIds.length; j++) {
                        if (subCategoriesTemp[i]._id === subcategoriesIds[j]) {
                            $scope.subCategories.push(subCategoriesTemp[i])
                        }
                    }
                }
            },function (err) {
                //alert("Algo salio mal: "+err)
            })
        },function (err) {
            //alert("Algo salio mal: "+err)
        })
    }

    // Función que recolecta los filtros de busqueda para el servicio a crear
    function chooseFilters() {
        $scope.newService.filters = []
        if ($scope.filters.decorations === true) {
            $scope.newService.filters.push("decorations")
        }
        if ($scope.filters.fashion     === true) {
            $scope.newService.filters.push("fashion")
        }
        if($scope.filters.cocktails    === true){
            $scope.newService.filters.push("cocktails")
        }
        if($scope.filters.nutrition    === true){
            $scope.newService.filters.push("nutrition")
        }
        if($scope.filters.concerts     === true){
            $scope.newService.filters.push("concerts")
        }
        if ($scope.filters.parties     === true) {
            $scope.newService.filters.push("parties")
        }
        if ($scope.filters.culture     === true) {
            $scope.newService.filters.push("culture")
        }
        if ($scope.filters.food        === true) {
            $scope.newService.filters.push("food")
        }
    }

    // Función que valida los datos del formulario
    function formIsValid(dataUser) {
        if (angular.isDefined(dataUser.title)) {
            if(dataUser.title.length === 0) {
                $scope.titleServiceFailed = true
                return false
            }
            else $scope.titleServiceFailed = false
        }
        else {
            $scope.titleServiceFailed = true
            return false
        }

        if (angular.isDefined(dataUser.category)) {
            if(dataUser.category.length === 0) {
                $scope.categoryFailed = true
                return false
            }
            else $scope.categoryFailed = false
        }
        else {
            $scope.categoryFailed = true
            return false
        }

        if (angular.isDefined(dataUser.subcategory)) {
            if(dataUser.subcategory.length === 0) {
                $scope.subCategoryFailed = true
                return false
            }
            else $scope.subCategoryFailed = false
        }
        else {
            $scope.subCategoryFailed = true
            return false
        }

        if ($scope.typePrice === 1 || $scope.typePrice === 2) {
            if (angular.isDefined(dataUser.price_athome)) {
                if (dataUser.price_athome === null) {
                    $scope.costathomeFailed = true
                    return false   
                }else{
                    if(dataUser.price_athome.length === 0 || dataUser.price_athome === 0) {
                        $scope.costathomeFailed = true
                        return false
                    }
                    else {
                        $scope.costathomeFailed = false
                    }
                }
            }
            else {
                $scope.costathomeFailed = true
                return false
            }    
        }
        if ($scope.typePrice === 1 || $scope.typePrice === 3) {
            if (angular.isDefined(dataUser.price_presencial)) {
                if (dataUser.price_presencial === null) {
                    $scope.costpresencialFailed = true
                    return false
                }else{
                    if(dataUser.price_presencial.length === 0 || dataUser.price_presencial === 0) {
                        $scope.costpresencialFailed = true
                        return false
                    }
                    else $scope.costpresencialFailed = false
                }
            }
            else {
                $scope.costpresencialFailed = true
                return false
            }    
        }

        if (angular.isDefined(dataUser.description)) {
            if(dataUser.description.length === 0) {
                $scope.descriptionFailed = true
                return false
            }
            else $scope.descriptionFailed = false
        }
        else {
            $scope.descriptionFailed = true
            return false
        }

        return true
    }

}])

