var serviceEntity = require("./serviceEntity")

exports.create = function (data, onSuccess, onError){
	var service = new serviceEntity()
		service.title 			= data.title
		service.pictures 		= data.pictures
		service._category 		= data.category._id
		service._subcategory	= data.subcategory._id
		service.price_athome	= data.price_athome
		service.price_presencial= data.price_presencial
		service.description 	= data.description
		service._digdeeper 		= data.userId
		service.filters 		= data.filters

	service.save(function(err,service){
		if(err) return onError(err)
		else return onSuccess(service)
	})	
}

exports.find = function(id, onSuccess, onError) {
	serviceEntity.findOne({"_id": id}).exec(function(err, service) {
		if (err) return onError("Hubo un error al obtener un servicio: "+ err)
		else return onSuccess(service)
	})
}

exports.findAll = function(onSuccess, onError) {
	serviceEntity.find({}).exec(function(err, services) {
		if (err) return onError("Hubo un error al obtener todos los servicios: "+ err)
		else return onSuccess(services)
	})
}
exports.findAllByDigdeeper = function(id,onSuccess, onError) {
	serviceEntity.find({"_digdeeper": id}).exec(function(err, services) {
		if (err) return onError("Hubo un error al obtener todos los servicios: "+ err)
		else return onSuccess(services)
	})
}

exports.update = function(service, data, onSuccess, onError) {
	var backComments = []
	if (data.comment) {
		backComments = service.comments
		backComments.push(data.comment)
		service.comments = backComments
	}
	backComments.push(data.comment) 
	service.title 			= (data.title != null) ? data.title: service.title
	service.pictures 		= (data.pictures != null) ? data.pictures: service.pictures
	service._category 		= (data._category != null) ? data._category: service._category
	service._subcategory 	= (data._subcategory != null) ? data._subcategory: service._subcategory
	service.price_athome 	= (data.price_athome != null) ? data.price_athome: service.price_athome
	service.price_presencial= (data.price_presencial != null) ? data.price_presencial: service.price_presencial
	service.description 	= (data.description != null) ? data.description: service.description
	service.filters         = (data.filters != null) ? data.filters: service.filters
	service.values          = (data.values != null) ? data.values: service.values
	
	service.save(function (err,service){
		if(err) return onError(err)
			else return onSuccess(service)
	})
}

exports.delete = function(category, onSuccess, onError) {
	category.remove(function(err) {
		if (err) return onError("Hubo un error al borrar la categoria "+category._id+": "+err)
		else return onSuccess()
	})

}


