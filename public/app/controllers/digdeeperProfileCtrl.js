angular.module('digdeepApp.digdeeperProfileCtrl', [])
.directive("filereaddigdeeper", [function () {
    return {
        scope: {
            filereaddigdeeper: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.filereaddigdeeper = changeEvent.target.files[0];
                    console.log(scope.filereaddigdeeper)
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('digdeeperprofile', {
		url: '/digdeeperprofile',
		templateUrl: '/app/templates/digdeeperprofile.html',
		controller: 'digdeeperProfileCtrl'
	})
}])

.controller('digdeeperProfileCtrl', ['categoryService', '$scope', '$state', '$rootScope', 'userService', '$localStorage', 'ordersService', '$interval',
	function (                  	  categoryService,   $scope,   $state,   $rootScope,   userService,	  $localStorage,   ordersService,   $interval) {
	// Obtener el tipo de usuario para mostrar la barra de navegación acorde a el
	$rootScope.$emit('checkRollUser',{done: function() {
	}})
	$scope.typeUser = $rootScope.typeUser
	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
	// Recargar órdenes cada 5 segundos
	$interval(function(){
		//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
		$rootScope.$emit('checkRollUser',{done: function() {
   		}})
	}, 3000)

	// Obtener todas las categorias para mostrarlas en el formulario
    categoryService.getSubcategories(function (subcategories) {
        //console.log(subcategories)
        $scope.subcategories = subcategories
    },function (err) {
        console.log("Algo salio mal")
    })
	$scope.initDataProfileUser = function () {
		$scope.athome = false
    	$scope.presencial = false
		userService.getUser($scope.user._id, function (user) {
			$scope.digdeeperProfile = {
				fullname: 			user.fullname,
				address: 			user.address,
				colony: 			user.colony,
				postalCode: 		user.postalCode,
				numberHouse: 		user.numberHouse,
				city: 				user.city,
				state: 				user.state,  
				email: 				user.email,
				phone: 				user.phone,
				newPassword: 		"",
				currencyPassword: 	"",
				birthdate: 			user.birthdate,
				service: 		 	user.temp_service,
				specialty: 			user.specialty,
				descriptionCompany: user.descriptionCompany, 
				urlImg: 			user.urlImg,
				kindServices: 		[],
				webPage: 			user.webPage,
				fanPage: 			user.fanPage,
				instagram: 			user.instagram,
				rfc: 				user.rfc,
				logo: 				user.logo
			}
			if (user.kindServices === undefined || user.kindServices.length === 0) {
				$scope.digdeeperProfile.kindServices = []
			}else{
				$scope.digdeeperProfile.kindServices = user.kindServices
			}
			if (user.kindServices.indexOf('athome') != -1 && user.kindServices.indexOf('presencial') != -1 ) {
				$scope.athome = true
				$scope.presencial = true
			}else{
				if (user.kindServices.indexOf('athome') != -1) {
					$scope.athome = true
					$scope.presencial = false
				}else{
					if (user.kindServices.indexOf('presencial') != -1) {
						$scope.presencial = true
						$scope.athome = false
					}else{
						$scope.presencial = false
						$scope.athome = false
					}
				}
			}
			// Separar la fecha de nacimiento para poder mostrarla en formulario 
			var arrayDate 	= user.birthdate.split("/")

			$scope.digdeeperProfileTemp = {
				address: 	user.address,
				colony: 	user.colony,
				postalCode: user.postalCode,
				numberHouse:user.numberHouse,
				city: 		user.city,
				state: 		user.state,  
				dayDate:  	parseInt(arrayDate[0]),
				monthDate: 	arrayDate[1],
				yearDate: 	parseInt(arrayDate[2])
			}
		},function (err) {
			console.log(err)
			if ($localStorage.token == undefined) {
				$state.go("home")
			}
		})
	}
	// Enviar un correo para configurar tu contraseña
	$scope.changePasswordAuth0 = function (email) {
		console.log($scope.user)
		if ($scope.user.auth0Id.indexOf('auth0') != -1) {
			userService.changePasswordAuth0(email, function (message) {
				if (message == "We've just sent you an email to reset your password.") {
					$rootScope.$emit("openAlertDigdeepModal",{
		                textAlert: "Te hemos enviado a tu correo un email para cambiar tu contraseña."
		            })
				}else{
					$rootScope.$emit("openAlertDigdeepModal",{
		                textAlert: "Lo sentimos tenemos problemas con restablecer tu constraseña intentalo más tarde."
		            })
				}
			}, function (err) {
				console.log(err)
			})
		}else{
			$rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Tu cuenta esta registrada con una red social, debes cambiar tu contraseña desde la cuenta de tu red social."
            })
		}
	}
	$scope.selectKindService = function (check) {
		if (check === 1) {
			if ($scope.athome === true) {
				$scope.athome = false
				return true
			}else{
				if ($scope.athome === false) {
					$scope.athome = true
					return true
				}
			}
		}
		if (check === 2) {
			if ($scope.presencial === true) {
				$scope.presencial = false
				return true
			}else{
				if ($scope.presencial === false) {
					$scope.presencial = true
					return true
				}
			}
		}
	}
	$scope.updateDDProfile = function () {
		$scope.digdeeperProfile.birthdate = $scope.digdeeperProfileTemp.dayDate+"/"+$scope.digdeeperProfileTemp.monthDate+"/"+$scope.digdeeperProfileTemp.yearDate
		if ($scope.athome == true) {
			$scope.digdeeperProfile.kindServices.push("athome")
		}
		if ($scope.presencial == true) {
			$scope.digdeeperProfile.kindServices.push("presencial")
		}
		console.log("actualizando "+$scope.digdeeperProfile)
		userService.updateDigdeeperProfile($scope.user._id, $scope.digdeeperProfile, $localStorage.token, function (user) {
			console.log(user)
			$rootScope.$emit("openAlertDigdeepModal",{
				textAlert: "Tus datos se actualizaron correctamente"
			})
			// Recargar los datos del usuario para obtener los actualizados
			$scope.initDataProfileUser()
		}, function (err) {
			console.log(err)
			alert("Algo salio mal, usuario no actualizado: "+err.data.message)
		})
	}
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
                    $scope.digdeeperProfile.logo = response
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
}])
