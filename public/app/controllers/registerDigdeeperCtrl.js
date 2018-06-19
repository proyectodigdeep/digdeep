angular.module('digdeepApp.registerDigdeeperCtrl', [
    'digdeepApp.userService',
    'ngDropzone'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('registerdigdeeper', {
		url: '/registerdigdeeper',
		templateUrl: '/app/templates/registerDigdeeper.html',
		controller: 'registerDigdeeperCtrl'
	})
}])

.controller('registerDigdeeperCtrl', [ '$scope', '$state', 'userService', '$rootScope', '$localStorage', '$http', 'categoryService',
	function (                          $scope,   $state,   userService,   $rootScope,   $localStorage,   $http,   categoryService) {
	
    //verificar el tipo de usuario para mostrar la barra de navegación acorde a el
    $rootScope.$emit('checkRollUser',{done: function() {
    }})
    $scope.typeUser = $rootScope.typeUser
    // Obtener los datos del usuario para mostrar su perfil
    $rootScope.$emit('reloadUser',{done: function() {
    }})

	// Recolección de datos del formulario registro para ser Digdeeper
	$scope.dataUser = {
		name: 				"", birthdate: 			"", email: 		        "", 
		password: 			"",	confirmPassword: 	"", phone: 		        "", 
		address: 			"",	numberHouse: 		"",	postalCode:         "",
		dateDay: 			"", dateMonth: 			"",	dateYear: 	        "", 
		service: 			"", specialty: 			"", city: 	            "",	
		colony: 			"", state:              "", descriptionCompany: "", 
        roll:               "digdeeper",                urlImg:   "img/userDefault.png",
        webPage:            "", fanPage:            "", instagram:          "",
        rfc:                "", logo:               "", kindServices:      []		
	}
	$scope.dataUserTemp = {
		name: 		"",	lastname: 	"", 
		dateDay: 	"", dateMonth: 	"",	dateYear: 	"",
        check1:     false, check2: false
	}
    // Obtener todas las categorias para mostrarlas en el formulario
    categoryService.getSubcategories(function (subcategories) {
        //console.log(subcategories)
        $scope.subcategories = subcategories
    },function (err) {
        //alert("Algo salio mal "+err)
        console.log("Algo salio mal")
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
                    $scope.dataUser.logo = response
                    //$scope.newService.pictures = response
                    console.log(response)
                }
            })
            this.on("error", function(file, response) {
                console.log(response)
                if (response === "You can not upload any more files.") {
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "No puedes subir más de 1 foto, inténtalo nuevamente."
                    })
                    this.removeAllFiles()
                }
            })
            this.on("complete", function(file) {
              //this.removeFile(file);
            })
        },
        url             : 'v1/digdeeperImgServiceTemp/',
        parallelUploads : 1,
        uploadMultiple  : true,
        maxFileSize     : 30,
        addRemoveLinks  : 'dictCancelUpload',
        paramName: "photos",
        maxFiles: 1
    }

    // añadirle el rol digdeeper a una cuenta de usuario normal
    $scope.updateUserToDigdeeper = function () {   
        //  Hace la validación de los datos faltantes, para tener una cuenta digdeeper
        var formValid = formIsValid2($scope.dataUser)
        if (formValid === true) {
            userService.updateUserToDigdeeper($scope.user._id, $scope.dataUser, $localStorage.token, 
            function (user) {
                $rootScope.$emit('openAlertDigdeepModal', {
                    textAlert: "Ahora también cuentas con una cuenta DIGDEEPER.\n Inicia Sesión nuevamente"
                })
                $rootScope.$emit('checkRollUser',{done: function() {
                }})
                $scope.typeUser = $rootScope.typeUser
                sendEmailToDIGDEEP()
                $rootScope.$emit("reloadlogout")
            },function (error) {
                console.log(error)
            })
        }
    }
    
	$scope.registerUser = function () {
		//	Hace la validación del formulario de campos vacios 
        var formValid = formIsValid($scope.dataUserTemp, $scope.dataUser)
        if (formValid === true) {
        	var password1 = $scope.dataUser.password
        	var password2 = $scope.dataUser.confirmPassword
        	if (password1 === password2 && password1 !==null && password2 !==null ) {
                if ($scope.dataUserTemp.check1 == true) {
                    $scope.dataUser.kindServices.push("presencial")
                }
                if ($scope.dataUserTemp.check2 == true) {
                    $scope.dataUser.kindServices.push("athome")
                }
                //concatenar valores recolectados del formulario
                $scope.dataUser.name        = $scope.dataUserTemp.name +" "+$scope.dataUserTemp.lastname
                $scope.dataUser.birthdate   = $scope.dataUserTemp.dateDay+"/"+$scope.dataUserTemp.dateMonth+"/"+$scope.dataUserTemp.dateYear
                
        		userService.registerUser($scope.dataUser, function (user) {
                    $http({
                        method: 'POST',
                        url: "v1/authenticate",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = []
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
                            return str.join("&")
                        },
                        data: {email: $scope.dataUser.email, password: $scope.dataUser.password}
                    }).then(function (response) {
                        $localStorage.token = response.data.token //guardar token en local storage response.data.token
                        // Obtener los datos del usuario para mostrar su perfil
                        $rootScope.$emit('checkRollUser',{done: function() {
                        }})
                        $scope.typeUser = $rootScope.typeUser
                        $rootScope.$emit('reloadUser',{done: function() {
                        }})
                        sendEmailToDIGDEEP()
                        $rootScope.$emit('openRegisterDigdeeperModal',{
                            user: user
                        })
                    },function (err){
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "Error al iniciar sesión"
                        })
                    })
        		},function (error) {
        			//console.log(error)
        			//alert("Ya existe un usuario con ese correo registrado")
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Ya existe un usuario con ese correo registrado"
                    })
        		})
        	}else {
        		//alert("Las contraseñas no coinciden")
                $rootScope.$emit("openAlertDigdeepModal",{
                    textAlert: "Las contraseñas no coinciden"
                })
        		$scope.dataUser.password = ""
        		$scope.dataUser.confirmPassword = ""
        	}
        }
	}

    function sendEmailToDIGDEEP() {
        // Configurando datos para genarar el correo a enviar a digdeep
        var html =  "<div style='text-align:center'><h3>Registro de un nuevo DIGDEEPER</h3></div>"+
                    "<div style='text-align:center'><p>Un usuario inicio su proceso para ser digdeeper."+ 
                    "Sus datos son los siguientes: </p></div>"+
                    "<div style='text-align:center'>"+
                        "<p>Nombre: "+$scope.user.fullname+"</p>"+
                        "<p>Telefono: "+$scope.user.phone+"</p>"+
                        "<p>E-mail de contacto: "+$scope.user.email+"</p>"+
                        "<p>Fecha de nacimiento: "+$scope.user.birthdate+"</p>"+
                        "<p>Calle: "+$scope.user.address+"</p>"+
                        "<p>Colonia: "+$scope.user.colony+"</p>"+
                        "<p>Ciudad: "+$scope.user.city+"</p>"+
                        "<p>Estado: "+$scope.user.state+"</p>"+
                        "<p>Especialidad: "+$scope.user.specialty+"</p>"+
                    "</div>"
        var data = {
            HTML:       html,
            subject:    "Inicio de proceso de un DIGDEEPER nuevo",
            to:         $scope.emailDigdeep//Correo de digdeep
        }
        $http.post("v1/emails", data)
        .then(function(response) {
        },function (response) {
            //$rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo enviar su correo de confirmación comuniquese al télefono o por correo con DIGDEEP porfavor."})
        })
    }

    function formIsValid2(dataUser) {
        if (angular.isDefined(dataUser.service)) {
            if (dataUser.service != null || dataUser.service != undefined) {
                if(dataUser.service.length === 0) {
                    $scope.serviceFailed = true
                    return false
                }
                else $scope.serviceFailed = false
            }else{
                $scope.serviceFailed = true
                return false
            }
        }
        else {
            $scope.serviceFailed = true
            return false
        }

        if (angular.isDefined(dataUser.specialty)) {
            if(dataUser.specialty.length === 0) {
                $scope.specialtyFailed = true
                return false
            }
            else $scope.specialtyFailed = false
        }
        else {
            $scope.specialtyFailed = true
            return false
        }

        return true
    }

	function formIsValid (userTemp, dataUser) {
        if (angular.isDefined(userTemp.name)) {
            if(userTemp.name.length === 0){
            	$scope.nameFailed = true
            	return false
            }else $scope.nameFailed = false
        }
        else{
        	$scope.nameFailed = true
        	return false
        }

        if (angular.isDefined(userTemp.lastname)) {
            if(userTemp.lastname.length === 0){
            	$scope.lastnameFailed = true
            	return false
            } 
            else $scope.lastnameFailed = false
        }
        else {
        	$scope.lastnameFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.email)) {
            if(dataUser.email.length === 0){
            	$scope.emailFailed = true
            	return false
            } 	
            else $scope.emailFailed = false
        }
        else {
        	$scope.emailFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.password)) {
            if(dataUser.password.length === 0){
            	$scope.passwordFailed = true
            	return false
            } 
            else $scope.passwordFailed = false
        }
        else {
        	$scope.passwordFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.confirmPassword)) {
            if(dataUser.confirmPassword.length === 0){
		        $scope.confirmPasswordFailed = true
		        return false            	
            } 
            else $scope.confirmPasswordFailed = false
        }
        else {
        	$scope.confirmPasswordFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.phone)) {
            if(dataUser.phone === null) {
            	$scope.phoneFailed = true
            	return false
            }
            else{
            	if (dataUser.phone.length === 0) {
	            	$scope.phoneFailed = true	
	            	return false
	            }else $scope.phoneFailed = false
	        }
        }
        else {
        	$scope.phoneFailed = true
        	return false
        }
        if (angular.isDefined(dataUser.address)) {
            if(dataUser.address.length === 0) {
                $scope.addressFailed = true
                return false
            }
            else $scope.addressFailed = false
        }
        else {
            $scope.addressFailed = true
            return false
        }

        if (angular.isDefined(dataUser.colony)) {
            if(dataUser.colony.length === 0) {
                $scope.colonyFailed = true
                return false
            }
            else $scope.colonyFailed = false
        }
        else {
            $scope.colonyFailed = true
            return false
        }

        if (angular.isDefined(dataUser.city)) {
            if(dataUser.city.length === 0) {
            	$scope.cityFailed = true
            	return false
            }
            else $scope.cityFailed = false
        }
        else {
        	$scope.cityFailed = true
        	return false
        } 

        if (angular.isDefined(dataUser.state)) {
            if (dataUser.state === undefined || dataUser.state === null) {
                $scope.stateFailed = true
                return false
            }else{
                if(dataUser.state.length === 0) {
                    $scope.stateFailed = true
                    return false
                }
                else $scope.stateFailed = false
            }
        }
        else {
            $scope.stateFailed = true
            return false
        }

        if (angular.isDefined(dataUser.postalCode)) {
            if(dataUser.postalCode === null) {
                $scope.postalCodeFailed = true
                return false
            }else{
                 if (dataUser.postalCode.length === 0) {
                    $scope.dateDayFailed = true 
                    return false
                }else $scope.postalCodeFailed = false
            }
        }
        else {
            $scope.postalCodeFailed = true
            return false
        }

        if (angular.isDefined(userTemp.dateDay)) {
            if(userTemp.dateDay === null){
            	$scope.dateDayFailed = true
            	return false
            }else 
	            if (userTemp.dateDay.length === 0) {
	            	$scope.dateDayFailed = true	
	            	return false
	            }else $scope.dateDayFailed = false
        }
        else {
        	$scope.dateDayFailed = true
        	return false
        }

        if (angular.isDefined(userTemp.dateMonth)) {
            if (userTemp.dateMonth === undefined || userTemp.dateMonth === null) {
                $scope.dateMonthFailed = true
                return false
            }else{
                if(userTemp.dateMonth.length === 0) {
                    $scope.dateMonthFailed = true
                    return false
                }
                else $scope.dateMonthFailed = false
            }
        }
        else {
            $scope.dateMonthFailed = true
            return false
        }

        if (angular.isDefined(userTemp.dateYear)) {
            if(userTemp.dateYear === null) {
            	$scope.dateYearFailed = true
            	return false
            }
           	else 
	            if (userTemp.dateYear.length === 0) {	
	            	$scope.dateYearFailed = true
	            	return false
	            }
	            else $scope.dateYearFailed = false
        }
        else {
        	$scope.dateYearFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.service)) {
            if (dataUser.service != null || dataUser.service != undefined) {
                if(dataUser.service.length === 0) {
                    $scope.serviceFailed = true
                    return false
                }
                else $scope.serviceFailed = false
            }else{
                $scope.serviceFailed = true
                return false
            }
        }
        else {
            $scope.serviceFailed = true
            return false
        }

        if (angular.isDefined(dataUser.specialty)) {
            if(dataUser.specialty.length === 0) {
            	$scope.specialtyFailed = true
            	return false
            }
            else $scope.specialtyFailed = false
        }
        else {
        	$scope.specialtyFailed = true
        	return false
        }

        if ($scope.dataUserTemp.check1 == false && $scope.dataUserTemp.check2 == false) {
            $scope.kindServicesFailed = true
            return false
        }
        else {
            $scope.kindServicesFailed = false
        }

        if (angular.isDefined(dataUser.webPage)) {
            if(dataUser.webPage.length === 0) {
                $scope.webPageFailed = true
                return false
            }
            else $scope.webPageFailed = false
        }
        else {
            $scope.webPageFailed = true
            return false
        }

        if (angular.isDefined(dataUser.fanPage)) {
            if(dataUser.fanPage.length === 0) {
                $scope.fanPageFailed = true
                return false
            }
            else $scope.fanPageFailed = false
        }
        else {
            $scope.fanPageFailed = true
            return false
        }

        if (angular.isDefined(dataUser.instagram)) {
            if(dataUser.instagram.length === 0) {
                $scope.instagramFailed = true
                return false
            }
            else $scope.instagramFailed = false
        }
        else {
            $scope.instagramFailed = true
            return false
        }

        if (angular.isDefined(dataUser.rfc)) {
            if(dataUser.rfc.length === 0) {
                $scope.rfcFailed = true
                return false
            }
            else $scope.rfcFailed = false
        }
        else {
            $scope.rfcFailed = true
            return false
        }

        return true
    }

}])
