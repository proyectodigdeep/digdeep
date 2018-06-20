angular.module('digdeepApp.servicesDigDeeperCtrl', [
    'ngDropzone'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('servicesdigdeeper', {
		url: '/servicesdigdeeper',
		templateUrl: '/app/templates/servicesdigdeeper.html',
		controller: 'servicesDigDeeperCtrl'
	})
}])

.controller('servicesDigDeeperCtrl', [ '$scope', '$state', '$rootScope', 'userService','serviceService','categoryService', '$localStorage', 'ordersService', '$interval',
function (                  		    $scope,   $state,   $rootScope,   userService,  serviceService,  categoryService,   $localStorage,   ordersService,   $interval) {
    
    // Obtener los datos del usuario para mostrar su perfil
    $rootScope.$emit('reloadUser',{done: function() {
    }})
    //verificar el tipo de usuario para mostrar la barra de navegación acorde a el
    $rootScope.$emit('checkRollUser',{done: function() {
    }})
    $scope.typeUser = $rootScope.typeUser
    
    // Recargar órdenes cada 5 segundos, para saber si hay nuevos pedidos.
    $interval(function(){
        //verificar el tipo de usuario para mostrar la barra de navegación acorde a el
        $rootScope.$emit('checkRollUser',{done: function() {
        }})
    }, 5000)
    
    // Se hace la carga e instancia de los valores iniciales de esta pagína
    $scope.initServicesDigdeeper = function () {
        if ($localStorage.token == undefined) {
            $state.go("home")
        }else{
            // Datos del servicio nuevo a añadir
            $scope.newService = {
                title:              "",
                category:           "",
                subcategory:        "",
                price_athome:       "",
                price_presencial:   "",
                description:        "",
                pictures:           [],
                userId:             $scope.user._id,
                filters:            []
            }
            $scope.services       = []
            $scope.subCategories  = []
            $scope.categories     = []
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
            $scope.showPanelNewService = false
            $scope.sectionPlus = false
            
            // Obtener el tipo de costos que debe de tener el usuario
            userService.getUser($scope.user._id, function (usr) {
                var userTemp = usr
                if ((userTemp.kindServices.indexOf('athome') != -1) && (userTemp.kindServices.indexOf('presencial') != -1)) {
                    $scope.typePrice = 1
                }else{
                    if (userTemp.kindServices.indexOf('athome') != -1) {
                        $scope.typePrice = 2
                    }else{
                        if (userTemp.kindServices.indexOf('presencial') != -1) {
                            $scope.typePrice = 3
                        }
                    }
                }
            },function (err) {
                console.log(err)
            })
            
            // Obtener todas las categorias de los servicios para mostrarlas en el formulario
            categoryService.getCategories(function (categories) {
                $scope.categories = categories
            },function (err) {
                console.log("Error al obtener las categorias")
            })
            // Obtener todas las subcategorias de los servicios para mostrarlas en el formulario
            categoryService.getSubcategories(function (subcategories) {
                $scope.subCategories = subcategories
            },function (err) {
                console.log("Error al obtener las subcategorias")
            })
            // Obtener todos los servicios creados por el digdeeper
            serviceService.getServicesOfUser($scope.user._id, function (servicesofuser) {
                $scope.services = servicesofuser  
            },function (err) {
                console.log("Algo salio mal")
            })
            // Obtener la categoria y subcategoria a la que pertenece el digdeeper
            categoryService.getCategories(function (categories) {
                for (var i = 0; i < categories.length; i++) {
                    var arrayTempSubcats = categories[i].subcategories
                    for (var j = 0; j < arrayTempSubcats.length; j++) {
                        if(String(arrayTempSubcats[j]) === String($scope.user.temp_service)){
                            $scope.newService.category      = categories[i]._id
                            $scope.newService.subcategory   = arrayTempSubcats[j]
                        }
                    }
                }
            },function (err) {
                console.log("Error al obtener las subcategorias")
            })
            // Configuración del dropzone
            $scope.dropzoneConfig = {
                init            : function() {
                    this.on('addedfile', function(file) {
                        $scope.$apply(function() {
                            $scope.filesUploading = true;
                        })
                    })
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
                    })
                    this.on("complete", function(file) {
                      //this.removeFile(file);
                    })
                },
                url             : 'v1/digdeeperImgServiceTemp/',
                parallelUploads : 5,
                uploadMultiple  : true,
                maxFileSize     : 30,
                addRemoveLinks  : 'dictCancelUpload',
                paramName: "photos",
                maxFiles: 5
            }
        }
    }
    
    // Configurar el drop zone de imagenes del servicio
    $scope.dzError = function( file, errorMessage ) {
        console.log("error"+errorMessage);
    }
    
    // Función que elimina un servicio
    $scope.deleteService = function (idService) {
        var arrayServicesTemp = []
        for (var i = 0; i < $scope.services.length; i++) {
            if (String(idService) === String($scope.services[i]._id)) {
            }else{
                arrayServicesTemp.push($scope.services[i]._id)
            }
        }
        var data = {
            postedServices: arrayServicesTemp
        }
        serviceService.deleteService(idService, function (status) {
            if (status === "success") {
                userService.updateDigdeeperProfile($scope.user._id, data, $localStorage.token,
                function (user) {
                    //alert("Servicio dado de baja correctamente")
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Servicio dado de baja correctamente"
                    })

                    $scope.initServicesDigdeeper()
                }, function (err) {
                    console.log(err)
                    //alert("Algo salio mal, usuario no actualizado: "+err.data.message)
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Algo salio mal, usuario no actualizado"
                    })
                })
            }
        },function (err) {
            alert("Algo salio mal: "+err)
        })    
    }

    $scope.showPanelServ = function () {
        if ($scope.sectionPlus === false) {
            $scope.sectionPlus = true
        }else{
            if ($scope.sectionPlus === true) {
                $scope.sectionPlus = false
            }
        }
        
    }

    // Función que salva los datos del formulario
    $scope.saveService = function () {
        chooseFilters()
        var formValid = formIsValid($scope.newService)
        if (formValid === true) {
            // Abre un modal encargado de crear el servicio
            $rootScope.$emit('openNewServiceModalLoading',{
                done: function() {},
                idUser: $scope.user._id,
                newService: $scope.newService
            })
            $scope.initServicesDigdeeper()
        }
    }

    // Función que modifica el select de subcategoria, segun la categoria seleccionada
    /*$scope.chooseCategory = function () {
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
    }*/

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
