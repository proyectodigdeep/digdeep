var userRepository = require("../domain/userRepository")
var userDomainService = require('../domain/services/userService')

exports.create = function(data, onSuccess,onError){
	if (typeof data.email != 'string' || typeof data.password != 'string')
		return onError("El correo y la contraseña deben ser strings")
	else{
		userRepository.create(data, function(user){
			onSuccess(user)
		},onError)
	}
}

exports.registerUser = function(data, onSuccess,onError){
	userRepository.registerUser(data, function(user){
		onSuccess(user)
	},onError)
}

exports.verifyUserByEmail = function(data, onSuccess,onError){
	if (typeof data.email != 'string')
		return onError("El correo y la contraseña deben ser strings")
	else{
		userRepository.findByEmail(data.email, function(user){
			if (user != null) {
				onSuccess(user)
			}else{
				onError("failure")
			}
		},onError)
	}
}
exports.getDataUserToService = function (idDigdeeper, onSuccess, onError) {
	userRepository.find(idDigdeeper, function (user) {
		if (user) {
			var digdeeper ={
				picture: user.urlImg,
				name: user.fullname
			}
			onSuccess(digdeeper)
		}else{
			onError
		}
	},onError)
}

exports.getUser = function (id, onSuccess, onError) {
	userRepository.find(id, function (user) {
		if (user) {
			onSuccess(user)
		}	
	},onError)
}

exports.getUserByIdAuth0 = function (id_auth0, onSuccess, onError) {
	userRepository.findByIdAuth0(id_auth0, function (user) {
		onSuccess(user)
	},onError)
}

exports.updateImgProfile = function (id, url, onSuccess, onError) {
	userRepository.find(id,function (user) {
		if (user) {
			user.urlImg = url
			userRepository.update(user,false,onSuccess, onError)
		}	
	},onError)
}

exports.updatePassword = function (id, data, onSuccess, onError) {
	userRepository.find(id,function (user) {
		if (user) {
			// Verifica si los campos de las contraseñas estan vacios, para guardar 
			// directamente los datos modificados del usuario sin verifcar una contraseña
			if (data.currencyPassword === undefined  && user.newPassword === undefined) {
				//console.log("contraseñas vacias ")
				onError("Campos de contraseñas vacios")
			}else{
				//  Verifica si la contraseña que ingreso el usuario coincide con la contraseña 
				//	que era la actual en la base de datos.
				if (user.password != userDomainService.sha512(data.currencyPassword, user.salt)) {
					onError("Las Contraseñas no coinciden")
				}else{
					//console.log("actualizando correctamente")
					data.newPassword 	? user.password 	= data.newPassword : null
					data.fcmToken 		? user.fcmToken 	= data.fcmToken : null
					userRepository.update(user,true,onSuccess, onError)
				}
			}
		}	
	},onError)
}
exports.updatePasswordForget = function (id, data, onSuccess, onError) {
	userRepository.find(id,function (user) {
		if (user) {
			data.newPassword 	? user.password 	= data.newPassword : null
			data.fcmToken 		? user.fcmToken 	= data.fcmToken : null
			userRepository.update(user,true,onSuccess, onError)
		}	
	},onError)
}
exports.validateProvider = function (id, onSuccess, onError) {
	userRepository.find(id,function (user) {
		if (user) {
			user.verified = true
			userRepository.update(user,false,onSuccess, onError)
		}	
	},onError)
}
exports.disvalidateProvider = function (id, onSuccess, onError) {
	userRepository.find(id,function (user) {
		if (user) {
			user.verified = false
			userRepository.update(user,false,onSuccess, onError)
		}	
	},onError)
}

exports.updatePreferencesUser = function(id, data, onSuccess, onError) {
	userRepository.find(id, function (user) {
		if (user) {
			data.gender 			? user.gender 	= data.gender : null
			data.budget 			? user.budget 	= data.budget : null
			data.categoriesServices ? user.categoriesServices = data.categoriesServices : null
			userRepository.update(user,false, onSuccess, onError)
		}	
	},onError)
}

exports.update = function(id, data, onSuccess, onError) {
	userRepository.find(id,function (user) {
		if (user) {
			data.fullname 		? user.fullname 	= data.fullname : null
			data.birthdate 		? user.birthdate 	= data.birthdate : null
			data.email 			? user.email 		= data.email : null
			data.phone 			? user.phone 		= data.phone : null
			data.address 		? user.address 		= data.address : null
			data.numberHouse 	? user.numberHouse 	= data.numberHouse : null
			data.postalCode 	? user.postalCode 	= data.postalCode : null
			data.colony 		? user.colony 		= data.colony : null
			data.city 			? user.city 		= data.city : null
			data.state 			? user.state 		= data.state : null
			data.fcmToken 		? user.fcmToken 	= data.fcmToken : null
			data.temp_service 	? user.temp_service	= data.temp_service:null
			data.specialty		? user.specialty	= data.specialty: null
			data.descriptionCompany ? user.descriptionCompany = data.descriptionCompany: null
			data.roles  			? user.roles			  = data.roles: null
			data.customerId  		? user.customerId		  = data.customerId: null
			data.auth0Id  			? user.auth0Id		  	  = data.auth0Id: null

			data.webPage		? user.webPage = data.webPage: null
			data.fanPage 		? user.fanPage = data.fanPage: null
			data.instagram 		? user.instagram = data.instagram : null
			data.rfc			? user.rfc = data.rfc: null
			data.logo 			? user.logo = data.logo: null

			//data.services   		? user.services  		  = data.services: null
			data.postedServices   	? user.postedServices  	  	= data.postedServices: null
			data.myServicesRequested? user.myServicesRequested	= data.myServicesRequested: null
			data.calf 				? user.calf 				= data.calf : null
			data.values 			? user.values 				= data.values : null
			data.kindServices 		? user.kindServices 		= data.kindServices : null
			userRepository.update(user,false, onSuccess, onError)
		}	
	},onError)
}

exports.delete = function(id, onSuccess, onError) {
	userRepository.find(id, function(user) {
		if (user) 
			userRepository.deleteOne(id, onSuccess, onError)
		else
			onError("User not found")
	}, onError)
}
exports.findByEmail = function(email, onSuccess, onError) {
	userRepository.findByEmail(email, onSuccess, onError)
}
exports.findProviders = function(onSuccess, onError) {
	userRepository.findProviders(onSuccess, onError)
}
exports.find = function(id, onSuccess, onError) {
	userRepository.find(id, onSuccess, onError)
}
exports.findAll = function(onSuccess, onError) {
	userRepository.findAll(onSuccess, onError)
}
exports.findBySubcategoryService = function(idService,onSuccess, onError) {
	userRepository.findBySubcategoryService(idService,onSuccess, onError)
}
