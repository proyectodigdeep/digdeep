var userEntity = require("./userEntity")
var userService = require("./services/userService")

exports.create = function (data, onSuccess, onError){
	
	// Checar si existe el usuario
	this.findByEmail(data.email, function(user) {
		if (user)
			onError("Ya existe un usuario con ese correo registrado")
		else{
			// Proteger la contraseña codificandola con un salero
			userService.protectPassword(data.password, function(saltyPass, salt) {

				// Crear un usuario
				var user = new userEntity()
					user.fullname 		= data.name
					user.birthdate 		= data.birthdate
				    user.email 			= data.email
				    user.password 		= saltyPass
				    user.phone 			= data.phone
				    user.address		= data.address
				    user.numberHouse	= data.numberHouse
				    user.postalCode 	= data.postalCode
				    user.colony 		= data.colony
				    user.temp_service 	= data.service
				  	user.specialty 		= data.specialty
				  	user.city 			= data.city
				  	user.state 			= data.state
				  	user.roles 			= data.roll
				  	user.urlImg 		= data.urlImg
				    user.salt 			= salt
				    user.verified 		= false
				    user.gender 		= data.gender
				    user.budget 		= data.budget
				    user.webPage		= data.webPage
					user.fanPage 		= data.fanPage
					user.instagram 		= data.instagram
					user.rfc			= data.rfc
					user.logo 			= data.logo
				    user.dateRegister 	= new Date()
				    user.kindServices 	= data.kindServices
				    user.categoriesServices = data. categoriesServices 
				    //user.services 		= data.services
				    user.postedServices  	= data.postedServices
					user.myServicesRequested= data.myServicesRequested
					user.auth0Id 			= data.auth0Id
					user.service_time 		= data.service_time
					user.email_verified 	= data.email_verified
			    // Persistir al usuario
			    user.save(function (err, user) {
					if(err)
						onError(err)
					else
						onSuccess(user)
				})
			}, onError)
		}
	}, onError)
}

exports.registerUser = function (data, onSuccess, onError){
	// Crear un usuario
	var user = new userEntity()
		user.fullname 		= data.name
		user.birthdate 		= data.birthdate
	    user.email 			= data.email
	    user.phone 			= data.phone
	    user.address		= data.address
	    user.numberHouse	= data.numberHouse
	    user.postalCode 	= data.postalCode
	    user.colony 		= data.colony
	    user.temp_service 	= data.service
	  	user.specialty 		= data.specialty
	  	user.city 			= data.city
	  	user.state 			= data.state
	  	user.roles 			= data.roll
	  	user.urlImg 		= data.urlImg
	    user.verified 		= false
	    user.gender 		= data.gender
	    user.budget 		= data.budget
	    user.webPage		= data.webPage
		user.fanPage 		= data.fanPage
		user.instagram 		= data.instagram
		user.rfc			= data.rfc
		user.logo 			= data.logo
	    user.dateRegister 	= new Date()
	    user.kindServices 	= data.kindServices
	    user.categoriesServices = data.categoriesServices 
	    user.postedServices  	= data.postedServices
		user.myServicesRequested= data.myServicesRequested
		user.auth0Id 			= data.auth0Id
		user.service_time 		= data.service_time
		user.email_verified 	= data.email_verified
    // Persistir al usuario
    user.save(function (err, user) {
		if(err)
			onError(err)
		else
			onSuccess(user)
	})
}


exports.find = function (id, onSuccess, onError) {
	userEntity.findOne({ _id: id }, function (err, user){
		if (err)
			onError(err)
		else
			onSuccess(user)
	})
}

exports.findByEmail = function (email, onSuccess, onError) {
	userEntity.findOne({ "email": email }, function (err, user){
		if (err){
			onError(err)
		}
		else{
			onSuccess(user)
		}
	})
}

exports.findByIdAuth0 = function (id_auth0, onSuccess, onError) {
	//console.log(id_auth0)
	userEntity.findOne({ "auth0Id": id_auth0 }, function (err, user){
		if (err){
			onError(err)
		}
		else{
			onSuccess(user)
		}
	})
}

exports.findProviders = function (onSuccess, onError) {
	userEntity.find({"roles": "digdeeper" }, function (err, users){
		if (err){
			onError(err)
		}
		else{
			onSuccess(users)
		}
	})
}
exports.findBySubcategoryService = function (idSubcategory, onSuccess, onError) {
	userEntity.find({ "temp_service": idSubcategory,"verified":true}, function (err, users){
		if (err)
			onError(err)
		else
			onSuccess(users)
	})
}
exports.update = function (user,protectPass ,onSuccess, onError) {
	if (protectPass === true) {
		// Proteger la contraseña codificandola con un salero
		userService.protectPassword(user.password, function(saltyPass, salt) {
			user.password = saltyPass
			user.salt = salt
			user.save(function (err, user) {
				if(err)
					onError(err)
				else
					onSuccess(user)
			})		   
		}, onError)
	}else{
		user.save(function (err, user) {
			if(err)
				onError(err)
			else
				onSuccess(user)
		})	
	}
}

exports.deleteOne = function (id, onSuccess, onError) {
	userEntity.remove({ _id: id }, function (err){
		if (err)
			onError(err)
		else
			onSuccess()
	})
}

exports.findAll = function (onSuccess, onError) {
	userEntity.find({}, function (err, users){
		if (err)
			onError(err)
		else
			onSuccess(users)
	})
}
