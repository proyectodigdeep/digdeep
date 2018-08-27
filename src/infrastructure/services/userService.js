var config 		= require("../../../config")

var express 	= require("express")
var multer 		= require('multer')
var cloudinary 	= require ('cloudinary');
var request 	= require("request");
var jwt 		= require('jsonwebtoken')

var userApp 	= require("../../application/userApp")
var serviceApp 	= require("../../application/serviceApp")
var orderApp 	= require("../../application/orderApp")

var conektaService = require("./conektaService")

// Configuración de cloudinary (repositorio de imagenes)
cloudinary.config ({ 
   cloud_name : config.cloudinary.cloud_name, 
   api_key : 	config.cloudinary.api_key, 
   api_secret : config.cloudinary.api_secret  
})

exports.registerUser = function(req, res){
	var data = req.body
	userApp.registerUser(data, function(user) {
		res.status(201)
		res.json({
			status: "success",
			message: "usuario creado correctamente",
			user: user
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.addMethodPayToCustomer = function(req, res){
	var id_user = req.params.id
	var tokenCard = req.body.tokenId
	userApp.find(id_user, function (user) {
		var id_customer = user.customerId
		if (id_customer) {
			
			conektaService.addCardCustomer(id_customer, tokenCard, function (customer) {
				if (customer) {
					res.status(201)
					res.json({
						status: 'success', 
						payment_sources: customer.payment_sources,
						message: "Tarjeta agregada correctamente"
					})
				}else{
					res.status(400)
					res.json({status: 'failure', message: "No se encontro el customer"})
				}
			},function (err) {
				var message = "tenemos problemas con nuestros servicios, intentaló más tarde."
				if(err.details && err.details.length > 0){
					message = err.details[0].message
				}
				res.status(400)
				res.json({status: 'failure', message: message})
			})
		}else{
			var cliente = {
		        'name': user.fullname,
		        'email': user.email,
		        'phone': user.phone
		    };
			// Crear customer nuevo
			conektaService.createCustomer(cliente, tokenCard, function (customer) {
				// add customer id to client					
				user.customerId = customer.id;						
				// update client with customer id
				userApp.update(user._id, user, function (resClient) {
					res.status(201)
					res.json({
						status: 'success', 
						payment_sources: customer.payment_sources,
						message: "Tarjeta agregada correctamente"
					})
				}, function (err) {
					res.status(400)
					res.json({status: 'failure', message: "Lo sentimos no se agregar la tarjeta intentaló más tarde."})
				});
				
			}, function (err) {
				var message = "tenemos problemas con nuestros servicios, intentaló más tarde."
				if(err.details && err.details.length > 0){
					message = err.details[0].message
				}
				res.status(400)
				res.json({status: 'failure', message: message})
			})
		}
		
	}, function (err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.createUser = function(req, res){
 	var data = req.body
 	var password = data.password
 	var email = data.email
 	var name = data.name
 	var roll = data.roll
	// Registrar Usuario con Auth0
	var options = { method: 'POST',
		url: config.auth0.domain+'/dbconnections/signup',
		headers: { 'content-type': 'application/json' },
		body: 
	  	{ 	client_id: config.auth0.clientId,
		    email: email,
		    password: password,
		    connection: config.auth0.connection,
		    user_metadata: { name: name, roles: roll} 
		},
	  	json: true 
	};
	request(options, function (error, response, body) {
		//console.log(body)
		if (error){
			console.log(error)
			throw new Error(error);
			res.status(400)
			res.json({
				status: "failure",
				message: error
			})
		}else{
			if(body.statusCode == 400){
				console.log(body.message)
				res.json({
					status: "failure",
					message: body.message
				})
			}else{
				data.auth0Id = "auth0|"+body._id
				if (data.logo != "" && data.logo != undefined && data.logo != null) {
					// subir una imagen a cloudinary
					cloudinary.uploader.upload(data.logo[0], function (result) {
						data.logo = result.url
						userApp.create(data, function(user) {
							res.status(201)
							res.json({
								status: "success",
								message: "usuario creado correctamente",
								user: user
							})
						}, function(err) {
							res.status(400)
							res.json({
								status: "failure",
								message: err
							})
						})
					},{
						crop: 'fill',
						width: 100,
						height: 90
					})
				}else{
					userApp.create(data, function(user) {
						res.status(201)
						res.json({
							status: "success",
							message: "usuario creado correctamente",
							user: user
						})
					}, function(err) {
						res.status(400)
						res.json({
							status: "failure",
							message: err
						})
					})
				}
			}	
		}
	})
}

exports.verifyMethodPay = function (req, res) {
	var id_user = req.params.id
	//console.log(id_user)
	userApp.find(id_user , function (user) {
		if (user) {
			var id_customer = user.customerId
			if (id_customer) {
				// Buscar y obtener los metodos de pago de los usuarios en conekta
				conektaService.searchCustomer(id_customer, function (customer) {
					if (customer) {
						res.json({
							status: 'success', 
							payment_sources: customer.payment_sources,
							message: "Metodos de pago obtenidos correctamente"
						})
					}else{
						res.status(400)
						res.json({status: 'failure', message: "No se encontr el customer"})
					}
				},function (err) {
					res.status(400)
					res.json({status: 'failure', message: "problemas al encontrar el customer"})
				})
			}else{
				res.status(400)
				res.json({status: 'failure', message: "No hay metodos de pago registrados"})
			}
			
		}else{
			res.status(400)
			res.json({status: 'failure', message: "no se encontro el usuario"})
		}
	}, function (err) {
		res.status(400)
		res.json({status: 'failure', message: "problemas al encontrar el usuario"})
	})
	
}

exports.verifyUserByEmail= function(req,res){
 	var data = req.body
 	userApp.verifyUserByEmail(data, function(user) {
 		res.status(201)
		res.json({
			status: "success",
			message: "usuario ya registrado anteriormente correctamente",
			user: user
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}
exports.getProviders= function(req,res){
 	userApp.findProviders(function(users) {
 		res.status(201)
		res.json({
			status: "success",
			message: "proveedores obtenidos correctamente",
			users: users
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}
exports.getDataUserToService = function(req, res) {
	if (req.user.hasRole('user')){
		var idDigdeeper = req.body.idDigdeeper
		userApp.getDataUserToService(idDigdeeper, function(digdeeper) {
			//console.log(digdeeper)
			res.status(201)
			res.json({
				status: "success",
				digdeeper: digdeeper 
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}

exports.getUser = function(req,res){
	var id = req.params.id
	userApp.getUser(id, function(user) {
		res.status(201)
		res.json({
			status: "success",
			user:user
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getUserByIdAuth0 = function(req,res){
	var id_auth0 = req.params.id
	//console.log(id_auth0)
	userApp.getUserByIdAuth0(id_auth0, function(user) {
		//console.log(user)
		var token = null
		if (user != null) {
			token = jwt.sign(user, config.jwt_secret, {
				expiresIn: 60*60*24*30
			})
		}
		res.status(201)
		res.json({
			status: "success",
			token: token
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getUsersBySubcategories = function(req,res){
	var id = req.params.id
	userApp.findBySubcategoryService(id, function(users) {
		res.json({
			status: "success",
			users:users
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.updatePreferencesUser= function(req,res){
 	var idUsr = req.params.id
 	var data ={
 		gender: 			req.body.gender,
 		budget: 			req.body.budget,
 		categoriesServices: req.body.categoriesServices
 	}
 	userApp.updatePreferencesUser(idUsr, data, function(user) {
 		//console.log("Preferencias guardadas con exito "+user)
 		res.json({status: 'success', user: user})
	}, function(err) {
		res.status(400)
		res.json({status: 'failure', message: err})
	})
}
exports.validateProvider= function(req,res){
 	userApp.validateProvider(req.params.id, function(user) {
 		res.status(201)
 		res.json({
 			status: 'success', 
 			user: user
 		})
	}, function(err) {
		res.status(400)
		res.json({status: 'failure', message: err})
	})
}
exports.disvalidateProvider= function(req,res){
 	userApp.disvalidateProvider(req.params.id, function(user) {
 		res.status(201)
 		res.json({
 			status: 'success', 
 			user: user
 		})
	}, function(err) {
		res.status(400)
		res.json({status: 'failure', message: err})
	})
}
exports.updateImgUsr= function(data){
 	//console.log(data)
 	userApp.updateImgProfile(data.id, data.url, function(user) {
 		orderApp.getOrders(function (orders) {
 			for (var i = 0; i < orders.length; i++) {
 				// Cambia las imagenes de todas las ordenes donde aparece este usuario como digdeeper
 				if (String(orders[i].digdeeper) === String(user._id)) {
 					var orderTemp = orders[i]
 					orderTemp.dataService.imgDD = user.urlImg
 					orderApp.update(orderTemp, function (order) {
 						//console.log("bien echo digdeeper")
 					},function (err) {
 						console.log(err)
 					})
 				}
 				// Cambia las imagenes de todas las ordenes donde aparece este usuario como 'cliente'
				if (String(orders[i].client) === String(user._id)) {
					var orderTemp = orders[i]
 					orderTemp.dataService.imgUser = user.urlImg
 					orderApp.update(orderTemp, function (order) {
 						//console.log("bien echo cliente")
 					},function (err) {
 						console.log(err)
 					})
				}
 			}
 		},function (err) {
 			console.log(err)
 		})
 		//console.log(" Foto de perfil actualizada con exito "+user.urlImg)
	}, function(err) {
		console.log(" No se pudo actualizar la foto de perfil")
	})
}

exports.updatePasswordUser = function (req, res, next) {
	if (JSON.stringify(req.user._id) === JSON.stringify(req.params.id)) { // El mismo usuario se está actulaizando
		var userData = {}
		req.body.fcmToken 			? userData.fcmToken 	= req.body.fcmToken : null
		req.body.currencyPassword 	? userData.currencyPassword	= req.body.currencyPassword:null
		req.body.newPassword 		? userData.newPassword		= req.body.newPassword:null
		
		userApp.updatePassword(req.params.id, userData, function(user) {
			res.json({status: 'success', user: user})
			//console.log(password actualizado correctamente)
		}, function(err) {
			res.status(400)
			res.json({status: 'failure', message: err})
		})
	}
	else{
		res.status(403)
		res.json({status: 'failure', message: "No eres el propietario de esta cuenta"})
	}
}
exports.updatePasswordUserForget = function (req, res, next) {
	var dateTemp = new Date()
	var passwordTemp = "digdeepkey"+String(dateTemp.getDate())+String(dateTemp.getFullYear())+String(dateTemp.getHours())+String(dateTemp.getMilliseconds())+String(Math.random() * (10000 - 1000) + 1000)
	console.log(passwordTemp)
	var userData = {newPassword: ""}
	userData.newPassword = passwordTemp
	userApp.updatePasswordForget(req.params.id, userData, function(user) {
		res.json({status: 'success', user: user, passwordTemp: passwordTemp})
		//console.log(password actualizado correctamente)
	}, function(err) {
		res.status(400)
		res.json({status: 'failure', message: err})
	})
}

exports.updateUserToDigdeeper = function(req, res, next) {
	if (JSON.stringify(req.user._id) === JSON.stringify(req.params.id)) { // El mismo usuario se está actulaizando
		var userData = {}
		req.body.fullname 	? userData.fullname 	= req.body.fullname : null
		req.body.birthdate 	? userData.birthdate 	= req.body.birthdate : null
		req.body.email 		? userData.email		= req.body.email:null
		req.body.phone 		? userData.phone		= req.body.phone:null
		req.body.address 	? userData.address		= req.body.address:null
		req.body.numberHouse? userData.numberHouse	= req.body.numberHouse:null
		req.body.postalCode ? userData.postalCode	= req.body.postalCode:null
		req.body.colony 	? userData.colony		= req.body.colony:null
		req.body.city 		? userData.city			= req.body.city:null
		req.body.state 		? userData.state		= req.body.state:null			
		req.body.fcmToken 	? userData.fcmToken 	= req.body.fcmToken : null
		req.body.temp_service 		? userData.temp_service			= req.body.temp_service:null
		req.body.specialty			? userData.specialty			= req.body.specialty: null
		req.body.descriptionCompany ? userData.descriptionCompany	= req.body.descriptionCompany: null
		//req.body.services    		? userData.services 			= req.body.services: null
		req.body.postedServices    		? userData.postedServices 		= req.body.postedServices: null
		req.body.myServicesRequested    ? userData.myServicesRequested 	= req.body.myServicesRequested: null
		userData.roles				= ['user','digdeeper']	

		
		userApp.update(req.params.id, userData, function(user) {
			res.json({status: 'success', user: user})
			//console.log(user.roles)
		}, function(err) {
			res.status(400)
			res.json({status: 'failure', message: err})
		})
	}
	else{
		res.status(403)
		res.json({status: 'failure', message: "No eres el propietario de esta cuenta"})
	}
}

exports.updateUser = function(req, res, next) {
	
	if (JSON.stringify(req.user._id) === JSON.stringify(req.params.id)) { // El mismo usuario se está actulaizando
		var userData = {}
		req.body.fullname 	? userData.fullname 	= req.body.fullname : null
		req.body.birthdate 	? userData.birthdate 	= req.body.birthdate : null
		req.body.email 		? userData.email		= req.body.email:null
		req.body.phone 		? userData.phone		= req.body.phone:null
		req.body.address 	? userData.address		= req.body.address:null
		req.body.numberHouse? userData.numberHouse	= req.body.numberHouse:null
		req.body.postalCode ? userData.postalCode	= req.body.postalCode:null
		req.body.colony 	? userData.colony		= req.body.colony:null
		req.body.city 		? userData.city			= req.body.city:null
		req.body.state 		? userData.state		= req.body.state:null		
		req.body.fcmToken 	? userData.fcmToken 	= req.body.fcmToken : null
		req.body.myServicesRequested    ? userData.myServicesRequested 	= req.body.myServicesRequested: null
		userApp.update(req.params.id, userData, function(user) {
			res.json({status: 'success', user: user})
		}, function(err) {
			res.status(400)
			res.json({status: 'failure', message: err})
		})
	}
	else{
		res.status(403)
		res.json({status: 'failure', message: "No eres el propietario de esta cuenta"})
	}
}

exports.updateUserDDiper = function(req, res, next) {
	//console.log(req.body)
	if (JSON.stringify(req.user._id) === JSON.stringify(req.params.id)) { // El mismo usuario se está actulaizando
		var userData = {}
		req.body.fullname 	? userData.fullname 	= req.body.fullname : null
		req.body.birthdate 	? userData.birthdate 	= req.body.birthdate : null
		req.body.email 		? userData.email		= req.body.email:null
		req.body.phone 		? userData.phone		= req.body.phone:null
		req.body.address 	? userData.address		= req.body.address:null
		req.body.numberHouse? userData.numberHouse	= req.body.numberHouse:null
		req.body.postalCode ? userData.postalCode	= req.body.postalCode:null
		req.body.colony 	? userData.colony		= req.body.colony:null
		req.body.city 		? userData.city			= req.body.city:null
		req.body.state 		? userData.state		= req.body.state:null		
		req.body.fcmToken 	? userData.fcmToken 	= req.body.fcmToken : null
		req.body.temp_service 		? userData.temp_service			= req.body.temp_service:null
		req.body.specialty			? userData.specialty			= req.body.specialty: null
		req.body.descriptionCompany ? userData.descriptionCompany	= req.body.descriptionCompany: null
		//req.body.services    		? userData.services 			= req.body.services: null
		req.body.postedServices    		? userData.postedServices 		= req.body.postedServices: null
		req.body.myServicesRequested    ? userData.myServicesRequested 	= req.body.myServicesRequested: null
		req.body.kindServices    		? userData.kindServices 		= req.body.kindServices: null
		
		req.body.webPage		? userData.webPage = req.body.webPage: null
		req.body.fanPage 		? userData.fanPage = req.body.fanPage: null
		req.body.instagram 		? userData.instagram = req.body.instagram : null
		req.body.rfc			? userData.rfc = req.body.rfc: null
		req.body.logo 			? userData.logo = req.body.logo : null
		userApp.update(req.params.id, userData, function(user) {
			res.status(201)
			res.json({status: 'success', user: user})
		}, function(err) {
			res.status(400)
			res.json({status: 'failure', message: err})
		})
	}
	else{
		res.status(403)
		res.json({status: 'failure', message: "No eres el propietario de esta cuenta"})
	}
}