var express 	= require("express")
var serviceApp 	= require("../../application/serviceApp")
var userApp 	= require("../../application/userApp")
var commentApp 	= require("../../application/commentApp")
var cloudinary 	= require('cloudinary');

/*cloudinary.config ({ 
   cloud_name: 	'digdeep-ci', 
   api_key: 	'915899137598222', 
   api_secret: 	'S44w1I3EYff13XDhpHhbBw73y0E'  
})*/
// Configuración para cloudinary(repositorio de imagenes)
cloudinary.config ({ 
   cloud_name : 'dclbqwg59', 
   api_key : 	'653143988463315', 
   api_secret : '-c3U7xL23IEyZ3-vOY387yms29A'  
})

exports.createService= function(req,res){
	var data = req.body
 	var arrayImgTempService = req.body.pictures
 	var arrayCloudUrlsImgs =[] 
 	if (arrayImgTempService.length > 0) {
		for (var i = 0; i < arrayImgTempService.length; i++) {
			// Sube las fotos del serivicio a cloudinary
			cloudinary.uploader.upload (arrayImgTempService[i], function (result) {
				// Ingresa al arreglo las urls obtenidas por cloudinary de cada foto
				arrayCloudUrlsImgs.push(result.url)
				// Compara si el numero de imagenes subidas a cloudinary son el mismo numero de imagenes 
				// que se querian subir para mandar el arreglo final(con url´s de las imagenes)
				if (arrayCloudUrlsImgs.length === arrayImgTempService.length) {
					data.pictures = arrayCloudUrlsImgs
					serviceApp.create(data, function(service) {
						res.status(201)
						res.json({
							status: "success",
							message: "Servicio creado correctamente",
							service: service
						})
					}, function(err) {
						res.status(400)
						res.json({
							status: "failure",
							message: err
						})
					})
				}
			},{
				// Ajusta el tamaño de la imagen y le asigna un id unico
				//	public_id: req.body.idUserProfile, 
				crop: 'fill',
				width: 426,
				height: 266
			})
		}
 	}else{
		serviceApp.create(data, function(service) {
			res.status(201)
			res.json({
				status: "success",
				message: "Servicio creado correctamente",
				service: service
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

exports.getServices = function(req, res) {
	serviceApp.getServices(function(services) {
		res.json({
			status: "success",
			services: services
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}
exports.getServicesByDigdeeper = function (req,res) {
	serviceApp.getServicesByDigdeeper(req.params.id,function(services) {
		res.status(201)
		res.json({
			status: "success",
			services: services
		})
	},function (err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}
exports.getHigherPriceOfServices = function (req,res) {
	var id = req.params.id
	userApp.getUser(id , function (user) {
		if (user) {
			serviceApp.getServicesByDigdeeper(id, function(services) {
				if (services.length > 0) {
					if (user.kindServices.length == 1) {
						var tipo_servicio = user.kindServices[0]
						if (tipo_servicio == 'athome') {
							var items_athome = services
							items_athome.sort(function (a, b) {
							  if (a.price_athome < b.price_athome) {
							    return 1;
							  }
							  if (a.price_athome > b.price_athome) {
							    return -1;
							  }
							  // a must be equal to b
							  return 0;
							});
							console.log("****Precios a athome****")
							res.status(201)
							res.json({
								status: "success",
								higher_price: items_athome[0].price_athome
							})
						}else{
							if (tipo_servicio == 'presencial') {
								var items_presencial = services
								items_presencial.sort(function (a, b) {
								  if (a.price_presencial < b.price_presencial) {
								    return 1;
								  }
								  if (a.price_presencial > b.price_presencial) {
								    return -1;
								  }
								  // a must be equal to b
								  return 0;
								});
								console.log("****Precios presencial****")
								res.status(201)
								res.json({
									status: "success",
									higher_price: items_presencial[0].price_presencial
								})
							}
						}
					}else{
						if (user.kindServices.length == 2) {
							var items_athome = services
							items_athome.sort(function (a, b) {
							  if (a.price_athome < b.price_athome) {
							    return 1;
							  }
							  if (a.price_athome > b.price_athome) {
							    return -1;
							  }
							  // a must be equal to b
							  return 0;
							});

							var items_presencial = services
							items_presencial.sort(function (a, b) {
							  if (a.price_presencial < b.price_presencial) {
							    return 1;
							  }
							  if (a.price_presencial > b.price_presencial) {
							    return -1;
							  }
							  // a must be equal to b
							  return 0;
							});
							console.log("****Ambos Precios****")
							if (items_athome[0].price_athome > items_presencial[0].price_presencial) {
								res.status(201)
								res.json({
									status: "success",
									higher_price: items_athome[0].price_athome
								})
							}else{
								res.status(201)
								res.json({
									status: "success",
									higher_price: items_presencial[0].price_presencial
								})
							}

						}
					}
				}else{
					res.status(201)
					res.json({
						status: "success",
						higher_price: 50000000
					})
				}
			},function (err) {
				res.status(400)
				res.json({
					status: "failure",
					message: err
				})
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
exports.getServicesByDigdeeperComments = function(req, res) {
	serviceApp.getServicesByDigdeeper(req.params.id,function(services) {
		//console.log(services)
		commentApp.findAllByDigdeeper(req.params.id,function (comments) {
			var arrayTemp = []
			var i = 0 // servicios
			for (var j = 0; j < comments.length; j++) {
				if (i < services.length) {
					var numComments = services[i].comments.length
					if (String(services[i].comments[numComments-1]) === String(comments[j]._id)) {	
						var datat={
							service: services[i],
							comment1: comments[j],
							comment2: null
						}
						j = 0
						i++
						arrayTemp.push(datat)
					}
				}else{
					j = comments.length
				}
				if (j+1 === comments.length) {
					var datat={
						service: services[i],
						comment1: null,
						comment2: null
					}
					arrayTemp.push(datat)
					j = 0
					i++
				}
			}

			i = 0 // servicios
			for (var j = 0; j < comments.length; j++) {
				if (i < services.length) {
					var numComments = services[i].comments.length
					if (String(services[i].comments[numComments-2]) === String(comments[j]._id)) {	
						arrayTemp[i].comment2 = comments[j]
						j = 0
						i++
					}
				}else{
					j = comments.length
				}
				if (j+1 === comments.length) {
					j = 0
					i++
				}
			}
			if (comments.length === 0) {
				for (var s = 0; s < services.length; s++) {
					var datat = {
						service: services[s],
						comment1: null,
						comment2: null
					}
					arrayTemp.push(datat)
				}
				//console.log(arrayTemp)
				res.status(201)
				res.json({
					status: "success",
					services: arrayTemp
				})
			}else{
				//console.log(arrayTemp)
				res.status(201)
				res.json({
					status: "success",
					services: arrayTemp
				})	
			}
		},function (err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getService = function(req, res) {
	var id = req.params.id
	serviceApp.getService(id,function(service) {
		res.json({
			status: "success",
			service:service
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}
exports.addComment = function (req,res) {
	if (req.user.hasRole('user')) {
		var data = req.body
		var id = req.params.id
		serviceApp.updateService(id, data,function(service) {
			res.json({
				status: "success",
				message: "Servicio actualizado",
				service:service
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

exports.updateService = function (req,res) {
	
	if (req.user.hasRole('digdeeper')){
		var id 	 = req.params.id
		var data = req.body

		var arrayImgTempService = req.body.pictures
		var arrayCloudUrlsImgs =[] 
		for (var i = 0; i < arrayImgTempService.length; i++) {
		// Sube las fotos del serivicio a cloudinary
			cloudinary.uploader.upload (arrayImgTempService[i], function (result) {
				// Ingresa al arreglo las urls obtenidas por cloudinary de cada foto
				arrayCloudUrlsImgs.push(result.url)
				// Compara si el numero de imagenes subidas a cloudinary son el mismo numero de imagenes 
				// que se querian subir para mandar el arreglo final(con url´s de las imagenes)
				if (arrayCloudUrlsImgs.length === arrayImgTempService.length) {
					data.pictures = arrayCloudUrlsImgs
					serviceApp.updateService(id, data, function(service) {
					res.json({
						status: "success",
						message: "Servicio actualizado",
						service:service
					})
					}, function(err) {
						res.status(400)
						res.json({
							status: "failure",
							message: err
						})
					})
				}
			},{
				// Ajusta el tamaño de la imagen y le asigna un id unico
				//public_id: req.body.idUserProfile, 
				crop: 'fill',
				width: 426,
				height: 266
			})
		}
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}

// Borrar un servicio de la cuenta de un usuario digdeeper
exports.deleteService = function(req, res) {
	var id = req.params.id
	serviceApp.deleteService(id, function() {
		res.json({
			status: "success",
			message: "Servicio eliminado : "+id
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}