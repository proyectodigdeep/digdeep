var mongoose = require("mongoose")

var userSchema = new mongoose.Schema({
	fullname: 				String,
	birthdate: 				String,
	email: 					String,
	password: 				String,
	phone: 					String,
	address: 				String,
	numberHouse: 			Number,
	postalCode: 			Number,
	colony: 				String,   
	temp_service: 			String,
	specialty: 				String,
	descriptionCompany: 	String,
	city: 					String,
	state: 					String,
	roles: 					[String],
	salt: 					String,
	verified: 				Boolean,
	fcmToken: 				String,
	lastSeen:       		Date,
	urlImg: 				String,
	gender: 				String,
	budget: 				Number,
	categoriesServices:     [String],
	calf: 					Number,
	values: 				[Number],
	dateRegister: 			Date,
	webPage: 				String,
	fanPage: 				String,
	instagram: 				String,
	rfc: 					String,
	logo: 					String,
	customerId:				String, // conekta customer id
	auth0Id: 				String, // auth0 user id
	kindServices: 			[String],	
	//services:    			[mongoose.Schema.Types.ObjectId]
	postedServices: 		[mongoose.Schema.Types.ObjectId], // Servicios que el usuario digdeeper postea
	myServicesRequested: 	[mongoose.Schema.Types.ObjectId], // Ordenes con los servicios que el usuario solicita
	service_time: {
		init: Date,
		finish: Date
	}
})

// Métodos
userSchema.methods.hasRole = function(role) {
    if (this.roles.indexOf(role) != -1)
    	return true
    else
    	return false
}

module.exports = mongoose.model("Users",userSchema)