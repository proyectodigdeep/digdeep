var jwt = require('jsonwebtoken')

var config = require('../../../config')
var userApp = require('../../application/userApp')
var userDomainService = require('../../domain/services/userService')

exports.authenticate = function(req, res) {

	userApp.findByEmail(req.body.email, function(user) {
		if (!user){
			res.status(403)
			res.json({status:'failure', message: 'Authentication failed. User not found.'})
		}
		else if (user.password != userDomainService.sha512(req.body.password, user.salt)) {
			res.status(403)
			res.json({ success: false, message: 'Authentication failed. Wrong password.' })
		} else {

			// No queremos pasar informacion de acceso
			user.salt = undefined
			user.password = undefined

			// if user is found and password is right
			// create a token
			var token = jwt.sign(user, config.jwt_secret, {
				expiresIn: 60*60*24*30
			})

			// return the information including token as JSON
			res.json({
				success: true,
				message: 'Enjoy your token!',
				token: token
			}) 
		}

	}, function(err) {
		res.status(400)
		res.json({status:'failure', message: err})
	})

}

exports.generateTokenUserByIdAuth0 = function (req, res, next) {
	var id_auth0 = req.params.id
	userApp.getUserByIdAuth0(id_auth0, function(user) {
		if (user != null) {
			var token = jwt.sign(user, config.jwt_secret, {
				expiresIn: 60*60*24*30
			})
			res.json({
				status: "success",
				token: token
			})	
		}else{
			res.status(400)
			res.json({
				status: "failure",
				message: "usuario no encontrado"
			})
		}
			
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: "Error al generar el token"
		})
	})
}

exports.verifyToken = function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token']

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.jwt_secret, function(err, decoded) {      
			if (err) {
				res.status(403)
				return res.json({ success: false, message: 'Failed to authenticate token.' });   
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded
				next()
			}
		})

	} else {

		// if there is no token
		// return an error
		return res.status(403).json({ 
		    success: false, 
		    message: 'No token provided. It is mandatory to be authenticated in order to use this API.' 
		})

	}
}

exports.setUser = function(req, res, next) {
	userApp.find(req.decoded._doc._id, function(user) {
		req.user = user
		next()
	}, function() {
		console.log("Error al obtener el usuario")
	})
}
