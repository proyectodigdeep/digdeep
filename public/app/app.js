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
	"digdeepApp.homeENCtrl",
	"digdeepApp.homeDECtrl",
	"digdeepApp.homeHOCtrl",

	"digdeepApp.servicesESCtrl",
	"digdeepApp.servicesLSCtrl",
	"digdeepApp.servicesHOCtrl",

	"digdeepApp.profilesESCtrl",
	"digdeepApp.profilesLSCtrl",
	"digdeepApp.profilesHOCtrl",
	
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
	
	/*angularAuth0Provider.init({
	    clientID: 'WneauBfFMFe4q4EJ76FPLm47TKsInbI_',
	    domain: 'creainte2.auth0.com'
	});*/
	
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
	    clientID: 'WneauBfFMFe4q4EJ76FPLm47TKsInbI_',
	    domain: 'creainte2.auth0.com',
	    options: options
  	});
}]);

app.run(function(lock, $rootScope, userService, $localStorage, $state) {
	//$rootScope.lock = lock
	//console.log(lock)

	/////////
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
	$rootScope.lockLogin = new Auth0Lock('WneauBfFMFe4q4EJ76FPLm47TKsInbI_', 'creainte2.auth0.com', options);
	//console.log(lock)
	///////////////
 	//$rootScope.lock.options.allowSignUp = false
	$rootScope.lockLogin.on("authenticated", function(authResult) {
		//console.log(authResult)
	  	lock.getUserInfo(authResult.accessToken, function(error, profile) {
	    if (error) {
	      // Handle error
	      return;
	    }
	    //console.log(profile)
	 	localStorage.setItem("accessToken", authResult.accessToken);
	    localStorage.setItem("profile", JSON.stringify(profile));
	    var id_auth0 = profile.sub
	    var profile = profile
	    userService.getTokenByIdAuth0(String(id_auth0), function (token) {
	 		//console.log(token)
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
	 					console.log(usr)
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
	 					console.log(usr)
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
	 					console.log(usr)
	 					// Obtener el token del usuario registrado
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
							$localStorage.token = token	
	 						$state.go('userprofile')
						}, function (err) {
							console.log(err)
						})
	 				}, function (err) {
	 					console.log(err)
	 				})
	 			}
	 		}else{
	 			// Si ya existe el usuario
	 			$localStorage.token = token	
	 			if (userService.isTokenValidAsDigdeeper(token)) {
	 				$state.go('digdeeperprofile')
	 			}
				if (userService.isTokenValidAsUser($localStorage.token)) {
					$state.go('userprofile')
				}
	 		}
	 	}, function (err) {
	 		console.log(err)
	 	})
	  });
	});
  	

  	/////////
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
	    allowLogin: false
	    //autoclose: true 
	}
	$rootScope.lockRegister = new Auth0Lock('WneauBfFMFe4q4EJ76FPLm47TKsInbI_', 'creainte2.auth0.com', options2);
	//console.log(lock)
	///////////////
 	//$rootScope.lock.options.allowSignUp = false
	$rootScope.lockRegister.on("authenticated", function(authResult) {
		console.log(authResult)
	  	lock.getUserInfo(authResult.accessToken, function(error, profile) {
	    if (error) {
	      // Handle error
	      return;
	    }
	    console.log(profile)
	 	localStorage.setItem("accessToken", authResult.accessToken);
	    localStorage.setItem("profile", JSON.stringify(profile));
	    var id_auth0 = profile.sub
	    var profile = profile
	    userService.getTokenByIdAuth0(String(id_auth0), function (token) {
	 		//console.log(token)
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
	 					console.log(usr)
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
							$localStorage.token = token	
	 						$state.go('userprofile')
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
	 					console.log(usr)
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
							$localStorage.token = token	
	 						$state.go('userprofile')
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
	 					console.log(usr)
	 					// Obtener el token del usuario registrado
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
							$localStorage.token = token	
	 						$state.go('userprofile')
						}, function (err) {
							console.log(err)
						})
	 				}, function (err) {
	 					console.log(err)
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
	  });
	});

	$rootScope.lockRegister2 = new Auth0Lock('WneauBfFMFe4q4EJ76FPLm47TKsInbI_', 'creainte2.auth0.com', options2);
	//console.log(lock)
	///////////////
 	//$rootScope.lock.options.allowSignUp = false
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
	    var id_auth0 = profile.sub
	    var profile = profile
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
	 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
	 				userService.registerUserBySocialRed(data_user, function (usr) {
	 					console.log(usr)
	 					// Obtener el token del usuario registrado
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
							$localStorage.token = token	
	 						$state.go('digdeeperprofile')
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
						roll: "digdeeper",
						auth0Id: id_auth0,
						urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
	 				}
	 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
	 				userService.registerUserBySocialRed(data_user, function (usr) {
	 					console.log(usr)
	 					// Obtener el token del usuario registrado
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
							$localStorage.token = token	
	 						$state.go('digdeeperprofile')
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
						roll: "digdeeper",
						auth0Id: id_auth0,
						urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
	 				}
	 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
	 				userService.registerUserBySocialRed(data_user, function (usr) {
	 					console.log(usr)
	 					// Obtener el token del usuario registrado
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
							$localStorage.token = token	
	 						$state.go('digdeeperprofile')
						}, function (err) {
							console.log(err)
						})
	 				}, function (err) {
	 					console.log(err)
	 				})
	 			}
	 		}else{
	 			// Si ya existe el usuario
	 			$localStorage.token = token	
	 			$state.go('digdeeperprofile')
	 		}
	 	}, function (err) {
	 		console.log(err)
	 	})
	  });
	});
});

app.constant('APP_SETTINGS',  {
	CONEKTA: {
		CONEKTA_API_KEY: 'key_DqhyLfkMLbu2m6rU54CLDmQ',
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