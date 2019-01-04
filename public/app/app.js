var app = angular.module('digdeepApp', [
	"ui.router",
	"ui.bootstrap",
	"ngStorage",
	"angular-jwt",
	"ngDropzone",
	"google.places",
	"uiGmapgoogle-maps",
	"ui.calendar",
	'auth0.lock',

	"digdeepApp.mainCtrl",
	"digdeepApp.prehomeCtrl",
	"digdeepApp.loginCtrl",
	"digdeepApp.registerDigdeeperCtrl",
	"digdeepApp.registerUserCtrl",
	"digdeepApp.homeCtrl",
	"digdeepApp.commentsUsersCtrl",
	"digdeepApp.providersCtrl",
	"digdeepApp.listOrdersCtrl",

	"digdeepApp.howFunctionDDCtrl",
	"digdeepApp.howToBeDDCtrl",
	"digdeepApp.servicesDDCtrl",
	"digdeepApp.whatIsDDCtrl",
	"digdeepApp.whyUseDDCtrl",
	"digdeepApp.contactDDCtrl",

	"digdeepApp.homeESCtrl",
	"digdeepApp.homeLSCtrl",
	"digdeepApp.homeBECtrl",
	"digdeepApp.homeDECtrl",
	"digdeepApp.homeHOCtrl",

	"digdeepApp.servicesESCtrl",
	"digdeepApp.servicesLSCtrl",
	"digdeepApp.servicesBECtrl",

	"digdeepApp.profilesESCtrl",
	"digdeepApp.profilesLSCtrl",
	"digdeepApp.profilesHOCtrl",
	"digdeepApp.profilesBECtrl",
	
	"digdeepApp.userProfileCtrl",
	"digdeepApp.digdeeperProfileCtrl",
	"digdeepApp.inboxProfileCtrl",
	"digdeepApp.historyServicesCtrl",
	"digdeepApp.historyOrdersCtrl",
	"digdeepApp.servicesDigDeeperCtrl",
	"digdeepApp.calendarService",

	"digdeepApp.contractServiceModalCtrl",
	"digdeepApp.registerDigdeeperModalCtrl",
	"digdeepApp.registerUserModalCtrl",
	"digdeepApp.changePasswordModalCtrl",
	"digdeepApp.deleteServiceModalCtrl",
	"digdeepApp.confirmOrderModalCtrl",	
	"digdeepApp.finishOrderModalCtrl",
	"digdeepApp.cancelOrderModalCtrl",
	"digdeepApp.editInfoUserModalCtrl",
	"digdeepApp.newServiceLoadingModalCtrl",
	"digdeepApp.editInfoServiceModalCtrl",
	"digdeepApp.detailsServiceModalCtrl",
	"digdeepApp.alertDigdeepModalCtrl",
	"digdeepApp.detailsDigdeeperModalCtrl",
	"digdeepApp.commentsToDigdeeperModalCtrl",
	"digdeepApp.dataDeliveryModalCtrl",
	"digdeepApp.payTotalServiceModalCtrl",
	"digdeepApp.commentsServiceModalCtrl",
	"digdeepApp.forgetPasswordModalCtrl",
	"digdeepApp.loginToContractModalCtrl",
	"digdeepApp.factOrderModalCtrl",
	"digdeepApp.alertCtrl",
	"digdeepApp.notePrivacyCtrl",
	"digdeepApp.termsCtrl",
	"digdeepApp.questionsCtrl",
	"digdeepApp.calendarCtrl",
	"digdeepApp.dateInfoModalCtrl",
	"digdeepApp.newEventCalendarModalCtrl",
	"digdeepApp.dateInfoOutModalCtrl",
	"digdeepApp.addMethodPayModalCtrl",
	"digdeepApp.confirmEmailCtrl",


	'digdeepApp.userService',
	'digdeepApp.serviceService',
	'digdeepApp.categoryService',
	'digdeepApp.ordersService',
	'digdeepApp.commentsService',
	'digdeepApp.geocodeService',
	'digdeepApp.conektaService'
])
.config(['$urlRouterProvider', 'lockProvider', function ($urlRouterProvider, lockProvider) {
	$urlRouterProvider.otherwise('/')
	
	var options = {
		theme: {
		    labeledSubmitButton: false,
		    logo: "https://digdeep.mx/img/logoDD.png",
		    primaryColor: "#26a5dc",
		    authButtons: {
		      connectionName: {
		        displayName: "...", 
		        primaryColor: "...", 
		        foregroundColor: "...", 
		        icon: "https://.../logo.png"
		      }
		    },
		    redirectUrl: ""
		},
		language: "es",
		loginAfterSignUp: true,
		responseType: 'token',
		auth:{
			redirect: false,
	        responseType: 'token',
	        params:{
	          state:"some thing I need to preserve"
	        }
	    },
	    allowSignUp: true
	    //autoclose: true 
	}
	lockProvider.init({
	    clientID: 'cClzTGh4UG8urrvPOJzVqvaPMxnk3Ntl',
	    domain: 'digdeepproyecto.auth0.com',
	    options: options
  	});
}]);

app.run(function(lock, $rootScope, userService, $localStorage, $state) {
	// OPCIONES PARA LOK LOGIN
	var options = {
		theme: {
		    labeledSubmitButton: false,
		    logo: "https://digdeep.mx/img/logoDD.png",
		    primaryColor: "#26a5dc",
		    authButtons: {
		      connectionName: {
		        displayName: "...", 
		        primaryColor: "...", 
		        foregroundColor: "...", 
		        icon: "https://.../logo.png"
		      }
		    },
		    redirectUrl: ""
		},
		language: "es",
		loginAfterSignUp: true,
		responseType: 'token',
		auth:{
			redirect: false,
	        responseType: 'token',
	        params:{
	          state:"some thing I need to preserve"
	        }
	    },
	    allowSignUp: false
	    //autoclose: true 
	}
	var id_auth0 = ""
	var profile = {}
	/// LOK PARA LOGIN
	$rootScope.lockLogin = new Auth0Lock('cClzTGh4UG8urrvPOJzVqvaPMxnk3Ntl', 'digdeepproyecto.auth0.com', options);
 	$rootScope.lockLogin.on("authenticated", function(authResult) {
 		//alert(authResult)
		lock.getUserInfo(authResult.accessToken, function(error, profile) {
		    if (error) {
		    	// Handle error
		      	return;
		    }
		    //console.log(profile)
		 	localStorage.setItem("accessToken", authResult.accessToken);
		    localStorage.setItem("profile", JSON.stringify(profile));
		    id_auth0 = profile.sub
		    profile = profile
		    userService.getTokenByIdAuth0(String(id_auth0), function (token) {
		 		// Verificar si el usuario no ha sido registrado con una red social
		 		if (token == null) {
		 			// Verifcar si la autentifiación es por google
		 			if (id_auth0.indexOf('google-oauth2') != -1) {
		 				var data_user = {
		 					name: String(profile.name),
							email: String(profile.email),
							roll: "user",
							auth0Id: id_auth0,
							urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
		 				}
		 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
		 				userService.registerUserBySocialRed(data_user, function (usr) {
		 					// Obtener el token del usuario registrado
		 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
		 						if (profile.email_verified == true) {
		 							$localStorage.token = token	
		 							$state.go('userprofile')
		 						}else{
		 							$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
		 						}
							}, function (err) {

								console.log(err)
							})
		 				}, function (err) {
		 					console.log(err)
		 				})
		 			}
		 			if (id_auth0.indexOf('facebook') != -1) {
		 				var data_user = {
		 					name: String(profile.name),
							email: String(profile.email),
							roll: "user",
							auth0Id: id_auth0,
							urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
		 				}
		 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
		 				userService.registerUserBySocialRed(data_user, function (usr) {
		 					// Obtener el token del usuario registrado
		 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
		 						if (profile.email_verified == true) {
		 							$localStorage.token = token	
		 							$state.go('userprofile')
		 						}else{
		 							$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
		 						}
							}, function (err) {
								console.log(err)
							})
		 				}, function (err) {
		 					console.log(err)
		 				})
		 			}
		 			if (id_auth0.indexOf('auth0') != -1) {
		 				var data_user = {
		 					name: String(profile.name),
							email: String(profile.email),
							roll: "user",
							auth0Id: id_auth0,
							urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
		 				}
		 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
		 				userService.registerUserBySocialRed(data_user, function (usr) {
		 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
								if (profile.email_verified == true) {
		 							$localStorage.token = token	
		 							$state.go('userprofile')
		 						}else{
									$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
		 						}
							}, function (err) {
								console.log(err)
							})
		 				}, function (err) {
		 					console.log(err)
		 				})
		 			}
		 		}else{
		 			// Si ya existe el usuario		
		 			console.log("login")
		 			console.log("id_auth0 "+ id_auth0)
		 			if (id_auth0.indexOf('auth0') != -1) {
		 				if (profile.email_verified == true) {
		 					$localStorage.token = token	
							if (userService.isTokenValidAsDigdeeper(token)) {
				 				console.log("digdeeperprofile")
				 				$state.go('digdeeperprofile')
				 			}
							if (userService.isTokenValidAsUser(token)) {
								console.log("userprofile")
								$state.go('userprofile')
							}
						}else{
							$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
						}	
		 			}
		 			if (id_auth0.indexOf('google-oauth2') != -1 || id_auth0.indexOf('facebook') != -1) {
		 				$localStorage.token = token	
		 				if (userService.isTokenValidAsDigdeeper(token)) {
			 				console.log("digdeeperprofile")
			 				$state.go('digdeeperprofile')
			 			}
						if (userService.isTokenValidAsUser(token)) {
							console.log("userprofile")
							$state.go('userprofile')
						}
		 			}
		 		}
		 	}, function (err) {
		 		console.log(err)
				$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentaló más tarde."})
		 	})
	  	});
	});
  	
  	// OPCIONES PARA LOK DE REGISTRO
	var options2 = {
		theme: {
		    labeledSubmitButton: false,
		    logo: "https://digdeep.mx/img/logoDD.png",
		    primaryColor: "#26a5dc",
		    authButtons: {
		      connectionName: {
		        displayName: "...", 
		        primaryColor: "...", 
		        foregroundColor: "...", 
		        icon: "https://.../logo.png"
		      }
		    },
		    redirectUrl: ""
		},
		language: "es",
		loginAfterSignUp: true,
		responseType: 'token',
		auth:{
			redirect: false,
	        responseType: 'token',
	        params:{
	          state:"some thing I need to preserve"
	        }
	    },
	    allowLogin: false,
	    loginAfterSignup: false,
	    auto_login: false
	    //autoclose: true 
	}

	// LOK PARA REGISTRO USUARIO
	$rootScope.lockRegister = new Auth0Lock('cClzTGh4UG8urrvPOJzVqvaPMxnk3Ntl', 'digdeepproyecto.auth0.com', options2);
	$rootScope.lockRegister.on("authenticated", function(authResult) {
		lock.getUserInfo(authResult.accessToken, function(error, profile) {
	  		console.log(profile)
		    if (error) {
		      // Handle error
		      return;
		    }
		    localStorage.setItem("accessToken", authResult.accessToken);
		    localStorage.setItem("profile", JSON.stringify(profile));
		    id_auth0 = profile.sub
		    profile = profile
		    // Registrar usuario en la db que fue registrado en auth0 por correo y contraseña.
		    if (id_auth0.indexOf('auth0') != -1) {
 				var data_user = {
 					name: String(profile.name),
					email: String(profile.email),
					roll: "user",
					auth0Id: id_auth0,
					urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
 				}
 				//console.log("registrando")
 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
 				userService.registerUserBySocialRed(data_user, function (usr) {
 					//console.log("registrando usuario "+usr)
 					if (usr) {
 						if (profile.email_verified == true) {
 							userService.getTokenByIdAuth0(String(id_auth0), function (token) {
								$localStorage.token = token	
		 						$state.go('userprofile')
							}, function (err) {
								$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
							})
 						}else{
 							userService.getTokenByIdAuth0(String(id_auth0), function (token) {
								if (profile.email_verified == true) {
									$localStorage.token = token	
		 							$state.go('userprofile')
								}
							}, function (err) {
								$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
							})
 							$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
						}
 					}
 				}, function (err) {
 					console.log(err)
					$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
 				})
 			}
 			if (id_auth0.indexOf('google-oauth2') != -1 || id_auth0.indexOf('facebook') != -1) {
 				userService.getTokenByIdAuth0(String(id_auth0), function (token) {
			 		// Verificar si el usuario no ha sido registrado con una red social
			 		if (token == null) {
			 			// Verifcar si la autentifiación es por google
			 			if (id_auth0.indexOf('google-oauth2') != -1) {
			 				var data_user = {
			 					name: String(profile.name),
								email: String(profile.email),
								roll: "user",
								auth0Id: id_auth0,
								urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
			 				}
			 				//console.log(data_user.email)
			 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
			 				userService.registerUserBySocialRed(data_user, function (usr) {
			 					//console.log(usr)
			 					// Obtener el token del usuario registrado
			 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
									if (token != null) {
			 							$localStorage.token = token	
			 							$state.go('userprofile')
			 						}else{
			 							//alert('Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado.')
		 								$rootScope.$emit("openAlert", {textAlert:"Lo sentimos intentaló nuevamente porfavor."})
		 							}
								}, function (err) {
									console.log(err)
			 						//$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios, intentaló más tarde"})

								})
			 				}, function (err) {
			 					console.log(err)
								$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})

			 				})
			 			}

			 			if (id_auth0.indexOf('facebook') != -1) {
			 				console.log(profile)
							console.log("#" + profile.name + "# #" + profile.email + "# #" + profile.picture + "#");
							//$rootScope.$emit("openAlert", {textAlert:"#" + profile.name + "# #" + profile.email + "# #" + profile.picture + "#"})
			 				var data_user = {
			 					name: String(profile.name),
								email: String(profile.email),
								roll: "user",
								auth0Id: id_auth0,
								urlImg: profile.picture
			 				}
			 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
			 				userService.registerUserBySocialRed(data_user, function (usr) {
			 					// Obtener el token del usuario registrado
			 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
									if (token != null) {
			 							$localStorage.token = token	
			 							$state.go('userprofile')
			 						}else{
			 							$rootScope.$emit("openAlert", {textAlert:"Lo sentimos intentaló nuevamente porfavor."})
		 							}
								}, function (err) {
									console.log(err)
									$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
								})
			 				}, function (err) {
			 					console.log(err)
								$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
			 					
			 				})
			 			}
			 			
			 		}else{
			 			// Si ya existe el usuario
			 			$localStorage.token = token	
			 			$state.go('userprofile')
			 		}
			 	}, function (err) {
			 		console.log(err)
			 	})
 			}
		    
	  	});
	});

	// LOK PARA REGISTRO DE DIGDEEPER
	$rootScope.lockRegister2 = new Auth0Lock('cClzTGh4UG8urrvPOJzVqvaPMxnk3Ntl', 'digdeepproyecto.auth0.com', options2);
	$rootScope.lockRegister2.on("authenticated", function(authResult) {
		console.log(authResult)
	  	lock.getUserInfo(authResult.accessToken, function(error, profile) {
		    if (error) {
		      // Handle error
		      return;
		    }
		    console.log(profile)
		 	localStorage.setItem("accessToken", authResult.accessToken);
		    localStorage.setItem("profile", JSON.stringify(profile));
		    id_auth0 = profile.sub
		    profile = profile

	    	// Registrar usuario en la db que fue registrado en auth0 por correo y contraseña.
	    	if (id_auth0.indexOf('auth0') != -1) {
				var data_user = {
					name: String(profile.name),
				email: String(profile.email),
				roll: "digdeeper",
				auth0Id: id_auth0,
				urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
				}
				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
				userService.registerUserBySocialRed(data_user, function (usr) {
					//console.log("registrando usuario "+usr)
					if (usr) {
						if (profile.email_verified == true) {
							userService.getTokenByIdAuth0(String(id_auth0), function (token) {
								if (profile.email_verified == true) {
									$localStorage.token = token	
		 							$state.go('digdeeperprofile')
								}
							}, function (err) {
								$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
							})
						}else{
							$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
						}
					}
				}, function (err) {
					console.log(err)
				$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
				})
			}
			if (id_auth0.indexOf('google-oauth2') != -1 || id_auth0.indexOf('facebook') != -1) {
				userService.getTokenByIdAuth0(String(id_auth0), function (token) {
		 		//console.log(token)
		 		// Verificar si el usuario no ha sido registrado con una red social
		 		if (token == null) {
		 			// Verifcar si la autentifiación es por google
		 			if (id_auth0.indexOf('google-oauth2') != -1) {
		 				var data_user = {
		 					name: String(profile.name),
							email: String(profile.email),
							roll: "digdeeper",
							auth0Id: id_auth0,
							urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
		 				}
		 				//console.log(data_user.email)
		 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
		 				userService.registerUserBySocialRed(data_user, function (usr) {
		 					console.log(usr)
		 					// Obtener el token del usuario registrado
		 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
								if (token != null) {
		 							$localStorage.token = token	
		 							$state.go('digdeeperprofile')
		 						}else{
		 							$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
	 							}
							}, function (err) {
								console.log(err)
								$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})
							})
		 				}, function (err) {
		 					console.log(err)
							$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})

		 				})
		 			}

		 			if (id_auth0.indexOf('facebook') != -1) {
		 				console.log(profile)
		 				var data_user = {
		 					name: String(profile.name),
							email: String(profile.email),
							roll: "digdeeper",
							auth0Id: id_auth0,
							urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
		 				}
		 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
		 				userService.registerUserBySocialRed(data_user, function (usr) {
		 					console.log(usr)
		 					// Obtener el token del usuario registrado
		 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
								if (token != null) {
		 							$localStorage.token = token	
		 							$state.go('digdeeperprofile')
		 						}else{
	 								$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
	 							}
							}, function (err) {
								console.log(err)
								$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})

							})
		 				}, function (err) {
		 					console.log(err)
							$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})

		 				})
		 			}
		 			
		 		}else{
		 			// Si ya existe el usuario
		 			$localStorage.token = token	
		 			$state.go('digdeeperprofile')
		 		}
		 	}, function (err) {
		 		console.log(err)
				$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentalo más tarde."})

		 	})
		}
	});
	});
});

app.constant('APP_SETTINGS',  {
	CONEKTA: {
		//CONEKTA_API_KEY: 'key_ETHz2nziQpiTmZhqTQBAzjw',
		CONEKTA_API_KEY: 'key_YifkBQVqDsu4KfEv8EpjivQ',
		LANGUAGE: 'es' 
	}
});

app.constant('APP_MESSAGES', {
	CONEKTA: {
		TARJETA_INVALIDA: 'Número de tarjeta inválido',
		FECHA_INVALIDA: 'Fecha de expiración inválida',
		TARJETA_VALIDA: 'Tarjeta válida',
		CVC_INVALIDO: 'El código CVC no es válido',
		TITULAR_REQUERIDO: 'El nombre del titular no puede ser vacío'
	}
});
