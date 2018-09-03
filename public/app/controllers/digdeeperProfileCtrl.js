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
    var date_temp = new Date()
    //console.log(date_temp.toISOString(date_temp.setHours(0, 0, 0)))
    var arrayHoursDefault = [date_temp.toISOString(date_temp.setHours(0, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(0, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(1, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(1, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(2, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(2, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(3, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(3, 30, 0)),

                             date_temp.toISOString(date_temp.setHours(4, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(4, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(5, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(5, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(6, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(6, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(7, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(7, 30, 0)),

                             date_temp.toISOString(date_temp.setHours(8, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(8, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(9, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(9, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(10, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(10, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(11, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(11, 30, 0)),

                             date_temp.toISOString(date_temp.setHours(12, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(12, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(13, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(13, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(14, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(14, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(15, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(15, 30, 0)),


                             date_temp.toISOString(date_temp.setHours(16, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(16, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(17, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(17, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(18, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(18, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(19, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(19, 30, 0)),

                             date_temp.toISOString(date_temp.setHours(20, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(20, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(21, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(21, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(22, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(22, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(23, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(23, 30, 0))]
                           	//console.log($scope.arrayHoursDefault)
    $scope.arrayHoursDefault_init = arrayHoursDefault
    $scope.arrayHoursDefault_finish = arrayHoursDefault
                             
    $scope.initDataProfileUser = function () {
		$scope.athome = false
    	$scope.presencial = false
    	$scope.service_time = {}
		userService.getUser($scope.user._id, function (user) {
			//console.log(user)
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
				logo: 				user.logo,
				id: 				user._id
			}
			if (user.service_time && user.service_time.init != null && user.service_time != undefined) {
    			var hourTemp_init = new Date(user.service_time.init)
                var hourTemp_finish = new Date(user.service_time.finish)
			
				$scope.service_time = {
					init: date_temp.toISOString(date_temp.setHours(hourTemp_init.getHours(), hourTemp_init.getMinutes(), 0)),
					finish: date_temp.toISOString(date_temp.setHours(hourTemp_finish.getHours(), hourTemp_finish.getMinutes(), 0))
				}
				console.log($scope.service_time)
				reloadHoursFinal($scope.service_time.init)
			}else{
				$scope.service_time = {
					init: null,
					finish: null
				}
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
			var arrayDate = []
			// Separar la fecha de nacimiento para poder mostrarla en formulario
			if (user.birthdate != undefined) {
				var arrayDate 	= user.birthdate.split("/")
			} 
			
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
	function reloadHoursFinal(hinit) {
        var arrayClean = []
        for (var i = 0; i < arrayHoursDefault.length; i++) {
            if(arrayHoursDefault[i] > hinit){
                arrayClean.push(arrayHoursDefault[i])
            }
        }
        $scope.arrayHoursDefault_finish = arrayClean
    }
	$scope.selectHourInit = function (hour_init) {
		reloadHoursFinal(hour_init)
		$scope.service_time.finish = hour_init
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
	$scope.updateProfile = function (idUser,dataUsr,userTemp,rol,athome,presencial,service_time) {
		if (service_time.init != null && service_time.init != undefined) {
			if (service_time.finish != null && service_time.finish != undefined) {
				if (service_time.finish > service_time.init) {
					$rootScope.$emit('openEditInfoUserModal', {idUser,dataUsr,userTemp,rol,athome,presencial,service_time})
				}else{
					$rootScope.$emit("openAlert",{
                    	textAlert: "Horario de servicio invalido."
                	})
				}
			}else{
				$rootScope.$emit("openAlert",{
                    textAlert: "Debés seleccionar los dos horarios de servicio."
                })
			}
		}else{
			$rootScope.$emit("openAlert",{
            	textAlert: "Horario de servicio invalido."
        	})
		}
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
        url             : 'v1/digdeeper_logo/',
        parallelUploads : 1,
        uploadMultiple  : true,
        maxFileSize     : 30,
        addRemoveLinks  : 'dictCancelUpload',
        paramName: "photos",
        maxFiles: 1
    }
}])
